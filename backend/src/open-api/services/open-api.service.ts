import { Inject, Injectable, Logger } from "@nestjs/common";
import { OpenAI } from 'openai';
import { IS3OptionAttributes, OpenAiConfig } from "../../configuration/interfaces";
import { S3Service } from "../../file";
import { IItemAttributes, IReceiptReq } from "common";

@Injectable()
export class OpenApiService {
  private readonly logger = new Logger(OpenApiService.name);
  private readonly openAiConfig: OpenAiConfig;
  private readonly s3Config: IS3OptionAttributes;
  private readonly openai: OpenAI;

  constructor(
    @Inject('OPEN_AI_CONFIG') config: OpenAiConfig,
    @Inject('S3_CONFIG') s3Config: IS3OptionAttributes,
    private readonly s3Service: S3Service,
    openaiClient?: OpenAI,
  ) {
    this.openAiConfig = config;
    this.s3Config = s3Config;
    this.openai = openaiClient ?? new OpenAI({ apiKey: this.openAiConfig.key });
  }

  /** Extract image information
   * @param key - key of uploaded file
   */
  async extractReceiptDetails(key: string): Promise<IReceiptReq> {
    this.logger.log(`Processing receipt details from image: ${key}`);
    try {
      const imageUrl = await this.s3Service.getSignedUrl(key);
      const response = await this.openai.chat.completions.create({
        model: 'o4-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract given details in JSON format vendor name(vendorName), creation date(creationDate), currency(currency), total cost(totalCost) GST or Tax(tax), and list of items in array items(name,price)' },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ]
      });

      const content = response.choices[0].message.content;

      if (!content || !content.trim()) {
        this.logger.error('OpenAI returned an empty response');
        throw new Error('Invalid or empty AI model response');
      }

      let parsedJson;
      try {
        parsedJson = this.parseOpenAiJsonResponse(content);
      } catch (e) {
        this.logger.error(`Failed to parse AI response: ${(e as Error).message}`);
        throw new Error('Failed to parse AI response');
      }

      if (!parsedJson || Object.keys(parsedJson).length === 0) {
        throw new Error('Parsed JSON is empty');
      }

      return this.transformToReceiptFormat(parsedJson);
    } catch (e) {
      this.logger.error(`Error processing receipt details from image: ${(e as Error).message}`);
      throw e;
    }
  }

  // Parse AI response to JSON
  private parseOpenAiJsonResponse(json?: string | null): Record<string, any> {
    const cleaned = json ? json
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .trim() : '{}';

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error('Failed to parse JSON:', err);
      throw new Error('Invalid JSON format');
    }
  }

  // Transform AI response to IReceiptReq
  private transformToReceiptFormat(input: any): IReceiptReq {
    const items: Omit<IItemAttributes, 'uuid'>[] = [];
    if (Array.isArray(input.items)) {
      input.items.forEach((item: any) => {
        if (item.name?.trim()) {
          items.push({ name: item.name?.trim() || '', price: Number(item.price) || 0 })
        }
      })
    }
    const total = Number(input.totalCost) || items.reduce((sum, i) => sum + i.price, 0);

    return {
      vendorName: input.vendorName?.trim() || '',
      creationDate: input.creationDate || '',
      currency: input.currency || 'SGD',
      totalCost: total,
      tax: Number(input.tax) || 0,
      items: items as IItemAttributes[]
    };
  }
}
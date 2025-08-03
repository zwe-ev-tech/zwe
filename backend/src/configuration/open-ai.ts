import { ConfigService } from "@nestjs/config";
import { OpenAiConfig } from "./interfaces";

export const openAiConfigFactory = (configService: ConfigService): OpenAiConfig => ({
  key: configService.get<string>('OPEN_AI_KEY') || ''
});
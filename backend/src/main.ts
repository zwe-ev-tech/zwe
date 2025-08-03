import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './modules';

async function bootstrap() {
    const adapter = new FastifyAdapter();
    await adapter.register(require('@fastify/multipart'), { throwFileSizeLimit: false });
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule, adapter
    );
    app.enableCors({
        origin: 'http://localhost:61000',
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.setGlobalPrefix('/api');
    await app.listen(process.env.PORT ?? 61001);
}
bootstrap();

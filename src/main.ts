import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseTransformInterceptor } from './response-transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new ResponseTransformInterceptor());

    // swagger config
    const docConfig = new DocumentBuilder()
    .setTitle('Twitter API')
    .setDescription('Twitter API to copy twitter funcionalities')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Twitter Copy Documentation',
    });

    await app.listen(8082);
}
bootstrap();

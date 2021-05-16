import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './api/response-transform.interceptor';
import * as config from 'config';

async function bootstrap() {
    const logger = new Logger('bootstrap'); // bootstrap - context
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new ResponseTransformInterceptor());

    const validationPipe = new ValidationPipe({
        exceptionFactory: (errors) => {
            const errorMessages = {};

            errorMessages['statusCode'] = 400;

            errors.forEach(error => {
                const constraints = [];

                Object.keys(error.constraints).forEach(k => {
                    const message = error.constraints[k];
                    constraints.push({
                        typeOfViolation: k,
                        message,
                    })
                })

                errorMessages[error.property] = constraints;
            })

            return new BadRequestException(errorMessages);
        }
    });
    app.useGlobalPipes(validationPipe);
    // app.useGlobalFilters(new BadRequestExceptionFilter());

    // swagger config
    const docConfig = new DocumentBuilder()
    .setTitle('Twitter API')
    .setDescription('Twitter API to copy twitter functionalities')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Twitter Copy Documentation',
    });

    const serverConfig = config.get('server');

    const port = process.env.PORT || serverConfig.port;

    await app.listen(port);

    logger.log('*************************************************');
    logger.log(`Application started and running in port: ${port}`);
    logger.log('*************************************************');
}
bootstrap();

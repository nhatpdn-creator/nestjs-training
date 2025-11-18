import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
    .setTitle('NodeJS training course API')
    .setDescription('API for studying NodeJS')
    .addTag('training')
    .build();
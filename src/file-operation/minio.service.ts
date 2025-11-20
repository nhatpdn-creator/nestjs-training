import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService{
    private minioClient: Minio.Client;

    constructor(private readonly config: ConfigService) {
        this.minioClient = new Minio.Client({
            endPoint: this.config.get<string>('MINIO_ENDPOINT')!, 
            port: parseInt(this.config.get<string>('MINIO_PORT')!, 10),
            useSSL: this.config.get<string>('MINIO_USE_SSL') === 'true',
            accessKey: this.config.get<string>('MINIO_ROOT_USER')!,
            secretKey: this.config.get<string>('MINIO_ROOT_PASSWORD')!,
        });
    }

    // Upload file
    async uploadFile(bucket: string, fileName: string, filePath: string) {
        return this.minioClient.fPutObject(bucket, fileName, filePath, {
            'Content-Type': 'application/octet-stream'
        });
    }

    // Download file
    async downloadFile(bucket: string, fileName: string, downloadPath: string) {
        return this.minioClient.fGetObject(bucket, fileName, downloadPath)
    }

    async ensureBucket(bucket: string) {
        const exists = await this.minioClient.bucketExists(bucket);
        if (!exists) {
            await this.minioClient.makeBucket(bucket, 'us-east-1');
        }
    }

    async getFileStream(bucket: string, fileName: string): Promise<NodeJS.ReadableStream> {
        return this.minioClient.getObject(bucket, fileName);
    }
}
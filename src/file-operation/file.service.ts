import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class FileService {
  private s3 = new S3Client({ region: 'us-east-1' }); // change region

  async uploadFile(file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: 'nestjs-bucket', // replace with your bucket
      Key: file.originalname,
      Body: file.buffer,
    });
    await this.s3.send(command);
    return { message: `File ${file.originalname} uploaded successfully!` };
  }

  async downloadFile(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: 'nestjs-bucket',
      Key: key,
    });
    const response = await this.s3.send(command);
    return response.Body as Readable;
  }
}

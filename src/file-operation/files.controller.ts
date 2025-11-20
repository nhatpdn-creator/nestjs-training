import { Controller, Param, Post, Get, UploadedFile, UseInterceptors, Res } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MinioService } from "@/minio/minio.service";
import { Writable } from "stream";

@Controller('files')
export class FilesController {
    constructor(private readonly minioService: MinioService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        await this.minioService.ensureBucket('plan_training');
        await this.minioService.uploadFile('plan_training', file.originalname, file.path);
        return { message: 'File uploaded successfully!' };
    }

    @Get('download/:filename')
    async download(@Param('filename') filename: string, @Res() res: Response) {
        const stream = await this.minioService.getFileStream('plan_training', filename);
        (stream as NodeJS.ReadableStream).pipe(res as unknown as Writable);
    }
}
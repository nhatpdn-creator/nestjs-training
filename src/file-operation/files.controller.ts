import { Controller, Param, Post, Get, UploadedFile, UseInterceptors, Res, StreamableFile } from "@nestjs/common";
import { ApiTags, ApiParam, ApiBody, ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { MinioService } from "./minio.service";
import { Readable, Writable } from "stream";

@ApiTags('File Operation')
@Controller('file-operation')
export class FilesController {
    constructor(private readonly minioService: MinioService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload a file to MinIO'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async upload(@UploadedFile() file: Express.Multer.File) {
        await this.minioService.ensureBucket('plan_training');
        await this.minioService.uploadFile('plan_training', file.originalname, file.path);
        return { message: 'File uploaded successfully!' };
    }
    
    @ApiOperation({ summary: 'Download a file from MinIO'})
    @ApiParam({ name: 'filename', required: true, description: 'Name of the file to download'})
    @Get('download/:filename')
    async download(@Param('filename') filename: string, @Res() res: Response) {
        const stream = await this.minioService.getFileStream('plan_training', filename);
        const nodeStream = stream as unknown as Readable;
        return new StreamableFile(nodeStream, { type: 'application/octet-stream' });
    }
}
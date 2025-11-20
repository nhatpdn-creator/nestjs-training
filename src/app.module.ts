import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './file-operation/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

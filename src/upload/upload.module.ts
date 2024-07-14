import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FirebaseModule } from 'src/firebase';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}

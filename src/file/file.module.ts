import { Module } from '@nestjs/common'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { UserModule } from '../user/user.module'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [UserModule, GroupModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}

import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import { FileService } from './file.service'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from '../user/user.service'
import { GroupService } from '../group/group.service'

@Controller('fileupload')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('user')
  async uploadUserAvatar(@Req() request, @Res() response) {
    const foundUser = await this.userService.findByEmail(request.user.email)
    try {
      return await this.fileService.fileUploadUser(request, response, foundUser)
    } catch (error) {
      return response.status(500).json(`e1 Failed to upload image file: ${error.message}`)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('group')
  async uploadGroupAvatar(@Req() request, @Res() response) {
    const foundUser = await this.userService.findByEmail(request.user.email)
    const group = await this.groupService.findGroupForUser(foundUser.id)
    try {
      return await this.fileService.fileUploadGroup(request, response, group)
    } catch (error) {
      return response.status(500).json(`e1 Failed to upload image file: ${error.message}`)
    }
  }
}

import { Req, Res, Injectable } from '@nestjs/common'
import * as multer from 'multer'
import * as AWS from 'aws-sdk'
import * as multerS3 from 'multer-s3'
import { UserService } from '../user/user.service'
import { GroupService } from '../group/group.service'
import { User } from '../user/user.entity'
import { Group } from '../group/group.entity'

const AWS_S3_BUCKET_NAME = 'projekt-inz'

AWS.config.update({
  accessKeyId: 'AKIAIQ4ZQCQACLRO6HQQ',
  secretAccessKey: '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',
})

const s3 = new AWS.S3()

@Injectable()
export class FileService {
  constructor(private readonly userService: UserService, private readonly groupService: GroupService) {}

  async fileUploadUser(@Req() req, @Res() res, user: User) {
    try {
      this.upload(req, res, error => {
        if (error) {
          return res.status(404).json(`e3 Failed to upload image file: ${error}`)
        }
        const url = req.file.location
        user.avatarUrl = url
        this.userService.updateUser(user)
      })
    } catch (error) {
      return res.status(500).json(`e2 Failed to upload image file: ${error}`)
    }
  }

  async fileUploadGroup(req, @Res() res, group: Group) {
    try {
      this.upload(req, res, error => {
        if (error) {
          return res.status(404).json(`e3 Failed to upload image file: ${error}`)
        }
        const url = req.file.location
        group.avatarUrl = url
        this.groupService.updateGroupProperty(group)
      })
    } catch (error) {
      return res.status(500).json(`e2 Failed to upload image file: ${error}`)
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: (request, file, cb) => {
        cb(null, `${Date.now().toString()} - ${file.originalname}`)
      },
    }),
  }).single('file')
}

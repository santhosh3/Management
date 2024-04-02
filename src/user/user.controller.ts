import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/uploads',
        filename(req, file, callback) {
          const ext = extname(file.originalname);
          const filename = `${file.originalname.split('.')[0]}-${Date.now()}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: Prisma.UserCreateInput,
  ) {
    let object = { ...createUserDto, roleId: Number(createUserDto['roleId']) };
    if (file) {
      return this.userService.create(file.filename, object);
    }
    return this.userService.create(null, object);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/uploads',
        filename(req, file, callback) {
          const ext = extname(file.originalname);
          const filename = `${file.originalname.split('.')[0]}-${Date.now()}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  updateById(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    let object = { ...updateUserDto, roleId: Number(updateUserDto['roleId']) };
    if (file) {
      return this.userService.updateById(id, object, file.filename);
    }
    return this.userService.updateById(id, object, null);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteById(id);
  }

  @Post(':id')
  AddProjectToUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.AddProject(id,updateUserDto);
  }
}

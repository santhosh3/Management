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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('User')
@ApiBearerAuth('token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private configService: ConfigService) {}

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
    const filename = file ? file.filename : null;
    const host = this.configService.get('host');
    const port = this.configService.get('port');
    return this.userService.create(filename, object, host, port);  
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
    const port = this.configService.get('port');
    const host = this.configService.get('host');
    const filename = file ? file.filename : null;
    let object = { ...updateUserDto, roleId: Number(updateUserDto['roleId']) };
    return this.userService.updateById(id, object, filename, host, port);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteById(id);
  }

  @Put('project/:id')
  AddProjectToUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.AddProject(id,updateUserDto);
  }
}

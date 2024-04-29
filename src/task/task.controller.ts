import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Prisma } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

@ApiTags('Task')
@ApiBearerAuth('token')
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'create new list for story' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'creating one of the task',
          description: 'name of Task',
        },
        description: {
          type: 'string',
          example: 'creating one description of the task',
          description: 'image for task',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'image for task',
        },
        estimatedTime: {
          type: 'integer',
          example: 34,
          description: 'Estimated time for that task',
        },
        cardId: {
          type: 'integer',
          example: 22,
          description: 'story for that task',
        },
      },
    },
  })
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
    @Req() { user },
    @UploadedFile() file: Express.Multer.File,
    @Body() createTaskDto: Prisma.TasksCreateInput,
  ) {
    const filename = file ? file.filename : null;
    const host = this.configService.get('host');
    const port = this.configService.get('port');
    let object = {
      ...createTaskDto,
      cardId: Number(createTaskDto['cardId']),
      estimatedTime: Number(createTaskDto['estimatedTime']),
      createdById: Number(user.id),
      ...(createTaskDto['assignedById'] && {
        assignedById: Number(createTaskDto['assignedById']),
      }),
      ...(createTaskDto['assignedToId'] && {
        assignedToId: Number(createTaskDto['assignedToId']),
      }),
      ...(createTaskDto['closedById'] && {
        closedById: Number(createTaskDto['closedById']),
      }),
      ...(createTaskDto['finishedById'] && {
        finishedById: Number(createTaskDto['finishedById']),
      }),
    };
    return this.taskService.create(filename, object, host, port);
  }

  @ApiOperation({ summary: 'update a Task By Id' })
  @UseGuards(AuthenticationGuard)
  @Put()
  updateTaskById(@Req() {user}) {
    return this.taskService.updateTaskById()
  }

  @ApiOperation({ summary: 'get All Tasks' })
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll(@Req() { user }) {
    return this.taskService.findAll(user);
  }

  @ApiOperation({ summary: 'get All Tasks with Project' })
  @UseGuards(AuthenticationGuard)
  @Get('/Projects')
  ProjectStoryTask(@Req() { user }) {
    return this.taskService.ProjectStoryTask(user);
  }

  @ApiOperation({ summary: 'get task by story' })
  @UseGuards(AuthenticationGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findById(id);
  }

  @ApiOperation({ summary: 'delete task by ID' })
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.deleteTaskById(id);
  }
}

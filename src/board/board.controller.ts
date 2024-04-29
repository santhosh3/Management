import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseInterceptors,
  Body,
  Ip,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { ListService } from 'src/list/list.service';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@SkipThrottle()
@ApiTags('Board')
@ApiBearerAuth('token')
@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly listService: ListService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new MyLoggerService(BoardController.name);

  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'create new Project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'nestJS',
          description: 'this is name of project',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'this is image for project',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `${file.originalname.split('.')[0]}-${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Req() { user },
    @UploadedFile() file: Express.Multer.File,
    @Body() createBoardDto: Prisma.BoardCreateInput,
  ) {
    const object = {
      ...createBoardDto,
      userId: user.id,
    };
    const host: string = this.configService.get('host');
    const port: string = this.configService.get('port');
    const filename = file ? file.filename : null;
    const createBoard = await this.boardService.create(filename, object, host, port);
    return createBoard;
  }

  @ApiOperation({ summary: 'get All Projects' })
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll(@Req() { user }, @Ip() ip: string) {
    return this.boardService.findAll(user.id);
  }

  @ApiOperation({ summary: 'get projects for login User' })
  @UseGuards(AuthenticationGuard)
  @Get('/user')
  findLoginUserProjects(@Req() { user }, @Ip() ip: string) {
    return this.boardService.findById(user.id);
  }

  @ApiOperation({ summary: 'get Project by ID' })
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.findById(id);
  }

  @Put(':id')
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoardDto: Prisma.BoardUpdateInput,
  ) {
    return this.boardService.updateById(id, updateBoardDto);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.deleteById(id);
  }
}

//this.logger.log(`Request for All Boards\t${ip}`, BoardController.name);

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

@SkipThrottle()
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService,
              private readonly listService: ListService) {}
  private readonly logger = new MyLoggerService(BoardController.name);

  @UseGuards(AuthenticationGuard)
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
  create(
    @Req() {user},
    @UploadedFile() file: Express.Multer.File,
    @Body() createBoardDto: Prisma.BoardCreateInput,
  ) {
    let object = {
      ...createBoardDto,
      userId: user.id,
    };
    if (file) {
      let createBoard = this.boardService.create(file.filename, object);
      return createBoard
    }
    return this.boardService.create(null, object);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  findAll(@Req() {user},@Ip() ip: string) {
    //this.logger.log(`Request for All Boards\t${ip}`, BoardController.name);
    return this.boardService.findAll();
  }


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

// @Throttle({short:{ttl :1000, limit:1}})

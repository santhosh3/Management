import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CardService } from './card.service';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Card')
@ApiBearerAuth('token')
@Controller('card')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private configService: ConfigService,
  ) {}

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
    @Req() { user },
    @UploadedFile() file: Express.Multer.File,
    @Body() createCardDto: Prisma.CardsCreateInput,
  ) {
    let object = {
      ...createCardDto,
      listId: Number(createCardDto['listId']),
      userId: user.id,
      ...(createCardDto['assignedById'] && {
        assignedById: Number(createCardDto['assignedById']),
      }),
      ...(createCardDto['assignedToId'] && {
        assignedToId: Number(createCardDto['assignedToId']),
      }),
      ...(createCardDto['closedById'] && {
        closedById: Number(createCardDto['closedById']),
      }),
      ...(createCardDto['createdById'] && {
        createdById: Number(createCardDto['createdById']),
      }),
      ...(createCardDto['finishedById'] && {
        finishedById: Number(createCardDto['finishedById']),
      }),
      ...(createCardDto['issueType'] && {
        issueType: Number(createCardDto['issueType']),
      }),
      ...(createCardDto['priority'] && {
        priority: Number(createCardDto['priority']),
      }),
    };
    const host: string = this.configService.get('host');
    const port: string = this.configService.get('port');
    const filename = file ? file.filename : null;
    return this.cardService.create(filename, object, host, port);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true,
  })
  @UseGuards(AuthenticationGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.findById(id);
  }

  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true,
  })
  @UseGuards(AuthenticationGuard)
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
    @Req() { user },
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: Prisma.CardsUpdateInput,
  ) {
    const host: string = this.configService.get('host');
    const port: string = this.configService.get('port');
    let object = {
      ...updateListDto,
      ...(updateListDto['listId'] && {
        listId: Number(updateListDto['listId']),
      }),
      ...{ userId: user.id },
      ...(updateListDto['assignedById'] && {
        assignedById: Number(updateListDto['assignedById']),
      }),
      ...(updateListDto['assignedToId'] && {
        assignedToId: Number(updateListDto['assignedToId']),
      }),
      ...(updateListDto['closedById'] && {
        closedById: Number(updateListDto['closedById']),
      }),
      ...(updateListDto['createdById'] && {
        createdById: Number(updateListDto['createdById']),
      }),
      ...(updateListDto['finishedById'] && {
        finishedById: Number(updateListDto['finishedById']),
      }),
      ...(updateListDto['issueType'] && {
        issueType: Number(updateListDto['issueType']),
      }),
      ...(updateListDto['priority'] && {
        priority: Number(updateListDto['priority']),
      }),
    };
    const filename = file ? file.filename : null;
    return this.cardService.updateById(id, object, filename, host, port);
  }

  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true,
  })
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.deleteById(id);
  }
}

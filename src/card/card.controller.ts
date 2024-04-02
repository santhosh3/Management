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

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

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
    @Req() {user},
    @UploadedFile() file: Express.Multer.File,
    @Body() createCardDto: Prisma.CardsCreateInput,
  ) {
    let object = {
      ...createCardDto,
      listId: Number(createCardDto['listId']),
      userId: user.id,
      ...(createCardDto['assignedById'] && { assignedById: Number(createCardDto['assignedById'])}),  
      ...(createCardDto['assignedToId'] && { assignedToId: Number(createCardDto['assignedToId'])}),
      ...(createCardDto['closedById'] && { closedById: Number(createCardDto['closedById'])}),    
      ...(createCardDto['createdById'] && { createdById: Number(createCardDto['createdById'])}),    
      ...(createCardDto['finishedById'] && { finishedById: Number(createCardDto['finishedById'])}),    
      ...(createCardDto['issueType'] && { issueType: Number(createCardDto['issueType'])}),
      ...(createCardDto['priority'] && { priority: Number(createCardDto['priority'])}),         
    };
    if (file) {
      return this.cardService.create(file.filename, object);
    }
    return this.cardService.create(null, object);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.findById(id);
  }

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
    @Req() {user},
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: Prisma.CardsUpdateInput,
  ) {
    let object = {
      ...updateListDto,
      ...(updateListDto['listId'] && { listId: Number(updateListDto['listId'])}),  
      ...({userId: user.id}),  
      ...(updateListDto['assignedById'] && { assignedById: Number(updateListDto['assignedById'])}),  
      ...(updateListDto['assignedToId'] && { assignedToId: Number(updateListDto['assignedToId'])}),
      ...(updateListDto['closedById'] && { closedById: Number(updateListDto['closedById'])}),    
      ...(updateListDto['createdById'] && { createdById: Number(updateListDto['createdById'])}),    
      ...(updateListDto['finishedById'] && { finishedById: Number(updateListDto['finishedById'])}),    
      ...(updateListDto['issueType'] && { issueType: Number(updateListDto['issueType'])}),   
      ...(updateListDto['priority'] && { priority: Number(updateListDto['priority'])}),     
    };
    if (file) {
      return this.cardService.updateById(id, object, file.filename);
    }
    return this.cardService.updateById(id, object, null);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.deleteById(id);
  }
}

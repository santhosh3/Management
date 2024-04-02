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
  UseGuards,
} from '@nestjs/common';
import { ListService } from './list.service';
import { Prisma } from '@prisma/client';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}
 
  @UseGuards(AuthenticationGuard)
  @Post()
  create(@Req() {user}, @Body() createListDto: Prisma.ListCreateInput) {
    let object = {...createListDto, userId: user.id}
    return this.listService.create(object);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/board/:id')
  findByBoardId(@Param('id', ParseIntPipe) id: number) {
    return this.listService.findByBoardId(id);
  }

  @Put(':id')
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: Prisma.ListCreateInput,
  ) {
    return this.listService.updateById(id, updateListDto);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.listService.deleteById(id);
  }
}

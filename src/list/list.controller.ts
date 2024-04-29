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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


@ApiTags('List')
@ApiBearerAuth('token')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}
 
  @ApiBody({
    schema : {
      type : 'object',
      properties : {
        name : {
          type : 'string',
          example : 'creatingList',
          description: 'this is name of list under project'
        },
        boardId : {
          type : 'integer',
          example : 12,
          description: 'this is boardId under List'
        }
      }
    } 
  })
  @ApiOperation({summary: 'creating list under project'})
  @UseGuards(AuthenticationGuard)
  @Post()
  create(@Req() {user}, @Body() createListDto: Prisma.ListCreateInput) {
    let object = {...createListDto, userId: user.id}
    return this.listService.create(object);
  }

  @ApiOperation({summary: 'this is list by ID'})
  @ApiParam({name:'id',type:'integer',description:'need id for update',required:true})
  @UseGuards(AuthenticationGuard)
  @Get('/board/:id')
  findByBoardId(@Param('id', ParseIntPipe) id: number) {
    return this.listService.findByBoardId(id);
  }

  @ApiOperation({summary: 'Update list by ID'})
  @ApiParam({name:'id',type:'integer',description:'need ListId to update list',required:true})
  @UseGuards(AuthenticationGuard)
  @Put(':id')
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: Prisma.ListCreateInput,
  ) {
    return this.listService.updateById(id, updateListDto);
  }

  @ApiOperation({summary: 'Delete list by ID'})
  @ApiParam({name:'id',type:'integer',description:'need ListId to delete list',required:true})
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.listService.deleteById(id);
  }
}

import { Injectable, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ListService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createListDto: Prisma.ListCreateInput) {
    return await this.databaseService.list.create({
      data: createListDto,
    });
  }

  async findByBoardId(id: number) {
    return await this.databaseService.board.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        name: true,
        image: true,
        peopleInvolved: {
          select: {
            user: {
              select : {
                id: true,
                name: true
              }
            }
          }
        },
        list: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            boardId: true,
            createdAt: true,
            updatedAt: true,
            
            card: {
              where: {
                isDeleted: false,
              },
              select: {
                id: true,
                name: true,
                description: true,
                listId: true,
                image: true,
                code: true,
                createdAt: true,
                updatedAt: true,
                issueType: true,
                priority: true,
                startDate: true,
                endDate: true,
                createdBy: {
                  where: {
                    isDeleted: false,
                  },
                  select: {
                    id: true,
                    name: true,
                  },
                },
                closedBy: {
                  where: {
                    isDeleted: false,
                  },
                  select: {
                    id: true,
                    name: true,
                  },
                },
                assignedBy: {
                  where: {
                    isDeleted: false,
                  },
                  select: {
                    id: true,
                    name: true,
                  },
                },
                assignedTo: {
                  where: {
                    isDeleted: false,
                  },
                  select: {
                    id: true,
                    name: true,
                  },
                },
                finishedBy: {
                  where: {
                    isDeleted: false,
                  },
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateById(id: number, updateListDto: Prisma.ListUpdateInput) {
    return await this.databaseService.list.update({
      where: {
        id,
      },
      data: updateListDto,
    });
  }

  async deleteById(id: number) {
    return await this.databaseService.list.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
        card: {
          updateMany: {
            where: { listId: id },
            data: {
              isDeleted: true,
            },
          },
        },
      },
    });
  }
}

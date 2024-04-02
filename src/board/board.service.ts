import {
  Injectable,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(file: string, createBoardDto: Prisma.BoardCreateInput) {
    const insertedData = {
      name: createBoardDto['name'],
      userId: createBoardDto['userId'],
      // peopleInvolved: {
      //   create: createBoardDto['userIds'].map((Id: any) => ({
      //     user: { connect: { id: Number(Id) } },
      //   })),
      // },
    };
    if (file === null) {
      return await this.databaseService.board.create({
        data: { ...insertedData },
      });
    }
    return await this.databaseService.board.create({
      data: { ...insertedData, image: `http://localhost:3002/${file}` },
    });
  }

  async findAll() {
    return await this.databaseService.board.findMany({
      where: {
        isDeleted: false,
        // peopleInvolved : {
        //   some : {
        //     userId : 1
        //   }
        // }
      },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // peopleInvolved: {
        //   select: {
        //     user: {
        //       select: {
        //         id: true,
        //         name: true,
        //         BoardsInvolved: true,
        //       },
        //     },
        //   },
        // },
        // list: {
        //   where: {
        //     isDeleted: false,
        //   },
        //   select: {
        //     id: true,
        //     name: true,
        //     createdAt: true,
        //     updatedAt: true,
        //     card: {
        //       where: {
        //         isDeleted: false,
        //       },
        //       select: {
        //         id: true,
        //         name: true,
        //         description: true,
        //         image: true,
        //         code: true,
        //         createdAt: true,
        //         updatedAt: true,
        //       },
        //     },
        //   },
        // },
      },
    });
  }

  async findById(id: number) {
    try {
      // const data = this.databaseService.board.findUnique({
      //   where: { id },
      //   select: { peopleInvolved: { select: { userId: true } } },
      // });
      // return (await data.then((res) => res.peopleInvolved)).map(
      //   (user) => user.userId,
      // );
      let data = await this.databaseService.board.findUnique({
        where: {
          id,
          isDeleted: false,
        },
        select: {
          peopleInvolved: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 200,
        message: 'status',
        data,
      };
    } catch (error) {
      return error;
    }
  }

  async updateById(id: number, updateBoardDto: Prisma.BoardUpdateInput) {
    try {
      const selectedUserIds = updateBoardDto['userIds'].map(
        (id: string | number) => Number(id),
      );
      const data = this.databaseService.board.findUnique({
        where: { id },
        select: { name: true, peopleInvolved: { select: { userId: true } } },
      });
      const currentUserIds = (await data.then((res) => res.peopleInvolved)).map(
        (user) => user.userId,
      );
      const userIdsToAdd = selectedUserIds.filter(
        (id: Number) => !currentUserIds.includes(+id),
      );
      const userIdsToRemove = currentUserIds.filter(
        (id) => !selectedUserIds.includes(+id),
      );

      await this.databaseService.usersOnBoards.deleteMany({
        where: {
          OR: userIdsToRemove.map((userId) => ({
            AND: [{ userId }, { boardId: id }],
          })),
        },
      });

      let involved = await this.databaseService.board.update({
        where: { id },
        data: {
          peopleInvolved: {
            create: userIdsToAdd.map((Id: any) => ({
              user: { connect: { id: Id } },
            })),
          },
        },
        select: {
          peopleInvolved: {
            select: { user: { select: { id: true, name: true } } },
          },
        },
      });
      return {
        status : 200,
        message : "success",
        data : involved
      }
    } catch (error) {}
  }

  async deleteById(id: number) {
    let listIds = await this.databaseService.list.findMany({
      where: {
        boardId: id,
      },
    });
    listIds.map(
      async (item) =>
        await this.databaseService.cards.updateMany({
          where: {
            listId: item['id'],
          },
          data: {
            isDeleted: true,
          },
        }),
    );
    return await this.databaseService.board.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        list: {
          updateMany: {
            where: {
              boardId: id,
            },
            data: {
              isDeleted: true,
            },
          },
        },
      },
    });
  }
}

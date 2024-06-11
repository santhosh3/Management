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

  async create(
    file: string,
    createBoardDto: Prisma.BoardCreateInput,
    host: string,
    port: string,
  ) {
    const insertedData = {
      name: createBoardDto['name'],
      userId: createBoardDto['userId'],
    };
    const AddProjectToUser: any = {
      userIds: [createBoardDto['userId']],
    };
    const createBoard = await this.databaseService.board.create({
      data: {
        ...insertedData,
        image: file === null ? null : `http://${host}:${port}/${file}`,
      },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    await this.updateById(createBoard.id, AddProjectToUser);
    return createBoard;
  }

  async findAll(id: number) {
    let query: any;
    let field = {
      id: true,
      name: true,
      image: true,
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
      createdAt: true,
      updatedAt: true,
    };
    let role = await this.databaseService.user.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        role: true,
      },
    });
    if (role.role.name === 'admin') {
      query = await this.databaseService.board.findMany({
        where: {
          isDeleted: false,
        },
        select: field,
      });
    } else {
      query = await this.databaseService.board.findMany({
        where: {
          isDeleted: false,
          peopleInvolved: {
            some: {
              userId: id,
            },
          },
        },
        select: field,
      });
    }
    return query.map((project: any) => ({
      ...project,
      peopleInvolved: project['peopleInvolved'].map((x: any) => x['user']),
    }));
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
          id: true,
          name: true,
          peopleInvolved: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
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
          id: true,
          name: true,
          peopleInvolved: {
            select: { user: { select: { id: true, name: true, image: true } } },
          },
        },
      });
      return {
        status: 200,
        message: 'success',
        data: {
          ...involved,
          peopleInvolved: involved['peopleInvolved'].map((x: any) => x['user']),
        },
      };
    } catch (error) {}
  }
}

/*

  async findAll() {
    return await this.databaseService.board.findMany({
      where: {
        isDeleted: false,
        peopleInvolved : {
          some : {
            userId : 10
          }
        }
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

*/

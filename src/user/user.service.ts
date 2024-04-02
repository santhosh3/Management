import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(file: string, createUserDto: Prisma.UserCreateInput) {
    let fields = {
      id: true,
      name: true,
      email: true,
      password: true,
      image: true,
      role: true,
      code: true,
      createdAt: true,
      updatedAt: true,
    };
    if (file === null) {
      return await this.databaseService.user.create({
        data: {
          ...createUserDto,
          password: await argon2.hash(createUserDto.password),
        },
        select: fields,
      });
    }
    return await this.databaseService.user.create({
      data: {
        ...createUserDto,
        password: await argon2.hash(createUserDto.password),
        image: `http://localhost:3002/${file}`,
      },
      select: fields,
    });
  }

  async findAll() {
    let fields = {
      id: true,
      name: true,
      email: true,
      password: true,
      image: true,
      role: true,
      code: true,
      createdAt: true,
      updatedAt: true,
    };
    return await this.databaseService.user.findMany({
      where: {
        isDeleted: false,
      },
      select: fields
    });
  }

  async getById(id: number) {
    let fields = {
      id: true,
      name: true,
      email: true,
      password: true,
      image: true,
      role: true,
      code: true,
      createdAt: true,
      updatedAt: true,
    };
    return await this.databaseService.user.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        BoardsInvolved: {
          select: {
            board: {
              select: {
                id : true,
                name : true
              }
            }
          }
        }
      },
    });
  }

  async updateById(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
    file: string,
  ) {
    let fields = {
      id: true,
      name: true,
      email: true,
      password: true,
      image: true,
      role: true,
      code: true,
      createdAt: true,
      updatedAt: true,
    };
    if (file === null) {
      return await this.databaseService.user.update({
        where: {
          id,
        },
        data: updateUserDto,
        select: fields,
      });
    }
    return await this.databaseService.user.update({
      where: {
        id,
        isDeleted: false,
      },
      data: { ...updateUserDto, image: `http://localhost:3002/${file}` },
      select: fields,
    });
  }

  async deleteById(id: number) {
    await this.databaseService.usersOnBoards.deleteMany({
      where : {
        userId : id
      }
    })
    return await this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async AddProject(id: number, updateUserDto: Prisma.UserUpdateInput) {
    try {
      const selectProjectIds = updateUserDto['projects'].map(
        (id: string | number) => Number(id),
      );
      const data = this.databaseService.user.findUnique({
        where: { id },
        select: { name: true, BoardsInvolved: { select: { boardId: true } } },
      });
      const currentProjectIds = (
        await data.then((res) => res.BoardsInvolved)
      ).map((project) => project.boardId);

      const projectIdsToAdd = selectProjectIds.filter(
        (id: Number) => !currentProjectIds.includes(+id),
      );
      const projectIdsToRemove = currentProjectIds.filter(
        (id) => !selectProjectIds.includes(+id),
      );
      await this.databaseService.usersOnBoards.deleteMany({
        where: {
          OR: projectIdsToRemove.map((boardId) => ({
            AND: [{ userId: id }, { boardId }],
          })),
        },
      });

      let involved = await this.databaseService.user.update({
        where: { id },
        data: {
          BoardsInvolved: {
            create: projectIdsToAdd.map((Id: any) => ({
              board: { connect: { id: Id } },
            })),
          },
        },
        select: { BoardsInvolved: { select: { board : {select : {id : true, name: true}} } } },
      });
      return {
        status : 200,
        message : "success",
        data : involved
      }
    } catch (error) {
      return {
        status : 500,
        message : "error",
        data : error
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createRoleDto: Prisma.RoleCreateInput) {
    return await this.databaseService.role.create({
      data: createRoleDto,
    });
  }

  async findAll() {
    return await this.databaseService.role.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        users: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async getById(id: number) {
    return await this.databaseService.role.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      // select: {
      //   id: true,
      //   name: true,
      //   roleId: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   users: {
      //     where: {
      //       isDeleted: false
      //     },
      //     select: {
      //       id: true,
      //       name: true,
      //       createdAt: true,
      //       updatedAt: true
      //     }
      //   }
      // }
    });
  }

  async updateById(id: number, updateRoleDto: Prisma.RoleUpdateInput) {
    return await this.databaseService.role.update({
      where: {
        id,
      },
      data: updateRoleDto,
      select: {
        id: true,
        name: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        users: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async deleteById(id: number) {
    return await this.databaseService.role.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}

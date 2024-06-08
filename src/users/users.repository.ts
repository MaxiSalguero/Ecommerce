import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number) {
    const usersList = await this.usersRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (usersList.length < 1)
      throw new NotFoundException(
        'De momento no se encontraron usuarios registrados',
      );

    return usersList.map(
      ({ password, isAdmin, ...userNoPassword }) => userNoPassword,
    );
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!user)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    if (user.orders.length < 1) {
      const { password, isAdmin, orders, ...userNoOrders } = user;
      return userNoOrders;
    }

    const { password, isAdmin, ...userNoPassword } = user;
    return userNoPassword;
  }

  async updateUser(id: string, user: Partial<User>) {
    const existingUser = await this.usersRepository.findOneBy({ id });
    if (!existingUser)
      throw new NotFoundException(`No se encontro el usuario con id: ${id}`);

    await this.usersRepository.update(id, user);

    return {
      message: `Usuario con ID: ${existingUser.id}, modificado correctamente`,
    };
  }

  async deleteUser(id: string) {
    const existingUser = await this.usersRepository.findOneBy({ id });

    if (!existingUser)
      throw new NotFoundException(`No se encontro el usuario con id: ${id}`);

    try {
      await this.usersRepository.remove(existingUser);
      return { message: `Usuario con ID: ${id}, borrado correctamente` };
    } catch (error) {
      throw new ForbiddenException(
        'Es posible que este usuario tenga relaciones activas con otras entidades y se te denego el permiso de eliminarlo',
      );
    }
  }
}

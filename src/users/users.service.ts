import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: {
    nickname: string;
    email: string;
    password: string;
  }): Promise<User> {
    const salt = crypto.randomBytes(16).toString('hex');

    const hashedPassword = crypto
      .pbkdf2Sync(createUserDto.password, salt, 1000, 64, 'sha256')
      .toString('hex');

    const newUser = this.userRepository.create({
      ...createUserDto,
      salt,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async update(
    id: number,
    updateUserDto: { nickname?: string; email?: string; password?: string },
  ): Promise<User> {
    if (updateUserDto.password) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto
        .pbkdf2Sync(updateUserDto.password, salt, 1000, 64, 'sha256')
        .toString('hex');

      updateUserDto.password = hashedPassword;
      updateUserDto['salt'] = salt;
    }

    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async softDelete(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.userRepository.restore(id);
  }
}

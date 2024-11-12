import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(
    @Body()
    createUserDto: {
      nickname: string;
      email: string;
      password: string;
    },
  ) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body()
    updateUserDto: { nickname?: string; email?: string; password?: string },
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: number) {
    return this.userService.softDelete(id);
  }
}

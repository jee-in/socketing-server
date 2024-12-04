import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'node:crypto';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CustomException } from 'src/exceptions/custom-exception';
import { ERROR_CODES } from 'src/contants/error-codes';
import { UpdateNicknameResponseDto } from './dto/update-nickname-response.dto';
import { UpdateNicknameRequestDto } from './dto/update-nickname-request.dto';
import { UpdatePasswordRequestDto } from './dto/update-password-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<CommonResponse<any>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findOneByEmail(email: string): Promise<CommonResponse<any>> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async updateNickname(
    id: string,
    updateNicknameDto: UpdateNicknameRequestDto,
  ): Promise<CommonResponse<UpdateNicknameResponseDto>> {
    const { nickname } = updateNicknameDto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const existingNickname = await this.userRepository.findOne({
      where: { nickname },
    });
    if (existingNickname && existingNickname.id !== user.id) {
      const error = ERROR_CODES.NICKNAME_ALREADY_EXISTS;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    user.nickname = nickname;
    const savedUser = await this.userRepository.save(user);

    return new CommonResponse({
      id: savedUser.id,
      nickname: savedUser.nickname,
    });
  }

  async updatePassword(
    id: string,
    UpdatePasswordDto: UpdatePasswordRequestDto,
  ): Promise<CommonResponse<any>> {
    const { password } = UpdatePasswordDto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    user.password = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, 'sha256')
      .toString('hex');
    await this.userRepository.save(user);

    return new CommonResponse();
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    await this.userRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    await this.userRepository.restore(id);
  }

  async findUserPoints(id: string): Promise<CommonResponse<any>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse({
      id: user.id,
      point: user.point,
    });
  }
}

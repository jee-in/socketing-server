import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as crypto from 'node:crypto';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ERROR_CODES } from 'src/contants/error-codes';
import { CustomException } from 'src/exceptions/custom-exception';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterRequestDto,
  ): Promise<CommonResponse<RegisterResponseDto>> {
    const { nickname, email, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      const error = ERROR_CODES.PASSWORDS_DO_NOT_MATCH;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      const error = ERROR_CODES.USER_ALREADY_EXISTS;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const existingNickname = await this.userRepository.findOne({
      where: { nickname },
    });
    if (existingNickname) {
      const error = ERROR_CODES.NICKNAME_ALREADY_EXISTS;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const salt = crypto.randomBytes(16).toString('hex');

    const hashedPassword = crypto
      .pbkdf2Sync(registerDto.password, salt, 1000, 64, 'sha256')
      .toString('hex');

    const newUser = this.userRepository.create({
      ...registerDto,
      salt,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return new CommonResponse<RegisterResponseDto>({
      id: savedUser.id,
      nickname: savedUser.nickname,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    });
  }

  async login(
    loginDto: LoginRequestDto,
  ): Promise<CommonResponse<LoginResponseDto>> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      const error = ERROR_CODES.INVALID_CREDENTIALS;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, 'sha256')
      .toString('hex');
    if (hashedPassword !== user.password) {
      const error = ERROR_CODES.INVALID_CREDENTIALS;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return new CommonResponse({
      tokenType: 'Bearer',
      expiresIn: 3600,
      accessToken,
    });
  }
}

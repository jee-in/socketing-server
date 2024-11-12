import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as crypto from 'node:crypto';
import { CommonResponse } from 'src/common/dto/common-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<CommonResponse<any>> {
    const { nickname, email, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const existingNickname = await this.userRepository.findOne({
      where: { nickname },
    });
    if (existingNickname) {
      throw new BadRequestException('Nickname already exists');
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

    return {
      code: 1,
      message: 'Success',
      data: {
        id: savedUser.id,
        nickname: savedUser.nickname,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<CommonResponse<any>> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, 'sha256')
      .toString('hex');
    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      code: 1,
      message: 'Success',
      data: {
        tokenType: 'Bearer',
        expiresIn: 3600,
        accessToken,
      },
    };
  }
}

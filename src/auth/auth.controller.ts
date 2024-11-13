import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          id: '33f01179-9d75-4062-9012-591b54a25f64',
          nickname: 'JohnDoe',
          email: 'johndoe@example.com',
          createdAt: '2024-11-12T12:00:00Z',
          updatedAt: '2024-11-12T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        code: 5,
        message: 'Validation failed',
        details: [
          {
            field: 'email',
            message: 'email must be an email',
          },
        ],
      },
    },
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<CommonResponse<any>> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          tokenType: 'Bearer',
          expiresIn: 3600,
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        code: 2,
        message: 'Invalid credentials',
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<CommonResponse<any>> {
    return this.authService.login(loginDto);
  }
}

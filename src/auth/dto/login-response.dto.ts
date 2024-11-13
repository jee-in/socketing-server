import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'Bearer',
    description: 'The type of token being returned',
  })
  tokenType: string;

  @ApiProperty({
    example: 3600,
    description: 'The expiration time of the token in seconds',
  })
  expiresIn: number;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The JWT access token',
  })
  accessToken: string;
}

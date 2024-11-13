import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateNicknameRequestDto {
  @ApiProperty({
    description: 'The new nickname for the user',
    example: 'new_nickname',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30, { message: 'Nickname must be 30 characters or less' })
  nickname: string;
}

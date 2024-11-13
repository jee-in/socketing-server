import { ApiProperty } from '@nestjs/swagger';

export class UpdateNicknameResponseDto {
  @ApiProperty({
    description: 'The UUID of the user whose nickname was updated',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The updated nickname of the user',
    example: 'new_nickname',
  })
  nickname: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the registered user in UUID format.',
  })
  id: string;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'The nickname of the user.',
  })
  nickname: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address associated with the user account.',
  })
  email: string;

  @ApiProperty({
    example: 'https://example.com/profile-images/default.png',
    description:
      'The URL of the profile image associated with the user account. Defaults to a system-provided image if not set.',
  })
  profileImage: string;

  @ApiProperty({
    example: '2024-11-12T12:00:00Z',
    description:
      'The ISO 8601 formatted timestamp indicating when the user account was initially created in the system.',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-11-12T12:00:00Z',
    description:
      'The ISO 8601 formatted timestamp showing the most recent update to the user account, such as profile changes or system updates.',
  })
  updatedAt: Date;
}

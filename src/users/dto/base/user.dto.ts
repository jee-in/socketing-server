import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  email: string;

  @Expose()
  profileImage: string;

  @Expose()
  role: string;
}

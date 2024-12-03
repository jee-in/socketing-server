import { Expose } from 'class-transformer';
import { UserDto } from './base/user.dto';

export class UserWithPoint extends UserDto {
  @Expose()
  point: number;
}

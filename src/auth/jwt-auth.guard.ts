import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ERROR_CODES } from 'src/contants/error-codes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const errorCode = ERROR_CODES.UNAUTHORIZED;
      throw new UnauthorizedException(
        new CommonResponse(undefined, errorCode.message, errorCode.code),
      );
    }
    return user;
  }
}

import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(errorCode: number, errorMessage: string, httpStatus: number) {
    super({ code: errorCode, message: errorMessage }, httpStatus);
  }
}

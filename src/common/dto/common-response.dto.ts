export class CommonResponse<T> {
  code: number;
  message: string;
  data: T;

  constructor(data: T, message: string = 'Success') {
    this.code = 0;
    this.message = message;
    this.data = data;
  }
}

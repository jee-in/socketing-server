export class CommonResponse<T> {
  code: number;
  message: string;
  data?: T;
}

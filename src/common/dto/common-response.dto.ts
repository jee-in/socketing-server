import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse<T> {
  @ApiProperty({
    example: 0,
    description: 'Response code indicating success or specific error code',
  })
  code: number;

  @ApiProperty({
    example: 'Success',
    description: 'Human-readable message describing the response',
  })
  message: string;

  @ApiProperty({
    example: {},
    description: 'Payload containing the actual data',
    nullable: true,
    required: false,
  })
  data?: T;

  @ApiProperty({
    example: [],
    description:
      'Detailed information about the validation errors or specific issues',
    nullable: true,
    required: false,
  })
  details?: Array<{ field: string; message: string }>;

  constructor(
    data?: T,
    message: string = 'Success',
    code: number = 0,
    details?: Array<{ field: string; message: string }>,
  ) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.details = details;
  }
}

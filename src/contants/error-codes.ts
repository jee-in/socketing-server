export const ERROR_CODES = {
  USER_ALREADY_EXISTS: {
    code: 1,
    message: 'User already exists',
    httpStatus: 409,
  },
  INVALID_CREDENTIALS: {
    code: 2,
    message: 'Invalid credentials',
    httpStatus: 401,
  },
  NOT_CURRENTLY_AVAILABLE: {
    code: 3,
    message: 'Not currently available',
    httpStatus: 503,
  },
  NICKNAME_ALREADY_EXISTS: {
    code: 4,
    message: 'Nickname already exists',
    httpStatus: 409,
  },
  VALIDATION_FAILED: {
    code: 5,
    message: 'Validation failed',
    httpStatus: 400,
  },
  INTERNAL_SERVER_ERROR: {
    code: 6,
    message: 'Internal server error',
    httpStatus: 500,
  },
  USER_NOT_FOUND: {
    code: 7,
    message: 'User not found',
    httpStatus: 404,
  },
  UNAUTHORIZED: {
    code: 8,
    message: 'Unauthorized',
    httpStatus: 401,
  },
  EVENT_NOT_FOUND: {
    code: 9,
    message: 'Event not found',
    httpStatus: 404,
  },
  DUPLICATE_SEAT: {
    code: 10,
    message: 'A seat with the same area, row, number, and event already exists',
    httpStatus: 409,
  },
};

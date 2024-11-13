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
  PASSWORDS_DO_NOT_MATCH: {
    code: 3,
    message: 'Passwords do not match',
    httpStatus: 400,
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
};

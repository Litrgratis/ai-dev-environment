import { Redis } from 'ioredis-mock';

jest.mock('ioredis', () => ({
  __esModule: true,
  default: Redis,
  Redis
}));

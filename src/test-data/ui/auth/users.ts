import { env } from '@config/env';
import { TestUser } from '@src/core/types/test-user';

export const users: Record<string, TestUser> = {
  standard: {
    username: env.standardUser,
    password: env.password,
    label: 'Standard User'
  },
  lockedOut: {
    username: env.lockedOutUser,
    password: env.password,
    label: 'Locked Out User'
  },
  problem: {
    username: env.problemUser,
    password: env.password,
    label: 'Problem User'
  }
};

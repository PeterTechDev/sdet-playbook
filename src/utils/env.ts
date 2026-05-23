import { z } from 'zod';

const EnvSchema = z.object({
  BASE_URL: z.string().url(),
  API_URL: z.string().url(),
  TEST_USER_EMAIL: z.string().email(),
  TEST_USER_PASSWORD: z.string().min(1),
});

export const env = EnvSchema.parse({
  BASE_URL: process.env.BASE_URL,
  API_URL: process.env.API_URL,
  TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
  TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
});

export type Env = typeof env;

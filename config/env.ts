import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const selectedEnvironment = process.env.env ?? process.env.ENV ?? process.env.TEST_ENV ?? 'local';
const envFileName = `${selectedEnvironment}.env`;
const envFilePath = path.resolve(process.cwd(), 'config', 'environment', envFileName);

if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath, override: true });
} else {
  dotenv.config();
}

const rawEnvSchema = z.object({
  BASE_URL: z.string().url().default('https://www.saucedemo.com'),
  API_BASE_URL: z.string().url().default('https://jsonplaceholder.typicode.com'),
  TEST_ENV: z.string().default('qa'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'trace']).default('info'),
  ATTACH_DEBUG_LOGS_TO_ALLURE: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
  HEADLESS: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
  DEFAULT_BROWSER: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
  CI: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
  WORKERS: z
    .string()
    .default('4')
    .transform((value) => Number(value)),
  RETRIES: z
    .string()
    .default('1')
    .transform((value) => Number(value)),
  SLOW_MO: z
    .string()
    .default('0')
    .transform((value) => Number(value)),
  SLACK_WEBHOOK_URL: z.string().optional(),
  SLACK_CHANNEL: z.string().default('#qa-automation'),
  JENKINS_BUILD_URL: z.string().optional(),
  ALLURE_REPORT_URL: z.string().optional(),
  STANDARD_USER: z.string().default('standard_user'),
  LOCKED_OUT_USER: z.string().default('locked_out_user'),
  PROBLEM_USER: z.string().default('problem_user'),
  PERFORMANCE_GLITCH_USER: z.string().default('performance_glitch_user'),
  ERROR_USER: z.string().default('error_user'),
  VISUAL_USER: z.string().default('visual_user'),
  PASSWORD: z.string().default('secret_sauce')
});

const parsedEnv = rawEnvSchema.parse(process.env);

export const env = {
  executionEnv: selectedEnvironment,
  envFileName,
  envFilePath,
  baseUrl: parsedEnv.BASE_URL,
  apiBaseUrl: parsedEnv.API_BASE_URL,
  testEnv: parsedEnv.TEST_ENV,
  logLevel: parsedEnv.LOG_LEVEL,
  attachDebugLogsToAllure: parsedEnv.ATTACH_DEBUG_LOGS_TO_ALLURE,
  headless: parsedEnv.HEADLESS,
  defaultBrowser: parsedEnv.DEFAULT_BROWSER,
  ci: parsedEnv.CI,
  workers: parsedEnv.WORKERS,
  retries: parsedEnv.RETRIES,
  slowMo: parsedEnv.SLOW_MO,
  slackWebhookUrl: parsedEnv.SLACK_WEBHOOK_URL,
  slackChannel: parsedEnv.SLACK_CHANNEL,
  jenkinsBuildUrl: parsedEnv.JENKINS_BUILD_URL,
  allureReportUrl: parsedEnv.ALLURE_REPORT_URL,
  standardUser: parsedEnv.STANDARD_USER,
  lockedOutUser: parsedEnv.LOCKED_OUT_USER,
  problemUser: parsedEnv.PROBLEM_USER,
  performanceGlitchUser: parsedEnv.PERFORMANCE_GLITCH_USER,
  errorUser: parsedEnv.ERROR_USER,
  visualUser: parsedEnv.VISUAL_USER,
  password: parsedEnv.PASSWORD
} as const;

export const rawEnv = parsedEnv;

import fs from 'node:fs/promises';
import path from 'node:path';

async function ensureCleanReportDirectory(): Promise<void> {
  const reportDirectory = path.resolve(process.cwd(), 'report');

  await fs.rm(reportDirectory, { recursive: true, force: true });
  await fs.mkdir(reportDirectory, { recursive: true });
  await fs.mkdir(path.join(reportDirectory, 'allure-results'), { recursive: true });
  await fs.mkdir(path.join(reportDirectory, 'allure-report'), { recursive: true });
  await fs.mkdir(path.join(reportDirectory, 'playwright-report'), { recursive: true });
  await fs.mkdir(path.join(reportDirectory, 'test-results'), { recursive: true });
}

export default async function globalSetup(): Promise<void> {
  await ensureCleanReportDirectory();
}

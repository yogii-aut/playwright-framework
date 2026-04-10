import fs from 'node:fs';
import path from 'node:path';
import { env } from '../../config/env';

interface SlackPayload {
  text: string;
  channel?: string;
}

function readSummary(): string {
  const reportPath = path.resolve(process.cwd(), 'report', 'allure-report', 'widgets', 'summary.json');
  if (!fs.existsSync(reportPath)) {
    return 'Allure summary not found. Tests may have failed before report generation.';
  }

  const summary = JSON.parse(fs.readFileSync(reportPath, 'utf8')) as {
    statistic: Record<string, number>;
  };

  const stats = summary.statistic;
  return `passed=${stats.passed ?? 0}, failed=${stats.failed ?? 0}, broken=${stats.broken ?? 0}, skipped=${stats.skipped ?? 0}`;
}

async function notifySlack(): Promise<void> {
  if (!env.slackWebhookUrl) {
    console.log('SLACK_WEBHOOK_URL is not set. Skipping Slack notification.');
    return;
  }

  const buildUrl = env.jenkinsBuildUrl ?? 'N/A';
  const allureUrl = env.allureReportUrl ?? 'N/A';
  const summary = readSummary();

  const payload: SlackPayload = {
    channel: env.slackChannel,
    text: [
      '*SauceDemo UI automation execution completed*',
      `Environment: ${env.testEnv}`,
      `Summary: ${summary}`,
      `Build URL: ${buildUrl}`,
      `Allure Report: ${allureUrl}`
    ].join('\n')
  };

  const response = await fetch(env.slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Slack notification failed with status ${response.status}`);
  }

  console.log('Slack notification sent successfully.');
}

void notifySlack();

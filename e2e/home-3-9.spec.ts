import { expect, test } from '@playwright/test';
import { createPlan, openHomePage } from './home-scenario-helpers';

test('3.9 previously recorded data is shown in the tracker', async ({ page }) => {
  const planName = `History Plan ${Date.now()}`;

  await openHomePage(page);
  await createPlan(page, planName, 'Push-ups');
  await page.getByRole('button', { name: 'Home' }).click();

  await page.getByText('Push-ups', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Workout Details' })).toBeVisible();
  await expect(page.getByText('Previously Recorded')).toBeVisible();
  await expect(page.getByText('Set 1:')).toBeVisible();
  await expect(page.getByText('10 Reps for 30Sec')).toBeVisible();
  await expect(page.locator('.recharts-responsive-container svg.recharts-surface').first()).toBeVisible();
});

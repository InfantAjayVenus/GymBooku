import { expect, test } from '@playwright/test';
import { createPlan, openHomePage, openWorkout } from './home-scenario-helpers';

test('3.6 save is disabled until all required fields are filled', async ({ page }) => {
  const planName = `Scenario Plan ${Date.now()}`;

  await openHomePage(page);
  await createPlan(page, planName, 'Running');
  await page.getByRole('button', { name: 'Home' }).click();

  await openWorkout(page, 'Running');
  await expect(page.getByRole('button', { name: /^save$/i })).toBeDisabled();

  await page.getByRole('dialog').locator('input').nth(0).fill('30');
  await page.waitForTimeout(400);
  await expect(page.getByRole('button', { name: /^save$/i })).toBeEnabled();
});

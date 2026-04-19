import { expect, test } from '@playwright/test';
import { createPlan, openHomePage, openWorkout } from './home-scenario-helpers';

test('3.4 open the workout tracker for a workout', async ({ page }) => {
  const planName = `Scenario Plan ${Date.now()}`;

  await openHomePage(page);
  await createPlan(page, planName, 'Running');
  await page.getByRole('button', { name: 'Home' }).click();

  await openWorkout(page, 'Running');
  await expect(page.getByRole('heading', { name: 'Workout Details' })).toBeVisible();
});

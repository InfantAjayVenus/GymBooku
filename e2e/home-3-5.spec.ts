import { expect, test } from '@playwright/test';
import { createPlan, fillWorkoutSet, openHomePage, openWorkout } from './home-scenario-helpers';

test('3.5 log a workout session and save', async ({ page }) => {
  const planName = `Scenario Plan ${Date.now()}`;

  await openHomePage(page);
  await createPlan(page, planName, 'Running');
  await page.getByRole('button', { name: 'Home' }).click();

  await openWorkout(page, 'Running');
  await fillWorkoutSet(page, 1, [30]);
  await expect(page.getByRole('button', { name: /^save$/i })).toBeEnabled();
  await page.getByRole('button', { name: /^save$/i }).click();

  await expect(page.getByRole('heading', { name: 'Workout Details' })).toBeHidden();
  await expect(page.getByTestId('CheckCircleOutlineIcon')).toBeVisible();
  await expect(page.getByText('Running', { exact: true })).toHaveCSS('color', 'rgba(255, 255, 255, 0.5)');
});

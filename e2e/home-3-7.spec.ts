import { expect, test } from '@playwright/test';
import { createPlan, fillWorkoutSet, openHomePage, openWorkout } from './home-scenario-helpers';

test('3.7 add multiple sets before saving', async ({ page }) => {
  const planName = `Scenario Plan ${Date.now()}`;

  await openHomePage(page);
  await createPlan(page, planName, 'Running');
  await page.getByRole('button', { name: 'Home' }).click();

  await openWorkout(page, 'Running');
  await fillWorkoutSet(page, 1, [30]);

  const addSetButton = page.getByRole('button', { name: 'Add Set' });
  const removeSetButton = page.getByRole('button', { name: 'Remove Set' });

  await expect(addSetButton).toBeEnabled();
  await addSetButton.click();

  await expect(page.getByText('Set 2')).toBeVisible();
  await expect(addSetButton).toBeDisabled();
  await expect(removeSetButton).toBeEnabled();

  await fillWorkoutSet(page, 2, [32]);
  await expect(addSetButton).toBeEnabled();

  await removeSetButton.click();
  await expect(page.getByText('Set 2')).toHaveCount(0);
});

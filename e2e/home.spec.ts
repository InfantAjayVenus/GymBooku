import { expect, test, type Page } from '@playwright/test';
import { createPlan, fillWorkoutSet, openHomePage, openWorkout } from './home-scenario-helpers';

async function clearAllPlans(page: Page) {
  await page.getByRole('button', { name: 'Plans' }).click();
  await expect(page.getByRole('heading', { name: 'Workout Plans' })).toBeVisible();

  const initialCount = await page.getByRole('listitem').count();
  for (let i = 0; i < initialCount; i++) {
    const firstPlan = page.getByRole('listitem').first();
    await firstPlan.getByRole('button', { name: 'more' }).click();
    await page.getByRole('menuitem', { name: /Delete/ }).click();
    await expect(page.getByRole('listitem')).toHaveCount(initialCount - i - 1);
  }
}

test.describe('Home', () => {
  test('3.1 workouts scheduled for today are listed', async ({ page }) => {
    const planName = `Home Plan ${Date.now()}`;

    await openHomePage(page);
    await createPlan(page, planName, 'Bench Press');
    await page.getByRole('button', { name: 'Home' }).click();

    await expect(page.getByText("Today's Workouts")).toBeVisible();
    await expect(page.getByText('Bench Press')).toBeVisible();
  });

  test('3.2 no workouts when no plan covers today', async ({ page }) => {
    await openHomePage(page);
    await clearAllPlans(page);
    await page.getByRole('button', { name: 'Home' }).click();

    await expect(page.getByText("Today's Workouts")).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });

  test('3.4 open the workout tracker for a workout', async ({ page }) => {
    const planName = `Scenario Plan ${Date.now()}`;

    await openHomePage(page);
    await createPlan(page, planName, 'Running');
    await page.getByRole('button', { name: 'Home' }).click();

    await openWorkout(page, 'Running');
    await expect(page.getByRole('heading', { name: 'Workout Details' })).toBeVisible();
  });

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

  test('3.8 remove set is disabled when only one set remains', async ({ page }) => {
    const planName = `Scenario Plan ${Date.now()}`;

    await openHomePage(page);
    await createPlan(page, planName, 'Running');
    await page.getByRole('button', { name: 'Home' }).click();

    await openWorkout(page, 'Running');
    await expect(page.getByRole('button', { name: 'Remove Set' })).toBeDisabled();
  });

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
});

import { expect, test } from '@playwright/test';

async function resetAppData(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('keyval-store');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });
  });
}

async function openWorkoutsPage(page: import('@playwright/test').Page) {
  await resetAppData(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Workouts' }).click();
  await expect(page.getByRole('heading', { name: 'Workout List' })).toBeVisible();
}

async function openAddWorkoutForm(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'add workout' }).click();
  await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeVisible();
}

async function selectTrackingValues(page: import('@playwright/test').Page, values: string[]) {
  await page.getByRole('combobox', { name: 'Tracking Values' }).click();

  for (const value of values) {
    await page.getByRole('option', { name: new RegExp(value) }).click();
  }

  await page.keyboard.press('Escape');
}

test.describe('Workout Library', () => {
  test('1.1 add a new workout', async ({ page }) => {
    const workoutName = `Burpees ${Date.now()}`;

    await openWorkoutsPage(page);
    await openAddWorkoutForm(page);
    await page.getByLabel('Workout Name').fill(workoutName);
    await selectTrackingValues(page, ['COUNT', 'WEIGHT']);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeHidden();
    await expect(page.getByText(workoutName)).toBeVisible();
    await expect(page.getByText('COUNT')).toBeHidden();
    await expect(page.getByText('WEIGHT')).toBeHidden();
  });

  test('1.2 add a workout requires a name', async ({ page }) => {
    await openWorkoutsPage(page);
    await openAddWorkoutForm(page);
    await selectTrackingValues(page, ['COUNT']);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeVisible();
    await expect(page.getByLabel('Workout Name')).toBeFocused();
    await expect(page.getByLabel('Workout Name')).not.toHaveJSProperty('validationMessage', '');
  });
});

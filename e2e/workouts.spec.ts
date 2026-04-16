import { expect, test, type Page } from '@playwright/test';

async function resetAppData(page: Page) {
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

async function openWorkoutsPage(page: Page) {
  await resetAppData(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Workouts' }).click();
  await expect(page.getByRole('heading', { name: 'Workout List' })).toBeVisible();
}

async function openAddWorkoutForm(page: Page) {
  await page.getByRole('button', { name: 'add workout' }).click();
  await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeVisible();
}

async function selectTrackingValues(page: Page, values: string[]) {
  await page.getByRole('combobox', { name: 'Tracking Values' }).click();

  for (const value of values) {
    await page.getByRole('option', { name: new RegExp(value) }).click();
  }

  await page.keyboard.press('Escape');
}

async function openWorkoutMenu(page: Page, workoutName: string) {
  const row = page.getByRole('listitem').filter({ hasText: workoutName });
  await row.getByRole('button', { name: 'more' }).click();
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
    await expect(page.getByRole('listitem').filter({ hasText: workoutName })).toBeVisible();
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

  test('1.3 add a workout requires a tracking value', async ({ page }) => {
    const workoutName = `No Tracking ${Date.now()}`;

    await openWorkoutsPage(page);
    await openAddWorkoutForm(page);
    await page.getByLabel('Workout Name').fill(workoutName);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeVisible();
    await expect(page.getByRole('list').getByText(workoutName)).toHaveCount(0);
    await expect(page.getByRole('combobox', { name: 'Tracking Values' })).not.toHaveJSProperty('validationMessage', '');
  });

  test('1.4 edit an existing workout', async ({ page }) => {
    const updatedName = `Mountain Climbers ${Date.now()}`;

    await openWorkoutsPage(page);
    await openWorkoutMenu(page, 'Push-ups');
    await page.getByRole('menuitem', { name: /Edit/i }).click();

    await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeVisible();
    await expect(page.getByLabel('Workout Name')).toHaveValue('Push-ups');

    await page.getByLabel('Workout Name').fill(updatedName);
    await selectTrackingValues(page, ['WEIGHT']);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeHidden();
    await expect(page.getByText(updatedName)).toBeVisible();
    await expect(page.getByText('Push-ups')).toBeHidden();
    await expect(page.getByRole('listitem').filter({ hasText: updatedName }).getByLabel('WEIGHT')).toBeVisible();
  });

  test('1.5 delete a workout', async ({ page }) => {
    await openWorkoutsPage(page);
    await openWorkoutMenu(page, 'Push-ups');
    await page.getByRole('menuitem', { name: /Delete/ }).click();

    await expect(page.getByText('Push-ups')).toBeHidden();
    await expect(page.getByText('Squats')).toBeVisible();
  });
});

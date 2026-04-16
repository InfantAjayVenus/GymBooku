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

async function openPlansPage(page: Page) {
  await resetAppData(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Plans' }).click();
  await expect(page.getByRole('heading', { name: 'Workout Plans' })).toBeVisible();
}

async function createWorkoutForPlan(page: Page) {
  await page.getByRole('button', { name: 'Workouts' }).click();
  await expect(page.getByRole('heading', { name: 'Workout List' })).toBeVisible();

  await page.getByRole('button', { name: 'add workout' }).click();
  await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeVisible();

  await page.getByLabel('Workout Name').fill('Push-ups');
  await page.getByRole('combobox', { name: 'Tracking Values' }).click();
  await page.getByRole('option', { name: /COUNT/ }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('heading', { name: 'Add Workout' })).toBeHidden();
  await expect(page.getByText('Push-ups').first()).toBeVisible();
}

async function openAddPlanForm(page: Page) {
  await page.getByRole('button', { name: 'add workout' }).click();
  await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeVisible();
}

async function selectWorkouts(page: Page, names: string[]) {
  await page.getByRole('combobox', { name: /Select Workouts/ }).click();

  for (const name of names) {
    await page.getByRole('option', { name: new RegExp(name) }).first().click();
  }

  await page.keyboard.press('Escape');
}

async function selectDays(page: Page, days: string[]) {
  await page.getByRole('combobox', { name: /Select Days/ }).click();

  for (const day of days) {
    await page.getByRole('option', { name: new RegExp(day) }).click();
  }

  await page.keyboard.press('Escape');
}

async function openPlanMenu(page: Page, planName: string) {
  const row = page.getByRole('listitem').filter({ hasText: planName });
  await row.getByRole('button', { name: 'more' }).click();
}

test.describe('Workout Plans', () => {
  test('2.1 view empty state', async ({ page }) => {
    await resetAppData(page);
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Plans' }).click();

    await expect(page.getByRole('heading', { name: 'Workout Plans' })).toBeVisible();
  });

  test('2.2 create a new plan', async ({ page }) => {
    const planName = `Full Body ${Date.now()}`;

    await openPlansPage(page);
    await createWorkoutForPlan(page);
    await page.getByRole('button', { name: 'Plans' }).click();

    await openAddPlanForm(page);
    await page.getByLabel('Plan Name').fill(planName);
    await selectWorkouts(page, ['Push-ups']);
    await selectDays(page, ['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeHidden();
    const planItem = page.getByRole('listitem').filter({ hasText: planName });
    await expect(planItem).toBeVisible();
    await expect(planItem.getByText('Push-ups')).toBeVisible();
    await expect(planItem.getByText('MON')).toBeVisible();
    await expect(planItem.getByText('WED')).toBeVisible();
    await expect(planItem.getByText('FRI')).toBeVisible();
  });

  test('2.3 create a plan validation requires all fields', async ({ page }) => {
    await openPlansPage(page);
    await createWorkoutForPlan(page);
    await page.getByRole('button', { name: 'Plans' }).click();

    await page.getByRole('button', { name: 'add workout' }).click();
    await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeVisible();

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeVisible();
    await expect(page.getByLabel('Plan Name')).toBeFocused();
  });

  test('2.4 edit an existing plan', async ({ page }) => {
    const updatedName = `Leg Day ${Date.now()}`;

    await openPlansPage(page);
    await createWorkoutForPlan(page);
    await page.getByRole('button', { name: 'Plans' }).click();

    await page.getByRole('button', { name: 'add workout' }).click();
    await page.getByLabel('Plan Name').fill('Initial Plan');
    await selectWorkouts(page, ['Push-ups']);
    await selectDays(page, ['MONDAY']);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Initial Plan')).toBeVisible();

    await openPlanMenu(page, 'Initial Plan');
    await page.getByRole('menuitem', { name: /Edit/i }).click();

    await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeVisible();
    await expect(page.getByLabel('Plan Name')).toHaveValue('Initial Plan');

    await page.getByLabel('Plan Name').fill(updatedName);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeHidden();
    await expect(page.getByText(updatedName)).toBeVisible();
    await expect(page.getByText('Initial Plan')).toBeHidden();
  });

  test('2.5 delete a plan', async ({ page }) => {
    await openPlansPage(page);
    await createWorkoutForPlan(page);
    await page.getByRole('button', { name: 'Plans' }).click();

    await page.getByRole('button', { name: 'add workout' }).click();
    await page.getByLabel('Plan Name').fill('To Delete');
    await selectWorkouts(page, ['Push-ups']);
    await selectDays(page, ['MONDAY']);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('To Delete')).toBeVisible();

    await openPlanMenu(page, 'To Delete');
    await page.getByRole('menuitem', { name: /Delete/ }).click();

    await expect(page.getByText('To Delete')).toBeHidden();
  });
});
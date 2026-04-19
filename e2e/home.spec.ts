import { expect, test, type Page } from '@playwright/test';
import { resetAppData } from './helpers';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

async function openHomePage(page: Page) {
  await resetAppData(page);
  await page.goto('/');
  await expect(page.getByText("Today's Workouts")).toBeVisible();
}

async function openPlansPage(page: Page) {
  await page.getByRole('button', { name: 'Plans' }).click();
  await expect(page.getByRole('heading', { name: 'Workout Plans' })).toBeVisible();
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

async function createPlan(page: Page, planName: string, workoutName: string) {
  await openPlansPage(page);
  await page.getByRole('button', { name: 'add workout' }).click();
  await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeVisible();

  await page.getByLabel('Plan Name').fill(planName);
  await selectWorkouts(page, [workoutName]);
  await selectDays(page, DAYS);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeHidden();
  await expect(page.getByText(planName)).toBeVisible();
}

async function clearAllPlans(page: Page) {
  await openPlansPage(page);

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
});

import { expect, type Page } from '@playwright/test';
import { resetAppData, selectDays, selectWorkouts } from './helpers';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export async function openHomePage(page: Page) {
  await resetAppData(page);
  await page.goto('/');
  await expect(page.getByText("Today's Workouts")).toBeVisible();
}

export async function createPlan(page: Page, planName: string, workoutName: string) {
  await page.getByRole('button', { name: 'Plans' }).click();
  await expect(page.getByRole('heading', { name: 'Workout Plans' })).toBeVisible();

  await page.getByRole('button', { name: 'add workout' }).click();
  await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeVisible();

  await page.getByLabel('Plan Name').fill(planName);
  await selectWorkouts(page, [workoutName]);
  await selectDays(page, DAYS);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('heading', { name: 'Create Workout Plan' })).toBeHidden();
  await expect(page.getByText(planName)).toBeVisible();
}

export async function openWorkout(page: Page, workoutName: string) {
  await page.getByText(workoutName, { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Workout Details' })).toBeVisible();
}

export async function fillWorkoutSet(page: Page, setIndex: number, values: number[]) {
  const trackerInputs = page.getByRole('dialog').locator('input');
  const offset = (setIndex - 1) * values.length;

  for (const [index, value] of values.entries()) {
    await trackerInputs.nth(offset + index).fill(value.toString());
  }

  await page.waitForTimeout(1000);
}

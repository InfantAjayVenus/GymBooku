import type { Page } from '@playwright/test';

export async function resetAppData(page: Page) {
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

export async function selectWorkouts(page: Page, names: string[]) {
  await page.getByRole('combobox', { name: /Select Workouts/ }).click();

  for (const name of names) {
    await page.getByRole('option', { name: new RegExp(name) }).first().click();
  }

  await page.keyboard.press('Escape');
}

export async function selectDays(page: Page, days: string[]) {
  await page.getByRole('combobox', { name: /Select Days/ }).click();

  for (const day of days) {
    await page.getByRole('option', { name: new RegExp(day) }).click();
  }

  await page.keyboard.press('Escape');
}

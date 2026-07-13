import { expect, test, type Page } from '@playwright/test';
import { resetAppData } from './helpers';

async function openWeightPage(page: Page) {
  await resetAppData(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Weight' }).click();
}

test.describe('Weight Tracker', () => {
  test('1.1 View weight tracker onboarding', async ({ page }) => {
    await openWeightPage(page);
    await expect(page.getByRole('heading', { name: 'Weight Tracker' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Tracking' })).toBeDisabled();
  });

  test('1.2 Complete onboarding', async ({ page }) => {
    await openWeightPage(page);
    await page.getByLabel('Current Weight (kg)').fill('80');
    await page.getByLabel('Target Weight (kg)').fill('70');
    await page.getByRole('button', { name: '1.0%' }).click();

    await expect(page.getByText(/Estimated time to reach goal:/)).toBeVisible();
    
    await page.getByRole('button', { name: 'Start Tracking' }).click();

    await expect(page.getByRole('heading', { name: "Week's Avg" })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tracked Weights' })).toBeVisible();
  });

  test('1.3 Add a new weight', async ({ page }) => {
    await openWeightPage(page);
    
    // Complete onboarding first
    await page.getByLabel('Current Weight (kg)').fill('80');
    await page.getByLabel('Target Weight (kg)').fill('70');
    await page.getByRole('button', { name: 'Start Tracking' }).click();

    // Now on tracker page
    await page.getByRole('button', { name: 'record weight' }).click(); // The FAB aria-label is 'add workout'
    
    await expect(page.getByRole('heading', { name: 'Track Weight' })).toBeVisible();
    
    await page.getByRole('textbox').fill('79.5');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Track Weight' })).toBeHidden();
    
    await expect(page.getByText('79.5 Kg')).toBeVisible();
  });
});

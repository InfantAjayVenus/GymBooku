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

    await expect(page.getByRole('heading', { name: /Week \d+ Avg/ })).toBeVisible();
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
    
    await expect(page.getByText('79.5 Kg', { exact: true })).toBeVisible();
  });

  test('1.4 Verify week number calculation', async ({ page }) => {
    // 2024-01-01 is a Monday, 2024-01-03 is a Wednesday
    
    // Scenario A: Set goal on Wednesday (Week 0)
    await page.clock.setFixedTime(new Date('2024-01-03T12:00:00.000Z'));
    await openWeightPage(page);
    await page.getByLabel('Current Weight (kg)').fill('80');
    await page.getByLabel('Target Weight (kg)').fill('70');
    await page.getByRole('button', { name: 'Start Tracking' }).click();
    await expect(page.getByRole('heading', { name: 'Week 0 Avg' })).toBeVisible();

    // Fast forward to next Monday (2024-01-08) -> Should be Week 1
    await page.clock.setFixedTime(new Date('2024-01-08T12:00:00.000Z'));
    await page.goto('/');
    await page.getByRole('button', { name: 'Weight' }).click();
    await expect(page.getByRole('heading', { name: 'Week 1 Avg' })).toBeVisible();

    // Fast forward to next Tuesday (2024-01-09) -> Should still be Week 1
    await page.clock.setFixedTime(new Date('2024-01-09T12:00:00.000Z'));
    await page.goto('/');
    await page.getByRole('button', { name: 'Weight' }).click();
    await expect(page.getByRole('heading', { name: 'Week 1 Avg' })).toBeVisible();
  });

  test('1.5 Verify projection list drawer', async ({ page }) => {
    await openWeightPage(page);
    
    // Complete onboarding first
    await page.getByLabel('Current Weight (kg)').fill('80');
    await page.getByLabel('Target Weight (kg)').fill('70');
    await page.getByRole('button', { name: 'Start Tracking' }).click();

    // Open the projection drawer by clicking on the Weeks text
    await page.getByText(/Weeks/).click();

    // Verify the drawer is open
    await expect(page.getByRole('heading', { name: 'Weekly Averages' })).toBeVisible();

    // Verify content inside the drawer
    await expect(page.getByText('Week-0').first()).toBeVisible();
    await expect(page.getByText('Week-1').first()).toBeVisible();

    // Close the drawer
    await page.getByRole('button', { name: 'close drawer' }).click();

    // Verify drawer is closed
    await expect(page.getByRole('heading', { name: 'Weekly Averages' })).toBeHidden();
  });
});

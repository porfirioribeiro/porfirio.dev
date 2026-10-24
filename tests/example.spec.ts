import { test, expect } from '@playwright/test';

test('has title', async ({ page, isMobile }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Porfírio Ribeiro/);

  await expect(page.getByRole('heading', { name: 'Porfírio Ribeiro' })).toBeVisible();

  await clickNav('Projects');
  await clickNav('Skills');
  await clickNav('Resources');
  await clickNav('Blog');

  async function clickNav(name: string) {
    const nav = page.getByRole('navigation', { name: 'Main' });
    if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
    await nav.getByRole('link', { name, exact: true }).click();
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
});

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
		if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
		await page.getByRole('link', { name }).click();
		await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
	}
});

import { expect, test } from '@playwright/test'

test('hub loads and opens Aoba', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '選擇學習語言' })).toBeVisible()
  await page.getByRole('button', { name: /開始日語學習/ }).click()
  await expect(page).toHaveURL(/#aoba/)
  await expect(page.getByText('あおば Aoba').first()).toBeVisible()
})

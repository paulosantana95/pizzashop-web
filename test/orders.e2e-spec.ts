import { expect, test } from '@playwright/test'

test('list orders', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  await expect(
    page.getByRole('cell', { name: 'Costumer 1', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'Costumer 10', exact: true }),
  ).toBeVisible()
})

test('paginate orders', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  await page.getByRole('button', { name: 'Próxima página' }).click()

  await expect(
    page.getByRole('cell', { name: 'Costumer 11', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'Costumer 20', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Última página' }).click()

  await expect(
    page.getByRole('cell', { name: 'Costumer 51', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'Costumer 60', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Página anterior' }).click()

  await expect(
    page.getByRole('cell', { name: 'Costumer 41', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'Costumer 50', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Primeira página' }).click()

  await expect(
    page.getByRole('cell', { name: 'Costumer 1', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'Costumer 10', exact: true }),
  ).toBeVisible()
})

test('filter by order id', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  await page.getByPlaceholder('ID do pedido').fill('order-11')
  await page.getByRole('button', { name: 'Filtrar resultados' }).click()

  await expect(page.getByRole('cell', { name: 'Costumer 11' })).toBeVisible()
})

test('filter by customer name', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  await page.getByPlaceholder('Nome do cliente').fill('Costumer 11')
  await page.getByRole('button', { name: 'Filtrar resultados' }).click()

  await expect(page.getByRole('cell', { name: 'Costumer 11' })).toBeVisible()
})

test('filter by status', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  await page.getByRole('combobox').click()
  await page.getByLabel('Pendente').click()

  await page.getByRole('button', { name: 'Filtrar resultados' }).click()

  await expect(page.getByRole('cell', { name: 'Pendente' })).toHaveCount(10)
})

test('remove filters', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  const orderId = page.getByPlaceholder('ID do pedido')
  await orderId.fill('order-11')

  const customerName = page.getByPlaceholder('Nome do cliente')
  await customerName.fill('Costumer 11')

  await page.getByRole('combobox').click()
  await page.getByLabel('Pendente').click()

  await page.getByRole('button', { name: 'Remover filtros' }).click()

  const selectedOption = await page.inputValue('select')
  expect(selectedOption).toBe('all')

  expect(await orderId.inputValue()).toBe('')
  expect(await customerName.inputValue()).toBe('')

  await expect(
    page.getByRole('cell', { name: 'Costumer 1', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'Costumer 10', exact: true }),
  ).toBeVisible()
})

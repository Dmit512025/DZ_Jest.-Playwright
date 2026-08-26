// tests/auth.spec.js
import { test, expect } from '@playwright/test';
import { email, password } from '../user.js';

test('Успешная авторизация: вход на netology.ru', async ({ page }) => {
  // 1. Открываем страницу авторизации
  await page.goto('https://netology.ru/login');

  // 2. Вводим email
  await page.fill('input[type="email"], input[name="email"]', email);

  // 3. Вводим пароль
  await page.fill('input[type="password"], input[name="password"]', password);

  // 4. Нажимаем кнопку «Войти»
  await page.click('button[type="submit"], button[text="Войти"]');

  // 5. Ждём открытия страницы профиля (или редиректа)
  await expect(page).toHaveURL(/\/profile|\/dashboard/i);

  // 6. Проверяем, что виден заголовок профиля (например, h2)
  const h2 = page.locator('h2');
  await expect(h2).toBeVisible();

  // Опционально: проверь текст заголовка, если знаешь ожидаемое значение
  // await expect(h2).toHaveText(/ваш_текст/i);
});

test('Неуспешная авторизация: неверный пароль', async ({ page }) => {
  await page.goto('https://netology.ru/login');

  // Вводим правильный email
  await page.fill('input[type="email"], input[name="email"]', email);

  // Вводим НЕПРАВИЛЬНЫЙ пароль
  await page.fill('input[type="password"], input[name="password"]', 'wrong-password-123');

  // Нажимаем «Войти»
  await page.click('button[type="submit"], button[text="Войти"]');

  // Ждём появления сообщения об ошибке
  const errorMessage = page.locator('.error-message, .alert, [data-testid="error-message"]');
  await expect(errorMessage).toBeVisible();

  // Проверяем текст ошибки (подстрой под реальный текст на сайте)
  await expect(errorMessage).toHaveText(/неверный|error|invalid/i);
});

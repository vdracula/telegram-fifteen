# Пятнашки — Telegram Mini App на React

Неоновая игра «Пятнашки» как Telegram Mini App: размеры поля 3×3, 4×4, 5×5, таймер, лучший результат и анимация движения фишек.

## Технологии

- React + TypeScript (Vite)
- Telegram WebApp API (Mini Apps) [web:52][web:192]
- CSS‑неон, адаптив под ПК и мобильные устройства

## Возможности

- Поле 3×3 / 4×4 / 5×5 с корректной анимацией сдвига.
- Таймер прохождения и локальный рекорд (localStorage). [web:136][web:140]
- Звук перемещения фишек.
- Обращение к пользователю по имени/username из `initDataUnsafe` внутри Telegram. [web:177]

## Запуск локально

```bash
npm install
npm run dev
```

# Loan Application SPA

Одностраничное приложение на React + TypeScript с тремя последовательными формами и финальной модалкой подтверждения заявки.

## Стек и ключевые решения
- React 18, TypeScript, React Router 6 — соответствуют требованиям задания.
- Vite + `@vitejs/plugin-react-swc` — быстрая сборка и DX; выбор задокументирован в `vite.config.ts`.
- Контекст `FormDataContext` хранит все данные между шагами и кеширует справочник категорий.
- Валидация и форматирование реализованы без сторонних библиотек для простоты и прозрачности.

## Требования к окружению
- Node.js 18+
- npm 9+

## Скрипты
```bash
npm install      # установка зависимостей
npm run dev      # запуск дев-сервера на http://localhost:5173
npm run build    # production-сборка в папку dist
npm run preview  # предпросмотр production-сборки
```

## API
- Категории работодателей: `GET https://dummyjson.com/products/categories`
- Отправка заявки: `POST https://dummyjson.com/products/add`

## Время выполнения
~3 часа.

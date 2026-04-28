# Arena 1 — arena1.gg

## Проект
Arena 1 — медиабренд и чемпионат по Arena FPS (Quake Live). "The Premier League of Aim."
Сайт: https://arena1.gg
Репо: https://github.com/xaaoos/arena1-gg

## Стек
- Vite + React 18 + TypeScript + React Router
- Деплой: Vercel (SPA rewrites через vercel.json)
- Стили: inline styles, без CSS-фреймворков
- Шрифты: Orbitron (заголовки), JetBrains Mono (тело)

## Команды
- npm run dev — локальный сервер
- npm run build — продакшн сборка
- git push — триггерит деплой на Vercel автоматически

## Страницы
- / → pages/Championship.tsx — лендинг чемпионата
- /verified → pages/Verified.tsx — система рейтинга
- /trainer → pages/Trainer.tsx — тренажёр таймингов
- /championships → ПЛАНИРУЕТСЯ — результаты турниров и сетки

## Компоненты
- TopNav.tsx — хедер с навигацией и переключателем RU/EN
- UI.tsx — переиспользуемые компоненты (ScanLine, GlitchText, CUnit, SL, ST)
- Icons.tsx — SVG иконки

## Данные
- src/data/championship.ts — тексты Championship (RU/EN) + LAUNCH_DATE
- src/data/verified.ts — тексты Verified (RU/EN)

## Правила
- Все новые тексты добавлять в src/data/ с поддержкой RU/EN
- Стили — inline, без Tailwind и CSS-модулей
- Не трогать vercel.json
- Язык общения: русский

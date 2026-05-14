# Arena 1 — arena1.gg

## Проект
Arena 1 — медиабренд и чемпионат по Arena FPS (Quake Live). "The Premier League of Aim."
Сайт: https://arena1.gg
Репо: https://github.com/xaaoos/arena1-gg

## Стек
- Vite + React 18 + TypeScript + React Router
- Деплой: VPS 159.194.228.38 (юзер easyte), rsync в /var/www/easysite/arena1/
- Стили: inline styles, без CSS-фреймворков
- Шрифты: Orbitron (заголовки), JetBrains Mono (тело)

## Команды
- npm run dev — локальный сервер
- npm run build — продакшн сборка
- Деплой: `npm run build && rsync -avz --checksum dist/ easyte@159.194.228.38:/var/www/easysite/arena1/`

## Страницы
- / → pages/Championship.tsx — лендинг чемпионата
- /verified → pages/Verified.tsx — система рейтинга
- /trainer → pages/Trainer.tsx — тренажёр таймингов
- /elocup → pages/EloCup.tsx — ELO Cup турниры и результаты

## Компоненты
- TopNav.tsx — хедер с навигацией и переключателем RU/EN
- UI.tsx — переиспользуемые компоненты (ScanLine, GlitchText, CUnit, SL, ST)
- Icons.tsx — SVG иконки

## Данные
- src/data/championship.ts — тексты Championship (RU/EN) + LAUNCH_DATE
- src/data/verified.ts — тексты Verified (RU/EN)
- src/data/elocup.ts — данные ELO Cup (RU/EN): турниры, standings, маппул

## Правила
- Все новые тексты добавлять в src/data/ с поддержкой RU/EN
- Стили — inline, без Tailwind и CSS-модулей
- Язык общения: русский

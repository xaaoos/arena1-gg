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
- Деплой: `git push origin main` (GitHub Actions → rsync на VPS)

## Страницы
- / → редирект на /non-pro-duel-cups
- /non-pro-duel-cups → pages/EloCup.tsx — еженедельные дуэльные кубки
- /divisions → pages/Divisions.tsx — дивизионы и игроки (данные из Google Sheets)
- /trainer → pages/Trainer.tsx — тренажёр таймингов
- /blog → pages/Blog.tsx — блог
- /blog/:slug → pages/BlogPost.tsx
- /championship → pages/Championship.tsx — скрыт (не в навигации)
- /verified → pages/Verified.tsx — скрыт (не в навигации)

## Компоненты
- TopNav.tsx — хедер с навигацией и переключателем RU/EN
- UI.tsx — переиспользуемые компоненты (ScanLine, GlitchText, CUnit, SL, ST)
- Icons.tsx — SVG иконки

## Данные
- src/data/elocup.ts — тексты Non-Pro Duel Cups (RU/EN)
- src/data/championship.ts — тексты Championship (RU/EN) + LAUNCH_DATE
- src/data/verified.ts — тексты Verified (RU/EN)

## Google Sheets синхронизация
Данные подтягиваются live при загрузке страницы (fetch CSV).
Обе таблицы должны быть публичны (Все в интернете могут просматривать).

- **Дивизионы** — src/hooks/useSheetData.ts
  ID: 1Fbu4iDV6m7XxY98s78OjEEfQF0HelkJKFH-xeZBdvhA
  Структура CSV: col[0]=пусто, col[1]=метка дивизиона, col[2]=игрок, col[3]=ELO, col[4]=?

- **Архив кубков** — src/hooks/useArchiveData.ts
  ID: 1TpT3Q3H_AZEUhDun28hQTuTm3qu4YWpEZddwo1EsrI8
  Структура CSV: col[0]=пусто, col[1]=дата, col[2]=ссылка на сетку, col[3]=результаты (многострочная ячейка)
  Формат результатов: первая строка = название кубка, "Standings:", затем "1. Игрок", "2. Игрок" и т.д.

## Страница /non-pro-duel-cups
- Герой: тег NON-PRO, заголовок DUEL CUPS, кнопки Discord и "Дивизионы и игроки"
- Раздел Анонс: скрыт
- Раздел Результаты: сетка карточек, клик открывает попап с полными результатами

## Страница /divisions
- Единая таблица: Дивизион | Игрок | ELO
- Sticky sub-nav с навигацией по дивизионам
- Данные из Google Sheets (useSheetData)

## Правила
- Все новые тексты добавлять в src/data/ с поддержкой RU/EN
- Стили — inline, без Tailwind и CSS-модулей
- Не трогать vercel.json
- Язык общения: русский

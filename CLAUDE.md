# Arena 1 — arena1.gg

## Проект
Arena 1 — медиабренд и чемпионат по Arena FPS (Quake Live). "The Premier League of Aim."
Сайт: https://arena1.gg
Репо: https://github.com/xaaoos/arena1-gg

## Стек
- Vite + React 18 + TypeScript + React Router
- Деплой: VPS 159.194.228.38 (юзер easyte), rsync в /var/www/easysite/arena1/
- Стили: inline styles, без CSS-фреймворков
- Шрифты: Tektur (заголовки — поддерживает кириллицу), JetBrains Mono (тело)

## Команды
- npm run dev — локальный сервер
- npm run build — продакшн сборка
- Деплой: `git push origin main` (GitHub Actions → rsync на VPS)

## Страницы
- / → pages/Announce.tsx — главная: анонсы кубков с обратным отсчётом
- /non-pro-duel-cups → pages/EloCup.tsx — результаты: первые 4 кубка раскрыты, остальные попапом + поиск игрока по истории
- /divisions → pages/Divisions.tsx — дивизионы и игроки (данные из Google Sheets)
- /trainer → pages/Trainer.tsx — тренажёр таймингов
- /blog → pages/Blog.tsx — блог
- /blog/:slug → pages/BlogPost.tsx
- /championship → pages/Championship.tsx — скрыт (не в навигации)
- /verified → pages/Verified.tsx — скрыт (не в навигации)

## Навигация
- TopNav: главное меню (Non-Pro Duel Cups → /, Trainer, Blog); пункт Non-Pro активен на /, /non-pro-duel-cups, /divisions (isNonPro)
- Sub-nav (второй уровень): на /, /non-pro-duel-cups, /divisions
  Порядок: Анонсы | Результаты | Дивизионы и игроки | Регистрация
  На мобильном justifyContent flex-start (center при overflow обрезает левый край)
- В мобильном drawer: sub-nav тоже только на релевантных страницах

## Компоненты
- TopNav.tsx — хедер + sub-nav + мобильный drawer
- UI.tsx — переиспользуемые компоненты (ScanLine, GlitchText, CUnit, SL, ST)
- Icons.tsx — SVG иконки

## Данные
- src/data/elocup.ts — тексты Non-Pro Duel Cups (RU/EN)
- src/data/championship.ts — тексты Championship (RU/EN) + LAUNCH_DATE
- src/data/verified.ts — тексты Verified (RU/EN)

## Google Sheets синхронизация
Данные подтягиваются live при загрузке страницы (fetch CSV).
Обе таблицы публичны (Все в интернете могут просматривать).

- **Дивизионы** — src/hooks/useSheetData.ts
  ID: 1Fbu4iDV6m7XxY98s78OjEEfQF0HelkJKFH-xeZBdvhA
  Структура CSV: col[0]=место в общем рейтинге, col[1]=метка дивизиона, col[2]=игрок, col[3]=ELO, дальше "?" (неуверенный рейтинг)
  Дельта ELO: самая правая заполненная колонка (от col[4]) вида "+25"/"-13" → бейдж ▲/▼ рядом с ELO
  Место: если col[0] пустое — считается автоматически по порядку строк

- **Архив кубков** — src/hooks/useArchiveData.ts
  ID: 1TpT3Q3H_AZEUhDun28hQTuTm3qu4YWpEZddwo1EsrI8
  Структура CSV: col[0]=пусто, col[1]=дата, col[2]=ссылка на сетку, col[3]=результаты (многострочная ячейка)
  Формат результатов: первая строка = название кубка, "Standings:", затем "1. Игрок", "2. Игрок" и т.д.
  **Анонс**: строка с датой (сегодня/будущее), но БЕЗ строк результатов = анонс следующего кубка.
  col[1]=дата+время ("14.06.2026 19:00 MSK"), col[2]=ссылка регистрации (опц.), col[3]=название кубка + доп. строки (ELO-диапазон, приз).
  Когда вписываются результаты — строка автоматически становится карточкой архива, анонс исчезает.

## Главная / (анонсы)
- Герой: тег ARENA 1, заголовок NON-PRO DUEL CUPS
- Ближайший кубок крупно: рамка с углами, обратный отсчёт (Countdown), CTA регистрация
- Следующие кубки — компактный список «Далее»
- Данные из таблицы архива (строки-анонсы, см. выше); МОК-анонсы в Announce.tsx пока таблица пустая

## Страница /non-pro-duel-cups (результаты)
- Герой: «Прошедшие турниры» + поиск игрока за всю историю
- Поиск: все кубки где участвовал ник — место, турнир, дата, кнопка «Результаты» (попап) + ссылка на сетку
- Первые 4 кубка раскрыты сразу (грид 2 колонки, мобильный 1), остальные под лейблом «Ранее» — карточки с попапом

## Страница /divisions
- Hero: заголовок ДИВИЗИОНЫ & ИГРОКИ (Tektur, letterSpacing 3-5)
- Поиск по нику + селект для прыжка к дивизиону
- Таблица: Игрок | ELO с sticky-хедером (top: 80 = нав 48 + саб-нав 32, фон непрозрачный)
- Дельта ELO из таблицы: ▲N зелёный / ▼N красный рядом с ELO
- Каждый дивизион отделён заголовком-строкой (метка + диапазон ELO + кол-во игроков)
- Данные из Google Sheets (useSheetData)
- ВАЖНО: overflow-x:hidden ломает position:sticky у потомков — нигде не использовать, только overflow-x:clip (включая body в index.css)
- Саб-нав: фиксированная высота 32px — sticky-offset на /divisions завязан на неё
- Поле поиска: fontSize:16 обязательно — иначе мобильный браузер зумирует

## Темы (светлая/тёмная)
- Цвета через CSS-переменные в src/index.css
- Акцентный цвет: --accent (#4ade80 тёмная / #15803d светлая)
- Места: --place-1/2/3 (золото/серебро/бронза — тёмные версии в светлой теме)
- AC = "#4ade80" — только для hex-opacity паттернов (${AC}08, ${AC}33 и т.д.)
- ACS = C.accent — для solid text/border использований

## Правила
- Все новые тексты добавлять в src/data/ с поддержкой RU/EN
- Стили — inline, без Tailwind и CSS-модулей
- Язык общения: русский

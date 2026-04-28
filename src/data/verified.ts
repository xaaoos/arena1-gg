export const VER = {
  ru: {
    nav: ["Verified", "Проблема", "Как работает", "Кому нужно", "Почему мы", "Игроки", "Заявка"],
    hero: { badge: "A R E N A  1  V E R I F I E D", t1: "Единственный рейтинг,", t2: "которому можно доверять.", text: "Серверный ELO врёт. Arena 1 Verified — независимая система подтверждения реального уровня игроков Arena FPS. Живой анализ перформанса в контролируемых условиях." },
    problem: {
      num: "01", label: "ПРОБЛЕМА", t1: "Почему серверный ELO", t2: "не работает",
      items: [
        { title: "Смурфы и сандбэггеры", desc: "Игроки намеренно занижают рейтинг, чтобы доминировать в слабых брекетах." },
        { title: "Протухший рейтинг", desc: "Неактивные аккаунты сохраняют старый ELO, который больше не отражает реальный скилл." },
        { title: "Разные пулы", desc: "Один и тот же игрок имеет разный рейтинг на разных серверах и в разных играх." },
        { title: "Нет единого стандарта", desc: "У AFPS-сцены нет авторитетного источника правды о скилле игроков." },
      ],
      result: "Турнирный сидинг, ставки и репутация игроков строятся на ненадёжных данных.",
    },
    how: {
      num: "02", label: "КАК РАБОТАЕТ", t1: "От заявки", t2: "до верифицированного рейтинга",
      steps: [
        { num: "01", title: "Квалификационные сессии", desc: "Серия матчей в контролируемых условиях — фиксированный формат, наблюдение аналитиков, запись статистики." },
        { num: "02", title: "Живой анализ", desc: "Аналитики оценивают реальный перформанс: точность, позиционирование, принятие решений, стабильность. Не K/D — полная картина скилла." },
        { num: "03", title: "Верифицированный рейтинг", desc: "Подтверждённый Arena 1 Verified рейтинг — единый, кроссплатформенный, привязанный к реальному уровню." },
        { num: "04", title: "Регулярная ревалидация", desc: "Рейтинг не вечный. Периодические проверки поддерживают актуальность — растёшь или проседаешь, рейтинг обновляется." },
      ],
    },
    who: {
      num: "03", label: "КОМУ ЭТО НУЖНО", t1: "Одна система.", t2: "Все в выигрыше.",
      items: [
        { title: "Игрокам", desc: "Реальный уровень подтверждён независимым авторитетом. Никаких споров «ты смурф» или «ты бустед». Verified — репутация в цифре." },
        { title: "Турнирным организаторам", desc: "Честный сидинг без сюрпризов. Verified рейтинг для формирования групп и брекетов. Никаких скандалов с посевом." },
        { title: "Зрителям", desc: "Понятная иерархия. Подтверждённый рейтинг у каждого игрока — расклады читаются с первого взгляда." },
      ],
    },
    why: {
      num: "04", label: "ПОЧЕМУ ARENA 1", t1: "Не просто рейтинг.", t2: "Экосистема.",
      items: [
        { title: "Свой чемпионат", desc: "Arena 1 Championship генерирует данные и проверяет рейтинги в боевых условиях." },
        { title: "Независимость", desc: "Не привязаны к одной игре или серверу." },
        { title: "Экспертиза", desc: "Аналитики знают сцену изнутри и видят то, что не видит алгоритм." },
        { title: "Прозрачность", desc: "Методология открыта, результаты публичны." },
      ],
    },
    players: {
      num: "05", label: "ВЕРИФИЦИРОВАННЫЕ ИГРОКИ", t1: "Верифицированные игроки —", t2: "Дуэль",
      cols: { rank: "#", player: "Игрок", elo: "ELO", date: "Дата верификации" },
      list: [
        { rank: 1, player: "Rapha", elo: 2500, date: "15.04.2026" },
        { rank: 2, player: "Cypher", elo: 2450, date: "12.04.2026" },
        { rank: 3, player: "Agent", elo: 2400, date: "10.04.2026" },
        { rank: 4, player: "Killsen", elo: 2350, date: "14.04.2026" },
        { rank: 5, player: "Ash", elo: 2250, date: "11.04.2026" },
        { rank: 6, player: "Pavel", elo: 2250, date: "08.04.2026" },
      ],
    },
    cta: { num: "06", label: "РЕГИСТРАЦИЯ", t1: "Докажи", t2: "свой уровень", desc: "Arena 1 Verified — открытая регистрация на квалификационные сессии.", btn1: "Подать заявку", btn1sub: "для игроков", btn2: "Использовать рейтинг", btn2sub: "для организаторов" },
    fq1: "Серверный ELO — это мнение алгоритма.", fq2: "Arena 1 Verified — это факт.",
    footer: "ARENA 1 VERIFIED · THE STANDARD OF SKILL · 2026",
  },
  en: {
    nav: ["Verified", "Problem", "How it works", "Who needs it", "Why us", "Players", "Apply"],
    hero: { badge: "A R E N A  1  V E R I F I E D", t1: "The only rating", t2: "you can trust.", text: "Server ELO lies. Arena 1 Verified is an independent system for confirming the real skill level of Arena FPS players. Live performance analysis under controlled conditions." },
    problem: {
      num: "01", label: "THE PROBLEM", t1: "Why server ELO", t2: "doesn't work",
      items: [
        { title: "Smurfs & sandbaggers", desc: "Players intentionally lower their rating to dominate weaker brackets." },
        { title: "Stale ratings", desc: "Inactive accounts keep old ELO that no longer reflects real skill." },
        { title: "Fragmented pools", desc: "The same player has different ratings across different servers and games." },
        { title: "No single standard", desc: "The AFPS scene has no authoritative source of truth about player skill." },
      ],
      result: "Tournament seeding, bets, and player reputation are built on unreliable data.",
    },
    how: {
      num: "02", label: "HOW IT WORKS", t1: "From application", t2: "to verified rating",
      steps: [
        { num: "01", title: "Qualification sessions", desc: "A series of matches under controlled conditions — fixed format, analyst observation, full stat recording." },
        { num: "02", title: "Live analysis", desc: "Analysts evaluate real performance: accuracy, positioning, decision-making, consistency. Not K/D — the full picture of skill." },
        { num: "03", title: "Verified rating", desc: "A confirmed Arena 1 Verified rating — unified, cross-platform, tied to real skill level." },
        { num: "04", title: "Regular revalidation", desc: "Ratings don't last forever. Periodic reviews keep them current — improve or decline, the rating updates." },
      ],
    },
    who: {
      num: "03", label: "WHO NEEDS THIS", t1: "One system.", t2: "Everyone benefits.",
      items: [
        { title: "Players", desc: "Real skill confirmed by an independent authority. No more 'you're a smurf' or 'you're boosted' arguments. Verified is your reputation in numbers." },
        { title: "Tournament organizers", desc: "Fair seeding with no surprises. Use Verified ratings for groups and brackets. No more seeding scandals." },
        { title: "Viewers", desc: "Clear hierarchy. Every player has a confirmed rating — matchups make sense at first glance." },
      ],
    },
    why: {
      num: "04", label: "WHY ARENA 1", t1: "Not just a rating.", t2: "An ecosystem.",
      items: [
        { title: "Our own championship", desc: "Arena 1 Championship generates data and validates ratings under real competition." },
        { title: "Independence", desc: "Not tied to any single game or server." },
        { title: "Expertise", desc: "Our analysts know the scene from the inside and see what algorithms can't." },
        { title: "Transparency", desc: "Methodology is open, results are public." },
      ],
    },
    players: {
      num: "05", label: "VERIFIED PLAYERS", t1: "Verified Players —", t2: "Duel",
      cols: { rank: "#", player: "Player", elo: "ELO", date: "Verification date" },
      list: [
        { rank: 1, player: "Rapha", elo: 2500, date: "Apr 15, 2026" },
        { rank: 2, player: "Cypher", elo: 2450, date: "Apr 12, 2026" },
        { rank: 3, player: "Agent", elo: 2400, date: "Apr 10, 2026" },
        { rank: 4, player: "Killsen", elo: 2350, date: "Apr 14, 2026" },
        { rank: 5, player: "Ash", elo: 2250, date: "Apr 11, 2026" },
        { rank: 6, player: "Pavel", elo: 2250, date: "Apr 8, 2026" },
      ],
    },
    cta: { num: "06", label: "REGISTRATION", t1: "Prove", t2: "your level", desc: "Arena 1 Verified — open registration for qualification sessions.", btn1: "Apply now", btn1sub: "for players", btn2: "Use the rating", btn2sub: "for organizers" },
    fq1: "Server ELO is an algorithm's opinion.", fq2: "Arena 1 Verified is a fact.",
    footer: "ARENA 1 VERIFIED · THE STANDARD OF SKILL · 2026",
  },
};

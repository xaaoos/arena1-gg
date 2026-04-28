export const LAUNCH_DATE: Date | null = null;

export const CHAMP = {
  ru: {
    nav: ["A1", "Почему мы", "Формат", "Трансляции", "Участвовать"],
    hero: { tag: "F P S   C H A M P I O N S H I P", slogan: "The Premier League of Aim", sub: "Лучшие геймеры мира. Один победитель. Миллионы зрителей.", date: "ПИЛОТНЫЙ ТУРНИР · ДАТА УТОЧНЯЕТСЯ", cta1: "Участвовать", cta2: "Трансляции" },
    cd: { d: "дней", h: "часов", m: "минут", s: "секунд" },
    why: {
      num: "01", label: "ПОЧЕМУ ARENA 1", t1: "Киберспорт, каким он", t2: "должен быть",
      points: [
        { color: "#ffd700", title: "Только элита", desc: "На арене — только лучшие. 8 человек, и каждого из них знает комьюнити. Это не открытый турнир. Это чемпионат легенд." },
        { color: "#ff3e3e", title: "Чистый скилл без примесей", desc: "Никаких лутбоксов, способностей, героев и RNG. Quake — реакция, прицел и движение в чистом виде. Побеждает лучший. Точка." },
        { color: "#00f0ff", title: "35 минут, которые невозможно забыть", desc: "Каждые 5 минут кто-то вылетает. Напряжение растёт с каждым раундом. Финальная дуэль — кульминация, к которой ведёт каждый фраг." },
      ],
      quote: "Здесь играют мастера. Здесь решает скилл. Здесь рождаются легенды.",
    },
    format: {
      num: "02", label: "КАК ЭТО РАБОТАЕТ", t1: "Каждые 5 минут", t2: "кто-то уходит",
      rounds: [
        { r: "РАУНД 1", p: "8 игроков", a: "1 вылетает", t: "5 мин" },
        { r: "РАУНД 2", p: "7 игроков", a: "1 вылетает", t: "5 мин" },
        { r: "РАУНД 3", p: "6 игроков", a: "1 вылетает", t: "5 мин" },
        { r: "РАУНД 4", p: "5 игроков", a: "1 вылетает", t: "5 мин" },
        { r: "РАУНД 5", p: "4 игрока", a: "1 вылетает", t: "5 мин" },
        { r: "РАУНД 6", p: "3 игрока", a: "1 вылетает", t: "5 мин" },
        { r: "ФИНАЛ", p: "2 игрока", a: "ДУЭЛЬ", t: "5 мин", final: true },
      ],
      stats: [{ v: "8", l: "легенд на арене" }, { v: "7", l: "раундов за матч" }, { v: "~35", l: "минут до чемпиона" }, { v: "1", l: "победитель" }],
      footer: "Сезон = несколько этапов • Очковая система • Финал сезона — топ-8 по итогам",
    },
    watch: {
      num: "03", label: "ТРАНСЛЯЦИИ", t1: "Реакция 120 мс.", t2: "Прицел в пиксель.",
      text: "Мастерство, отточенное годами. Контроль карты, просчитанный на 30 секунд вперёд. Решения, которые разбирают месяцами. Всё это — в реальном времени.",
      features: [
        { title: "Прямой эфир с комментаторами", desc: "Профессиональный кастинг каждого матча. Разбор решений, тактик и моментов, которые определяют исход." },
        { title: "Сезонная гонка", desc: "Несколько этапов, турнирная таблица, борьба за титул. Путь мастера от первого матча до финала." },
        { title: "Фрагмуви и разборы", desc: "Лучшие моменты, анализ решений, безумные клатчи. Контент, который пересматривают годами." },
      ],
    },
    verify: {
      num: "04", label: "ДЛЯ КВЕЙКЕРОВ", t1: "Арена ждёт.", t2: "Ты готов?",
      desc: "Arena 1 — чемпионат для лучших. Пройди верификацию, чтобы встать рядом с легендами.",
      progress: "ПРОГРЕСС", done: "✓ ВЕРИФИКАЦИЯ ПРОЙДЕНА", doneDesc: "Добро пожаловать в Arena 1",
      steps: [
        { id: "steam", label: "Steam аккаунт с Quake Live", detail: "Не менее 50 часов в игре" },
        { id: "qlstats", label: "QLStats профиль", detail: "ELO ≥ 1200 в любом режиме" },
        { id: "discord", label: "Discord верификация", detail: "Присоединиться к серверу Arena 1" },
        { id: "demo", label: "Демо-матч", detail: "Загрузить 1 демо последних 30 дней" },
        { id: "rules", label: "Принять правила", detail: "Согласие с кодексом честной игры" },
      ],
    },
    footer: "FPS CHAMPIONSHIP · THE PREMIER LEAGUE OF AIM · 2026",
  },
  en: {
    nav: ["A1", "Why us", "Format", "Broadcasts", "Compete"],
    hero: { tag: "F P S   C H A M P I O N S H I P", slogan: "The Premier League of Aim", sub: "The world's best gamers. One winner. Millions watching.", date: "PILOT TOURNAMENT · DATE TBA", cta1: "Compete", cta2: "Broadcasts" },
    cd: { d: "days", h: "hours", m: "minutes", s: "seconds" },
    why: {
      num: "01", label: "WHY ARENA 1", t1: "Esports the way it", t2: "should be",
      points: [
        { color: "#ffd700", title: "Only the elite", desc: "Only the best play here. 8 players in the arena, and the community knows every one of them. This isn't an open tournament. This is a championship of legends." },
        { color: "#ff3e3e", title: "Pure skill, nothing else", desc: "No lootboxes, no abilities, no heroes, no RNG. Quake is reaction, aim, and movement in their purest form. The best player wins. Period." },
        { color: "#00f0ff", title: "35 minutes you won't forget", desc: "Every 5 minutes someone is eliminated. Tension builds with every round. The final duel is the climax that every frag leads to." },
      ],
      quote: "Masters play here. Skill decides. Legends are born.",
    },
    format: {
      num: "02", label: "HOW IT WORKS", t1: "Every 5 minutes", t2: "someone goes down",
      rounds: [
        { r: "ROUND 1", p: "8 players", a: "1 eliminated", t: "5 min" },
        { r: "ROUND 2", p: "7 players", a: "1 eliminated", t: "5 min" },
        { r: "ROUND 3", p: "6 players", a: "1 eliminated", t: "5 min" },
        { r: "ROUND 4", p: "5 players", a: "1 eliminated", t: "5 min" },
        { r: "ROUND 5", p: "4 players", a: "1 eliminated", t: "5 min" },
        { r: "ROUND 6", p: "3 players", a: "1 eliminated", t: "5 min" },
        { r: "FINAL", p: "2 players", a: "DUEL", t: "5 min", final: true },
      ],
      stats: [{ v: "8", l: "legends in the arena" }, { v: "7", l: "rounds per match" }, { v: "~35", l: "minutes to a champion" }, { v: "1", l: "winner" }],
      footer: "Season = multiple stages • Points system • Season final — top 8 overall",
    },
    watch: {
      num: "03", label: "BROADCASTS", t1: "120ms reaction.", t2: "Pixel-perfect aim.",
      text: "Mastery honed over years. Map control calculated 30 seconds ahead. Decisions analyzed for months. All of it — live.",
      features: [
        { title: "Live with commentators", desc: "Professional casting of every match. Breakdown of decisions, tactics, and moments that decide the outcome." },
        { title: "Season race", desc: "Multiple stages, standings table, the fight for the title. A master's path from first match to the final." },
        { title: "Fragmovies & analysis", desc: "Best moments, decision breakdowns, insane clutches. Content people rewatch for years." },
      ],
    },
    verify: {
      num: "04", label: "FOR QUAKERS", t1: "The arena awaits.", t2: "Are you ready?",
      desc: "Arena 1 is a championship for the best. Complete verification to stand alongside legends.",
      progress: "PROGRESS", done: "✓ VERIFICATION COMPLETE", doneDesc: "Welcome to Arena 1",
      steps: [
        { id: "steam", label: "Steam account with Quake Live", detail: "Minimum 50 hours in-game" },
        { id: "qlstats", label: "QLStats profile", detail: "ELO ≥ 1200 in any mode" },
        { id: "discord", label: "Discord verification", detail: "Join the Arena 1 server" },
        { id: "demo", label: "Demo match", detail: "Upload 1 demo from the last 30 days" },
        { id: "rules", label: "Accept rules", detail: "Agree to the fair play code" },
      ],
    },
    footer: "FPS CHAMPIONSHIP · THE PREMIER LEAGUE OF AIM · 2026",
  },
};

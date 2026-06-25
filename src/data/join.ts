// Ссылки участия (одно место правды — меняй здесь)
export const STEAM_URL = "https://steamcommunity.com/profiles/76561198257351377";
export const STEAM_FRIEND_CODE = "297085649";
export const DISCORD_URL = "https://discord.gg/dgPwNAph2j";
export const QLSTATS_URL = "https://qlstats.net/";

export const JOIN = {
  ru: {
    seoTitle: "Участвовать",
    seoDesc:
      "Как принять участие в турнирах Arena 1 по Quake Live: попасть в дивизион проверенных игроков — заявка через Steam или Discord.",
    tag: "QUAKE LIVE",
    h1: "Участвовать",
    h2: "в турнирах",
    intro:
      "Чтобы играть в турнирах Arena 1, нужно попасть в один из дивизионов в списке проверенных игроков. Это бесплатно — достаточно подать заявку одним из способов ниже.",
    introLink: "Список дивизионов",
    steps: {
      num: "01",
      label: "КАК ПОДАТЬ ЗАЯВКУ",
      t1: "Два способа",
      t2: "попасть в дивизион",
    },
    paths: [
      {
        kind: "steam" as const,
        tag: "Способ 1",
        title: "Через Steam",
        items: [
          "Отправь заявку в друзья на Steam-аккаунт организатора.",
          "После принятия заявки напиши, что хочешь участвовать в турнирах.",
        ],
        codeLabel: "Код дружбы",
        code: STEAM_FRIEND_CODE,
        btn: "Открыть Steam-профиль",
        url: STEAM_URL,
      },
      {
        kind: "discord" as const,
        tag: "Способ 2",
        title: "Через Discord",
        items: [
          "Зайди на наш Discord-сервер.",
          "Напиши, что хочешь участвовать в турнирах.",
          "Укажи свой Steam-аккаунт и ELO в режиме дуэль.",
        ],
        btn: "Зайти в Discord",
        url: DISCORD_URL,
      },
    ],
    ql: {
      num: "02",
      label: "РЕКОМЕНДАЦИЯ",
      title: "Открытый профиль на qlstats.net",
      text: "Желательно, чтобы у тебя был открытый профиль на qlstats.net — это сильно упрощает определение твоего дивизиона. В скором времени это условие может стать обязательным.",
      btn: "Открыть qlstats.net",
    },
    cta: {
      num: "03",
      label: "ВОПРОСЫ",
      t1: "Остались",
      t2: "вопросы?",
      text: "Все дальнейшие действия по регистрации, участию в турнирах и любые интересующие вопросы можно уточнить на нашем Discord-сервере.",
      btn: "Перейти в Discord",
    },
    footer: "ARENA 1 · NON-PRO DUEL CUPS · 2026",
  },
  en: {
    seoTitle: "Join",
    seoDesc:
      "How to take part in Arena 1 Quake Live tournaments: get into a verified-players division — apply via Steam or Discord.",
    tag: "QUAKE LIVE",
    h1: "Join the",
    h2: "tournaments",
    intro:
      "To play in Arena 1 tournaments you need to be placed in one of the divisions on the verified players list. It's free — just apply one of the ways below.",
    introLink: "Divisions list",
    steps: {
      num: "01",
      label: "HOW TO APPLY",
      t1: "Two ways",
      t2: "to get a division",
    },
    paths: [
      {
        kind: "steam" as const,
        tag: "Option 1",
        title: "Via Steam",
        items: [
          "Send a friend request to the organizer's Steam account.",
          "Once accepted, message that you want to take part in tournaments.",
        ],
        codeLabel: "Friend code",
        code: STEAM_FRIEND_CODE,
        btn: "Open Steam profile",
        url: STEAM_URL,
      },
      {
        kind: "discord" as const,
        tag: "Option 2",
        title: "Via Discord",
        items: [
          "Join our Discord server.",
          "Say you want to take part in tournaments.",
          "Include your Steam account and your duel-mode ELO.",
        ],
        btn: "Join Discord",
        url: DISCORD_URL,
      },
    ],
    ql: {
      num: "02",
      label: "RECOMMENDED",
      title: "Open profile on qlstats.net",
      text: "It's recommended to have an open profile on qlstats.net — it makes determining your division much easier. This may soon become mandatory.",
      btn: "Open qlstats.net",
    },
    cta: {
      num: "03",
      label: "QUESTIONS",
      t1: "Got",
      t2: "questions?",
      text: "Everything about registration, taking part in tournaments and any other questions can be sorted out on our Discord server.",
      btn: "Go to Discord",
    },
    footer: "ARENA 1 · NON-PRO DUEL CUPS · 2026",
  },
};

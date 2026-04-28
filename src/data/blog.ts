export interface BlogPost {
  slug: string;
  date: string;
  titleRu: string;
  titleEn: string;
  previewRu: string;
  previewEn: string;
  tag: string;
  contentRu: string;
  contentEn: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "honest-look-quake",
    date: "Март 2026",
    titleRu: "Честный взгляд на Quake-сообщество",
    titleEn: "An Honest Look at the Quake Community",
    previewRu: "Что мешает сцене расти — без дипломатии и без прикрас.",
    previewEn: "What's holding the scene back — no diplomacy, no sugarcoating.",
    tag: "Community",
    contentRu: `Мы в Arena1 делаем турниры для Quake-комьюнити. Не со стороны — изнутри. Мы сами играем, смотрим, болеем и злимся на лагающий сервер. И именно поэтому можем говорить честно.

Этот текст — не комплимент и не критика. Это попытка посмотреть на себя трезво. Потому что если мы хотим, чтобы у Quake было будущее — нам нужно перестать притворяться, что всё в порядке.

## Что делает квейкеров особенными

Quake — один из немногих шутеров, где нет костылей. Нет тиммейтов, которые вытащат. Нет мета-пика персонажа. Нет лутбокса удачи. Дуэль — это ты против другого человека, и всё. Это формирует определённый тип людей.

Глубина скилла здесь реальная. Контроль карты, тайминг предметов, движение — это годы осознанной практики. Среди нас непропорционально много людей с аналитическим складом ума — тех, кому нравится разбирать системы на части и находить в них закономерности.

И сообщество — маленькое, но живучее. Люди, которые остались в Quake в 2026 году — это не казуалы, которых привлёк хайп. Это упёртые энтузиасты. И в этом есть что-то настоящее, что заслуживает уважения.

## Но есть вещи, о которых мы не любим говорить

**Токсичность и элитизм — не миф.** «Ты просто нуб» — стандартный ответ на любую критику. Порог входа жёсткий, и значительная часть комьюнити не особо заинтересована его снижать. Гордость за хардкор — это здорово. Но когда она превращается в снобизм — это уже проблема.

**Ностальгия как ловушка.** Часть сообщества живёт в парадигме «раньше было лучше» — QuakeWorld, CPM, ранний Q3. Любовь к корням понятна. Но когда она мешает принимать новое и отпугивает свежую кровь — она работает против нас.

**Узость кругозора.** Некоторые из нас искренне считают, что если шутер не требует strafe-jump — это не настоящий шутер. Такая позиция ограничивает диалог с более широким гейминг-сообществом и изолирует нас ещё сильнее.

**Мы стареем.** Средний возраст растёт, приток новичков минимальный. Это не чья-то вина — это реальность.

## Что мы можем изменить

Quake не нужно спасать. Quake нужно показать. Разница огромная.

Мы перестали продавать Quake через сложность — «у нас самая хардкорная игра». Это не маркетинг, это фильтр. Вместо этого нужно продавать ощущение: скорость, контроль, честность поединка. Новичку не нужно знать про CPM-физику. Ему нужно почувствовать, что это круто.

Нам нужен контент для зрителей, а не только для игроков. Quake-дуэль для неподготовленного зрителя — хаос. А на самом деле это шахматная партия на скорости 800 юнитов в секунду. Если мы научимся это показывать — у нас появятся зрители. А зрители — это спонсоры, турниры и будущее.

И нам нужно нормализовать средний уровень. Дать пространство тем, кто играет в кайф три вечера в неделю и не собирается на QuakeCon. Это 80% любого здорового сообщества.

## Что делает Arena1

Мы строим турнирную платформу, которая решает именно эти задачи. Трансляции, которые понятны не только игрокам. Форматы, которые создают напряжение и нарратив. Пространство, где средний уровень — это нормально, а не повод для насмешки.

Мы не обещаем вернуть 2003 год. Мы работаем над тем, чтобы 2026-й и дальше были не хуже.

**Quake жив не потому, что кто-то его поддерживает. Он жив потому, что мы здесь. Вопрос в том — мы хотим быть закрытым клубом на 500 человек или сообществом, которое растёт?**`,

    contentEn: `We at Arena1 run tournaments for the Quake community. Not from the outside — from within. We play, we watch, we cheer, and we rage at laggy servers. That's exactly why we can be honest.

This isn't flattery. It's not criticism either. It's an attempt to look at ourselves clearly. Because if we want Quake to have a future, we need to stop pretending everything is fine.

## What Makes Quake Players Different

Quake is one of the few shooters with no crutches. No teammates to carry you. No meta character picks. No lootbox luck. A duel is you against another person, and that's it. This shapes a particular kind of player.

The skill depth is real. Map control, item timing, movement — these take years of deliberate practice. There's a disproportionate number of analytical minds among us — people who enjoy taking systems apart and finding patterns.

And the community, while small, is resilient. The people still playing Quake in 2026 aren't casuals chasing hype. They're stubborn enthusiasts. There's something genuine in that, and it deserves respect.

## But There Are Things We Don't Like Talking About

**Toxicity and elitism aren't myths.** "You're just a noob" is the standard response to any criticism. The barrier to entry is harsh, and a significant part of the community isn't particularly interested in lowering it. Pride in being hardcore is fine. But when it turns into snobbery, it becomes a problem.

**Nostalgia as a trap.** Part of the community lives in a "things were better before" mindset — QuakeWorld, CPM, early Q3. Love for our roots is understandable. But when it prevents us from embracing anything new and scares off fresh blood, it's working against us.

**Tunnel vision within the genre.** Some of us genuinely believe that if a shooter doesn't require strafe-jumping, it's not a real shooter. This attitude limits our dialogue with the broader gaming community and isolates us further.

**We're aging.** The average player age keeps rising, new player influx is minimal. This isn't anyone's fault — it's reality.

## What We Can Change

Quake doesn't need saving. Quake needs showing. That's a huge difference.

We need to stop selling Quake through difficulty — "we have the most hardcore game." That's not marketing, it's a filter. Instead, sell the feeling: speed, control, the honesty of a fair fight. A newcomer doesn't need to know about CPM physics. They need to feel that this is something special.

We need content for viewers, not just players. A Quake duel looks like chaos to an unprepared spectator. But in reality, it's a chess match at 800 units per second. If we learn to show that — we'll gain viewers. And viewers mean sponsors, tournaments, and a future.

And we need to normalize being average. Make space for people who play three evenings a week and aren't aiming for QuakeCon. That's 80% of any healthy community.

## What Arena1 Is Doing About It

We're building a tournament platform that addresses exactly these challenges. Broadcasts that make sense to more than just players. Formats that create tension and narrative. A space where being mid-tier is normal, not a reason for ridicule.

We're not promising to bring back 2003. We're working to make sure 2026 and beyond are worth showing up for.

**Quake is alive not because someone supports it. It's alive because we're here. The only question is — do we want to be a closed club of 500 people, or a community that grows?**`
  }
];

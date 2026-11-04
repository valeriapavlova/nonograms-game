/* =========================================================
   PUZZLES — every one checked with a solver: single solution.
   # = filled, . = empty

   Format: PUZZLES[collection][level] = {
     original, name{en,ca,uk}, region{en,ca,uk}, text{en,ca,uk}, grid[]
   }

   ADDING A HARD (15×15) PUZZLE
   1. Add `hard: { ... }` to a collection below, grid = 15 rows × 15 chars.
   2. Run `npm run check` — it must say "one solution".
   The "hard" button unlocks by itself for that collection;
   collections without one keep showing "coming soon".
   ========================================================= */
export const PUZZLES = {
  ua: {
    easy: {
      original: "Вовчі зуби",
      name: { en: "Wolf's teeth", ca: "Dents de llop", uk: "Вовчі зуби" },
      region: { en: "Ukraine · pysanky & embroidery", ca: "Ucraïna · pisanques i brodat", uk: "Україна · писанки й вишивка" },
      text: {
        en: "Rows of sharp triangles used as a protective motif. The pattern was meant to guard the person wearing it, like a fence around the field.",
        ca: "Fileres de triangles aguts que feien de protecció. El motiu havia de guardar qui el portava, com una tanca al voltant del camp.",
        uk: "Ряди гострих трикутників — оберіг. Візерунок мав захищати того, хто його носить, як огорожа навколо поля."
      },
      grid: ["#.#.#", "#####", ".....", "#####", "#.#.#"]
    },
    medium: {
      original: "Засіяне поле",
      name: { en: "Sown field", ca: "Camp sembrat", uk: "Засіяне поле" },
      region: { en: "Ukraine · pysanky & embroidery", ca: "Ucraïna · pisanques i brodat", uk: "Україна · писанки й вишивка" },
      text: {
        en: "A rhombus with a seed in the centre. One of the oldest Ukrainian symbols: the ploughed and sown land, a wish for a good harvest and a full home.",
        ca: "Un rombe amb una llavor al centre. Un dels símbols ucraïnesos més antics: la terra llaurada i sembrada, el desig d'una bona collita i d'una casa plena.",
        uk: "Ромб із зерном у центрі. Один із найдавніших українських символів: зорана й засіяна земля, побажання доброго врожаю і повної хати."
      },
      grid: [
        "....##....",
        "...#..#...",
        "..#.##.#..",
        ".#.#..#.#.",
        "#.#.##.#.#",
        "#.#.##.#.#",
        ".#.#..#.#.",
        "..#.##.#..",
        "...#..#...",
        "....##...."
      ]
    }
  },
  va: {
    easy: {
      original: "Taronja",
      name: { en: "Orange", ca: "Taronja", uk: "Апельсин" },
      region: { en: "València · l'Horta", ca: "València · l'Horta", uk: "Валенсія · л'Орта" },
      text: {
        en: "Orange groves surround the city. In spring the blossom, tarongina, fills the streets with its scent.",
        ca: "Els camps de tarongers envolten la ciutat. A la primavera, la tarongina omple els carrers amb el seu perfum.",
        uk: "Апельсинові сади оточують місто. Навесні їхній цвіт наповнює вулиці ароматом."
      },
      grid: ["..#..", ".###.", "#####", "#####", ".###."]
    },
    medium: {
      original: "Rat penat",
      name: { en: "The bat", ca: "Rat penat", uk: "Кажан" },
      region: { en: "València · coat of arms", ca: "València · escut de la ciutat", uk: "Валенсія · герб міста" },
      text: {
        en: "A bat sits on top of the crown in the city's coat of arms. Legend links it to King Jaume I and the conquest of València in 1238.",
        ca: "Un rat penat corona l'escut de la ciutat. La llegenda el lliga al rei Jaume I i a la conquesta de València el 1238.",
        uk: "Кажан сидить на короні в гербі міста. Легенда пов'язує його з королем Жауме I і завоюванням Валенсії у 1238 році."
      },
      grid: [
        "...#..#...",
        "...####...",
        "#..#..#..#",
        "##.####.##",
        "##########",
        "##########",
        "###.##.###",
        "#...##...#",
        "....##....",
        "...#..#..."
      ]
    }
  }
};

export const COLLECTIONS = Object.keys(PUZZLES);

/* play order for "next puzzle": collection by collection, level by level */
export const ORDER = COLLECTIONS.flatMap((c) => Object.keys(PUZZLES[c]).map((l) => [c, l]));

export const getPuzzle = (collection, level) => PUZZLES[collection][level];
export const hasPuzzle = (collection, level) => Boolean(PUZZLES[collection] && PUZZLES[collection][level]);

/* grid size per level — scripts/check-puzzles.js checks every puzzle against it */
export const LEVELS = { easy: 5, medium: 10, hard: 15 };

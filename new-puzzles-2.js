/* =========================================================
   NEW PUZZLES for Punt, round 2 — all checked with a solver:
   every grid has exactly one solution.
   1 × easy (València) so both collections have 4 easy puzzles,
   and the first hard 15×15 puzzles: 2 for Ukraine, 2 for València.
   Same fields as src/puzzles.js. # = filled, . = empty
   ========================================================= */
export const NEW_PUZZLES_2 = {
  ua: {
    hard: [
      {
        original: "Дерево життя",
        name: { en: "Tree of life", ca: "Arbre de la vida", uk: "Дерево життя" },
        region: { en: "Ukraine · embroidered towels", ca: "Ucraïna · tovallons brodats", uk: "Україна · рушники" },
        text: {
          en: "A tree growing from a pot, with branches on both sides. It joins the roots, the living and the sky: a family line through time.",
          ca: "Un arbre que creix d'un test, amb branques a banda i banda. Uneix les arrels, els vius i el cel: la línia d'una família a través del temps.",
          uk: "Дерево, що росте з вазона, з гілками на обидва боки. Воно поєднує коріння, живих і небо: родовід крізь час."
        },
        grid: [
          ".......#.......",
          "......###......",
          ".....#####.....",
          "..##...#...##..",
          ".####..#..####.",
          "######.#.######",
          ".####..#..####.",
          "..##..###..##..",
          ".....#.#.#.....",
          "....##.#.##....",
          "...###.#.###...",
          "......###......",
          ".......#.......",
          "...#########...",
          "....#######...."
        ]
      },
      {
        original: "Пава",
        name: { en: "Peahen", ca: "Paona", uk: "Пава" },
        region: { en: "Ukraine · rushnyky", ca: "Ucraïna · rushnyky", uk: "Україна · рушники" },
        text: {
          en: "A bird of paradise from old embroidered and woven towels. The pava stands for beauty, a happy home and a bride's good fortune.",
          ca: "Un ocell del paradís dels antics tovallons brodats i teixits. La paona simbolitza la bellesa, una llar feliç i la bona sort de la núvia.",
          uk: "Райський птах зі старих вишитих і тканих рушників. Пава означає красу, щасливий дім і добру долю нареченої."
        },
        grid: [
          "....#.#........",
          ".....#.........",
          "....###........",
          "...##.##.......",
          "....###....#.#.",
          "....##....#.#.#",
          "....###..######",
          "...######.####.",
          "..##########.#.",
          ".############..",
          "..##########...",
          "...#######.....",
          ".....#..#......",
          ".....#..#......",
          "....##..##....."
        ]
      }
    ]
  },
  va: {
    easy: [
      {
        original: "Tarongina",
        name: { en: "Orange blossom", ca: "Tarongina", uk: "Цвіт апельсина" },
        region: { en: "València · l'Horta", ca: "València · l'Horta", uk: "Валенсія · л'Орта" },
        text: {
          en: "The small white flower of the orange tree. It is a traditional bridal flower and gives its scent to orange-blossom water.",
          ca: "La xicoteta flor blanca del taronger. És una flor tradicional de les núvies i dona el seu perfum a l'aigua de tarongina.",
          uk: "Маленька біла квітка апельсинового дерева. Це традиційна квітка нареченої, з неї роблять ароматну квіткову воду."
        },
        grid: [".#.#.", "##.##", "..#..", "##.##", ".#.#."]
      }
    ],
    hard: [
      {
        original: "Barraca",
        name: { en: "Barraca", ca: "Barraca", uk: "Барака" },
        region: { en: "València · l'Albufera", ca: "València · l'Albufera", uk: "Валенсія · Альбуфера" },
        text: {
          en: "A whitewashed farmhouse with a steep thatched roof and a small cross on top. Farmers built them in l'Horta and around l'Albufera.",
          ca: "Una casa de llauradors emblanquinada, amb sostre de palla molt inclinat i una creueta dalt. Es construïen a l'Horta i al voltant de l'Albufera.",
          uk: "Побілена селянська хата з крутим солом'яним дахом і хрестиком нагорі. Їх будували в л'Орті й навколо Альбуфери."
        },
        grid: [
          ".......#.......",
          "......###......",
          ".......#.......",
          "......###......",
          ".....#####.....",
          "....#######....",
          "...#########...",
          "..###########..",
          ".#############.",
          "###############",
          ".#...........#.",
          ".#.##...###..#.",
          ".#.##...#.#..#.",
          ".#.##...###..#.",
          "###############"
        ]
      },
      {
        original: "Torres de Serrans",
        name: { en: "Serranos Towers", ca: "Torres de Serrans", uk: "Вежі Серранос" },
        region: { en: "València · old city walls", ca: "València · antiga muralla", uk: "Валенсія · стара міська стіна" },
        text: {
          en: "A 14th-century gate in the old city walls. Every year the Falles start here with the Crida, the call to the festival.",
          ca: "Una porta del segle XIV de l'antiga muralla. Cada any les Falles comencen ací amb la Crida.",
          uk: "Брама XIV століття в старій міській стіні. Щороку тут починаються Фальяс — з Кріди, заклику до свята."
        },
        grid: [
          "#.#.#.....#.#.#",
          "#####.....#####",
          "#####.#.#.#####",
          "###############",
          "##.#########.##",
          "##.#########.##",
          "#####.....#####",
          "#####.#.#.#####",
          "###############",
          "######...######",
          "#####.....#####",
          "####.......####",
          "####.......####",
          "####.......####",
          "####.......####"
        ]
      }
    ]
  }
};

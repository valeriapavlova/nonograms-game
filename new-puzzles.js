/* =========================================================
   NEW PUZZLES for Punt — 9 puzzles, all checked with a solver:
   every grid has exactly one solution.
   Same fields as src/puzzles.js. Grouped by collection and level;
   each level becomes a LIST of puzzles (existing ones go first).
   # = filled, . = empty
   ========================================================= */
export const NEW_PUZZLES = {
  ua: {
    easy: [
      {
        original: "Грабельки",
        name: { en: "Rakes", ca: "Rasclets", uk: "Грабельки" },
        region: { en: "Ukraine · embroidery", ca: "Ucraïna · brodat", uk: "Україна · вишивка" },
        text: {
          en: "Teeth hanging from a line, like a rake over the soil. The motif is linked to work in the field and to the rain that waters it.",
          ca: "Dents que pengen d'una línia, com un rasclet sobre la terra. El motiu es relaciona amb el treball del camp i amb la pluja que el rega.",
          uk: "Зубці, що звисають з лінії, як граблі над землею. Мотив пов'язують з працею в полі й дощем, що його поливає."
        },
        grid: ["#####", "#.#.#", "#.#.#", "#.#.#", "....."]
      },
      {
        original: "Баранячі ріжки",
        name: { en: "Ram's horns", ca: "Banyes de moltó", uk: "Баранячі ріжки" },
        region: { en: "Ukraine · pysanky & embroidery", ca: "Ucraïna · pisanques i brodat", uk: "Україна · писанки й вишивка" },
        text: {
          en: "Two curled horns. The ram led the flock, so the motif stands for strength, leadership and a prosperous home.",
          ca: "Dues banyes enrotllades. El moltó guiava el ramat, i per això el motiu simbolitza força, guia i una casa pròspera.",
          uk: "Два закручені роги. Баран вів отару, тож мотив означає силу, провід і достаток у домі."
        },
        grid: ["##.##", "#...#", "#.#.#", "..#..", "..#.."]
      },
      {
        original: "Вісімка",
        name: { en: "Eight-pointed star", ca: "Estrela de vuit puntes", uk: "Вісімка" },
        region: { en: "Ukraine · pysanky & embroidery", ca: "Ucraïna · pisanques i brodat", uk: "Україна · писанки й вишивка" },
        text: {
          en: "One of the most common motifs in Ukrainian embroidery and pysanky: a star of light, a sign of the sun and of order in the world.",
          ca: "Un dels motius més habituals del brodat i les pisanques ucraïneses: una estrela de llum, signe del sol i de l'ordre del món.",
          uk: "Один із найпоширеніших мотивів української вишивки й писанок: зірка світла, знак сонця й порядку у світі."
        },
        grid: ["#.#.#", ".###.", "##.##", ".###.", "#.#.#"]
      }
    ],
    medium: [
      {
        original: "Сосонка",
        name: { en: "Little pine", ca: "Pinet", uk: "Сосонка" },
        region: { en: "Ukraine · embroidery", ca: "Ucraïna · brodat", uk: "Україна · вишивка" },
        text: {
          en: "A stylised pine tree. It stays green all winter, so it stands for life that lasts. You often find it on embroidered towels, rushnyky.",
          ca: "Un pi estilitzat. Es manté verd tot l'hivern, i per això simbolitza la vida que perdura. Apareix sovint als tovallons brodats, els rushnyky.",
          uk: "Стилізована сосна. Вона зелена всю зиму, тож означає життя, що триває. Її часто вишивають на рушниках."
        },
        grid: [
          "....##....",
          "...####...",
          "....##....",
          "..######..",
          "....##....",
          ".########.",
          "....##....",
          "##########",
          "....##....",
          "...####..."
        ]
      },
      {
        original: "Ружа",
        name: { en: "Rose", ca: "Rosa", uk: "Ружа" },
        region: { en: "Ukraine · embroidered towels", ca: "Ucraïna · tovallons brodats", uk: "Україна · рушники" },
        text: {
          en: "A rose built on an eight-pointed star. A wish for love and beauty, often stitched on wedding towels.",
          ca: "Una rosa construïda sobre una estrela de vuit puntes. Un desig d'amor i bellesa, brodat sovint als tovallons de noces.",
          uk: "Ружа, побудована на восьмикутній зірці. Побажання любові й краси, яке часто вишивали на весільних рушниках."
        },
        grid: [
          "....##....",
          "...####...",
          "#..####..#",
          "##.####.##",
          "##########",
          "##########",
          "##.####.##",
          "#..####..#",
          "...####...",
          "....##...."
        ]
      }
    ]
  },
  va: {
    easy: [
      {
        original: "Ventall",
        name: { en: "Fan", ca: "Ventall", uk: "Віяло" },
        region: { en: "València · Aldaia", ca: "València · Aldaia", uk: "Валенсія · Альдая" },
        text: {
          en: "A summer essential and part of the fallera costume. The town of Aldaia, next to València, has made fans by hand for centuries.",
          ca: "Imprescindible a l'estiu i part del vestit de fallera. Aldaia, al costat de València, fa ventalls a mà des de fa segles.",
          uk: "Необхідне влітку й частина костюма фальєри. Містечко Альдая поруч із Валенсією століттями робить віяла вручну."
        },
        grid: ["#.#.#", "#.#.#", ".###.", "..#..", "..#.."]
      },
      {
        original: "Rajola",
        name: { en: "Tile", ca: "Rajola", uk: "Плитка" },
        region: { en: "València · Manises ceramics", ca: "València · ceràmica de Manises", uk: "Валенсія · кераміка Манісеса" },
        text: {
          en: "Ceramic tiles cover Valencian kitchens, façades and churches. Manises, near the city, has made ceramics since the Middle Ages.",
          ca: "Les rajoles de ceràmica cobreixen cuines, façanes i esglésies valencianes. Manises, prop de la ciutat, fa ceràmica des de l'edat mitjana.",
          uk: "Керамічна плитка вкриває валенсійські кухні, фасади й церкви. Манісес поруч із містом робить кераміку ще з середньовіччя."
        },
        grid: ["##.##", "#...#", "..#..", "#...#", "##.##"]
      }
    ],
    medium: [
      {
        original: "Micalet",
        name: { en: "Micalet tower", ca: "Micalet", uk: "Мікалет" },
        region: { en: "València · cathedral", ca: "València · catedral", uk: "Валенсія · собор" },
        text: {
          en: "The bell tower of València Cathedral. 207 steps lead to the top, with a view over the whole city.",
          ca: "El campanar de la catedral de València. 207 escalons porten fins dalt, amb vistes a tota la ciutat.",
          uk: "Дзвіниця кафедрального собору Валенсії. 207 сходинок ведуть нагору, звідки видно все місто."
        },
        grid: [
          "....##....",
          "...####...",
          "...#..#...",
          "...####...",
          "...#..#...",
          "...####...",
          "...#..#...",
          "...####...",
          "..######..",
          ".########."
        ]
      },
      {
        original: "Paella",
        name: { en: "Paella", ca: "Paella", uk: "Паелья" },
        region: { en: "València · l'Albufera", ca: "València · l'Albufera", uk: "Валенсія · Альбуфера" },
        text: {
          en: "Born in the rice fields around l'Albufera. In Valencian, paella is the name of the pan itself.",
          ca: "Va nàixer als arrossars de l'Albufera. En valencià, paella és el nom de la mateixa paella on es cuina.",
          uk: "Народилася на рисових полях навколо Альбуфери. Валенсійською «паелья» — це назва самої сковороди."
        },
        grid: [
          "...####...",
          ".########.",
          "##.####.##",
          "##########",
          "#.##..##.#",
          "##########",
          "##.####.##",
          ".########.",
          "...####...",
          "....##...."
        ]
      }
    ]
  }
};

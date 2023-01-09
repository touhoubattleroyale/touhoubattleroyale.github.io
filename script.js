const files = [
  "Alice",
  "Aunn",
  "Aya",
  "Benben",
  "Byakuren",
  "Chen",
  "Cirno",
  "Clownpiece",
  "Daiyousei",
  "Doremy",
  "Eirin",
  "Eternity Larva",
  "Flandre",
  "Futo",
  "Hatate",
  "Hecatia",
  "Hina",
  "Ichirin",
  "Joon",
  "Junko",
  "Kagerou",
  "Kaguya",
  "Kanako",
  "Kasen",
  "Keine",
  "Koakuma",
  "Kogasa",
  "Koishi",
  "Kokoro",
  "Kutaka",
  "Letty Whiterock",
  "Lunasa",
  "Mamizou",
  "Marisa",
  "Meiling",
  "Miko",
  "Minoriko",
  "Mokou",
  "Momiji",
  "Mystia",
  "Nazrin",
  "Nitori",
  "Nue",
  "Parsee",
  "Patchouli",
  "Raiko",
  "Ran",
  "Reimu",
  "Reisen",
  "Remilia",
  "Ringo",
  "Rin",
  "Rumia",
  "Sagume",
  "Sakuya",
  "Sanae",
  "Satori",
  "Seiga",
  "Seija",
  "Seiran",
  "Sekibanki",
  "Shion",
  "Shou",
  "Suika",
  "Sukuna",
  "Sumireko",
  "Suwako",
  "Tenshi",
  "Tewi",
  "Utsuho",
  "Wakasagihime",
  "Wriggle",
  "Yamame",
  "Yatadera",
  "Yatsuhashi",
  "Yoshika",
  "Youmu",
  "Yukari",
  "Yuugi",
  "Yuyuko",
];

let alive = files.length;
const secondsPerGame = 1800; // half an hour

var customFloor = function (value, roundTo) {
  return Math.floor(value / roundTo) * roundTo;
};

function getLastHalfHourMark() {
  return customFloor(Date.now(), secondsPerGame * 1000);
}

function getNextHalfHourMark() {
  return getLastHalfHourMark() + secondsPerGame * 1000;
}

function createCurrentRNG() {
  const seed = cyrb128(`${getLastHalfHourMark()}`);
  return sfc32(seed[0], seed[1], seed[2], seed[3]);
}

let currentRng = createCurrentRNG();

function generateGame() {
  // generate a death order using currentRng
  const players = [...files];
  shuffleArray(players, true);
  // X kills Y, and the timestamp where it happens. Nothing happens in the first 30 seconds, and same for the last 30 sec /
  // generate a series of timestamps for the deaths, then sort that array
  // ie. generate n - 1 random numbers between
  const deathTimes = [];
  const thirtysecondsinMs = 30 * 1000;
  for (let i = 0; i < players.length - 1; i++) {
    const int = getSeededRandomInt(
      getLastHalfHourMark() + thirtysecondsinMs,
      getNextHalfHourMark() - thirtysecondsinMs
    );
    deathTimes.push(int);
  }
  deathTimes.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < players.length - 1; i++) {
    const victim = players[i];
    const killer = getSeededRandomInt(i + 1, players.length);
    result.push({ killer: players[killer], victim, time: deathTimes[i] });
  }
  return result;
}

function shuffleArray(array, usePrng = false) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor((usePrng ? currentRng() : Math.random()) * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function initImages() {
  const shuffledFiles = [...files];
  shuffleArray(shuffledFiles);
  const middleIndex = Math.ceil(shuffledFiles.length / 2);

  const files1 = shuffledFiles.splice(0, middleIndex);
  const files2 = shuffledFiles.splice(-middleIndex);

  for (const file of files1) {
    for (let i = 1; i < 3; i++) {
      const img = document.createElement("img");
      img.src = `./img/${file}.png`;
      img.id = `${file}${i}`
      document.getElementById(`marquee${i}`).appendChild(img);
    }
  }
  for (const file of files2) {
    for (let i = 3; i < 5; i++) {
      const img = document.createElement("img");
      img.src = `./img/${file}.png`;
      img.id = `${file}${i}`
      document.getElementById(`marquee${i}`).appendChild(img);
    }
  }
}

function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      timer = 0;
    }
  }, 1000);
}

function secondsToNextGame() {
  return secondsPerGame - (Math.round(Date.now() / 1000) % secondsPerGame);
}

function updateAliveCount() {
  document.getElementById("alive").innerText = alive;
}

function setupEvents(gameEvents) {
  for (const event of gameEvents) {
    const { killer, victim, time } = event;
    const timeout = time - Date.now();
    setTimeout(() => {
      const container = document.getElementById("killfeed")
      const p  = document.createElement("p");
      p.innerText = `${killer} kills ${victim}`;
      container.insertBefore(p, container.firstChild)
      alive--;
      for (let i = 1; i < 5; i++) {
        console.log(`${victim}${i}`)
        try {
        const img = document.getElementById(`${victim}${i}`)
        img.style = `filter: grayscale(100%);`;}
        catch {}
      }
      updateAliveCount();
    }, timeout);
  }
}

window.onload = function () {
  var timeToNextGame = secondsToNextGame();
  startTimer(timeToNextGame, document.querySelector("#time"));
  updateAliveCount();
  initImages();
  const gameEvents = generateGame();
  setupEvents(gameEvents);

  // TODO: then set up the triggers to play the game
  // TODO: then set up the triggers to play the next game (which in turn will set up the triggers to play the next next game)
};

///////// rng stuff //////////////

function cyrb128(str) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
}

function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function getSeededRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(currentRng() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

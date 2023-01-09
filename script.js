const files = [
  "Alice.png",
  "Aunn.png",
  "Aya.png",
  "Benben.png",
  "Byakuren.png",
  "Chen.png",
  "Cirno.png",
  "Clownpiece.png",
  "Daiyousei.png",
  "Doremy.png",
  "Eirin.png",
  "Eternity Larva.png",
  "Flandre.png",
  "Futo.png",
  "Hatate.png",
  "Hecatia.png",
  "Hina.png",
  "Ichirin.png",
  "Joon.png",
  "Junko.png",
  "Kagerou.png",
  "Kaguya.png",
  "Kanako.png",
  "Kasen.png",
  "Keine.png",
  "Koakuma.png",
  "Kogasa.png",
  "Koishi.png",
  "Kokoro.png",
  "Kutaka.png",
  "Letty Whiterock.png",
  "Lunasa.png",
  "Mamizou.png",
  "Marisa.png",
  "Meiling.png",
  "Miko.png",
  "Minoriko.png",
  "Mokou.png",
  "Momiji.png",
  "Mystia.png",
  "Nazrin.png",
  "Nitori.png",
  "Nue.png",
  "Parsee.png",
  "Patchouli.png",
  "Raiko.png",
  "Ran.png",
  "Reimu.png",
  "Reisen.png",
  "Remilia.png",
  "Ringo.png",
  "Rin.png",
  "Rumia.png",
  "Sagume.png",
  "Sakuya.png",
  "Sanae.png",
  "Satori.png",
  "Seiga.png",
  "Seija.png",
  "Seiran.png",
  "Sekibanki.png",
  "Shion.png",
  "Shou.png",
  "Suika.png",
  "Sukuna.png",
  "Sumireko.png",
  "Suwako.png",
  "Tenshi.png",
  "Tewi.png",
  "Utsuho.png",
  "Wakasagihime.png",
  "Wriggle.png",
  "Yamame.png",
  "Yatadera.png",
  "Yatsuhashi.png",
  "Yoshika.png",
  "Youmu.png",
  "Yukari.png",
  "Yuugi.png",
  "Yuyuko.png",
];

const secondsPerGame = 1800; // half an hour

var customFloor = function (value, roundTo) {
  return Math.floor(value / roundTo) * roundTo;
};

function getLastHalfHourMark() {
  return customFloor(Date.now(), secondsPerGame * 1000);
}

function createCurrentRNG() {
  const seed = cyrb128(`${getLastHalfHourMark()}`);
  return sfc32(seed[0], seed[1], seed[2], seed[3]);
}

let currentRng = createCurrentRNG();

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
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
      img.src = `./img/${file}`;
      document.getElementById(`marquee${i}`).appendChild(img);
    }
  }
  for (const file of files2) {
    for (let i = 3; i < 5; i++) {
      const img = document.createElement("img");
      img.src = `./img/${file}`;
      //   img.style = `filter: grayscale(100%);`; TODO: for dead ppl, also give everyone an id
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
      timer = duration;
    }
  }, 1000);
}

function secondsToNextGame() {
  return secondsPerGame - (Math.round(Date.now() / 1000) % secondsPerGame);
}

window.onload = function () {
  var timeToNextGame = secondsToNextGame();
  startTimer(timeToNextGame, document.querySelector("#time"));
  initImages();
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

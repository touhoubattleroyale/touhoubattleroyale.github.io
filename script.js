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
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function setupGame() {
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

window.onload = function () {
  // TODO: set the timer to something else other than 30 minutes when syncing is a thing
  var thirtyMinutes = 60 * 30;
  startTimer(thirtyMinutes, document.querySelector("#time"));
  setupGame();
};

// intial load

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

const files2 = [...files];
shuffleArray(files);
shuffleArray(files2);

for (const file of files) {
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

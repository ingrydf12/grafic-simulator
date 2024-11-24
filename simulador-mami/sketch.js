/*
  Overview
  MRUV: vel. muda de acordo com a aceleração
  MRU: a velocidade não muda
*/
const INTERVALO = 0.016667;
let tAtual = 0, contador = 0;
let aAtual1 = -10, aAtual2 = -5; //exemplos aí
let vxAtual, vyAtual;
let yAtual;
let s1, s2;
let altMax1, altMax2;
let gradeDesativada = false;

let checkRastro, checkTime, checkGrade;

function setup() {
  createCanvas(500, 500);
  background(80);

  //Instância dos objetos de uma classe nativa
  checkRastro = createCheckbox();
  checkRastro.position(20, 385);

  checkTime = createCheckbox();
  checkTime.position(20, 410);

  checkGrade = createCheckbox();
  checkGrade.position(20, 435);

  s1 = createSlider(-20, 20, aAtual1).position(10, 10).size(80);
  s2 = createSlider(-20, 20, aAtual2).position(10, 50).size(80);

  //1: Input de velocidades
  vxAtual = int(prompt("Insira a velocidade horizontal"));
  vyAtual = int(prompt("Insira a velocidade vertical"));
}

function draw() {
  x1 = MRU(vxAtual, tAtual);
  y1 = MRUV(vyAtual, aAtual1, tAtual);

  x2 = MRU(vxAtual, tAtual);
  y2 = MRUV(vyAtual, aAtual2, tAtual);
  checkController();

  //Controlar a aceleração dos dois objetos
  aAtual1 = s1.value();
  aAtual2 = s2.value();

  b1 = new pCircle(x1, 200 - y1, 20);
  b2 = new pCircle(x2, 200 - y2, 20);
  fill(252, 148, 3);
  b1.desenha();
  fill(186, 97, 255);
  b2.desenha();

  //Altura máxima
  vyMax1 = vyAtual + aAtual1 * tAtual;
  vyMax2 = vyAtual + aAtual2 * tAtual;
  if (vyMax1 == 0 || vyMax2 == 0) {
    altMax1 = y1;
    altMax2 = y2;
  }

  line(0, 200 - altMax1, width, 200 - altMax1);
  line(0, 200 - altMax2, width, 200 - altMax2);

  //Alcance máximo -> O mesmo para ambos
  if (x1 > height || x1 > width) {
    fill(252, 148, 3);
    text("Alcance máx 1: " + x1.toFixed(2), 340, 460);
    noLoop(); //Melhorar
  }
  if (x2 > height || x2 > width) {
    fill(186, 97, 255);
    text("Alcance máx 2: " + x2.toFixed(2), 340, 480);
    noLoop(); //Melhorar
  }

  returnText();
}

function returnText() {
  textSize(14);
  fill(255);
  text("Rastro", 50, 400);
  text("Tempo", 50, 425);
  text("Grade", 50, 450);
  //Slider
  text("Aceleração", 10, 40);
  fill(255);
  text(aAtual1, 100, 40);
  text(aAtual2, 100, 70);

  //3: Cronômetro
  fill(255);
  text(tAtual.toFixed(2), 460, 20);

  //MARK: - X1
  //3: Vel. horizontal
  fill(252, 148, 3);
  text(x1.toFixed(2), x1, height / 2);
  //3: Vel. vertical
  text("Vel. vertical: " + vyMax1.toFixed(2), x1 + 20, 240 - y1);
  //4: Posição altura acompanhar
  text(y1.toFixed(2), x1 + 20, 200 - y1);

  //MARK: - X2
  fill(186, 97, 255);
  //Vel. vertical
  text("Vel. vertical: " + vyMax2.toFixed(2), x2 + 20, 240 - y2);
  //4: Posição altura acompanhar
  text(y2.toFixed(2), x2 + 20, 200 - y2);
}

function MRUV(v, a, t) {
  //O MRUV é vinculado a lançamento vertical
  let d = v * t + (a * t ** 2) / 2.0;
  return d;
}

function MRU(v, t) {
  //O MRUV é vinculado ao movimento horizontal
  let d = v * t;
  return d;
}

function checkController() {
  //Se o rastro não estiver ligado, ele limpa a tela e verifica a grade para desenhar
  if (!checkRastro.checked()) {
    background(80);
    if (checkGrade.checked()) {
      grade(10, 10, 50);
    }
    gradeDesativada = false;
    //Se o rastro estiver ligado e a grade também, ele vai desenhar ambos (sem background)
  } else {
    if (checkGrade.checked()) {
      grade(10, 10, 50);
      gradeDesativada = false;
      //E se a grade estiver desativada mas o rastro não, ele vai limpar a tela uma vez e alterar o booleano -> Desenha o rastro
    } else if (!gradeDesativada) {
      background(80);
      gradeDesativada = true;
    }
  }

  //Controla a contagem do tempo -> Se estiver desmarcado, o controle do tempo é feito por um cálculo que funciona semelhante ao comportamento do frameRate(1)
  if (checkTime.checked()) {
    tAtual += INTERVALO;
  } else {
    contador++;
    if (contador >= 60) {
      tAtual += 1;
      contador = 0;
    }
  }
}

function grade(nColunas, nLinhas, intervalo) {
  let largura = nColunas * intervalo;
  let altura = nLinhas * intervalo;

  for (let i = 0; i <= nColunas; i++) {
    line(i * intervalo, 0, i * intervalo, altura);
  }

  for (let j = 0; j <= nLinhas; j++) {
    line(0, j * intervalo, largura, j * intervalo);
  }
}

class pCircle {
  constructor(x, y, tam) {
    this.x = x;
    this.y = y;
    this.tam = tam;
  }

  desenha() {
    circle(this.x, this.y, this.tam);
  }
}

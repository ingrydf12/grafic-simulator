/*
  Overview
  MRUV: vel. muda de acordo com a aceleração
  MRU: a velocidade não muda
*/
const INTERVALO = 0.016667;
let tAtual = 0;
let aAtual = -10;
let pAtual = 0;
let vAtual = 50;
let dAtual;
let contador = 0;
let slider;

let checkRastro, checkTime, checkGrade;

function setup() {
  createCanvas(500, 500);
  background(110);

  //Instância dos objetos de uma classe nativa
  checkRastro = createCheckbox();
  checkRastro.position(20, 385);

  checkTime = createCheckbox();
  checkTime.position(20, 410);

  checkGrade = createCheckbox();
  checkGrade.position(20, 435);

  slider = createSlider(-20, 20, aAtual);
  slider.position(10, 10);
  slider.size(80);

  fill(255);
  textSize(14);
  text("Rastro", 50, 400);
  text("Tempo", 50, 425);
  text("Grade", 50, 450);
}

function draw() {
  pAtual = MRU(vAtual, tAtual);
  dAtual = MRUV(vAtual, aAtual, tAtual);
  checkController();

  //O slider controla o valor da aceleração (input)
  aAtual = slider.value();

  b1 = new pCircle(pAtual, 200 - dAtual, 20);
  b1.verifica();
  b1.desenha();

  //Pra garantir que os checkboxes e textos não sumam
  fill(255);
  textSize(14);
  text("Rastro", 50, 400);
  text("Tempo", 50, 425);
  text("Grade", 50, 450);
  text("Aceleração", 10, 40);
  fill(200, 50, 100);
  text(aAtual, 90, 40);
}

//O MRUV é vinculado a lançamento vertical
function MRUV(v, a, t) {
  let d = v * t + (a * t ** 2) / 2.0;
  return d;
}

//O MRUV é vinculado ao movimento horizontal
function MRU(v, t) {
  let d = v * t;
  return d;
}

function checkController() {
  if (checkRastro.checked()) {
    //console.log("com rastro");
  } else {
    background(110);
  }

  //Controla a contagem do tempo -> Se estiver desmarcado, o controle do tempo é feito por um cálculo que funciona semelhante ao comportamento do frameRate(1)
  if (checkTime.checked()) {
    tAtual += INTERVALO;
  } else {
    contador++;
    if (contador >= 60) {
      tAtual += 1 / 2;
      contador = 0;
    }
  }

  //Controla a grade chamando a função dela correspondente (linhas, colunas, intervalo)
  if (checkGrade.checked()) {
    grade(10, 10, 50);
  } else {
    background(110);
  }
}

function colunas(nColunas, altura, intervalo) {
  //aqui o intervalo é o espaçamento entre cada linha vertical e altura é o tamanho total da linha
  for (let i = 0; i < nColunas; i++) {
    line(i * intervalo, 0, i * intervalo, altura);
  }
}

function linhas(nLinhas, largura, intervalo) {
  //e aqui, o intervalo é o espaçamento entre cada linha horizontal e largura é o tamanho total da linha
  for (let j = 0; j < nLinhas; j++) {
    line(0, j * intervalo, largura, j * intervalo);
  }
}

function grade(nColunas, nLinhas, intervalo) {
  let largura = nColunas * intervalo;
  let altura = nLinhas * intervalo;
  //O +1 inclui a última linha, já que sem isso não é possível ver na grade
  colunas(nColunas + 1, altura, intervalo);
  linhas(nLinhas + 1, largura, intervalo);
}

function reload() {
  tAtual = 0;
  pAtual = 0;
  vAtual = 50;
  dAtual = 0;
  contador = 0;
}

//Usando POO para modelar o círculo na tela, com as funções de desenho e verificação para reiniciar
class pCircle {
  constructor(x, y, tam) {
    this.x = x;
    this.y = y;
    this.tam = tam;
  }

  desenha() {
    circle(this.x, this.y, this.tam);
  }

  verifica() {
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      reload();
    }
  }
}

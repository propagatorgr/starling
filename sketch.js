let waterParticles = [];
let proteinParticles = [];

let pressureSlider;
let glycocalyxCheckbox;

const CAP_X = 80;
const CAP_Y = 150;
const CAP_W = 520;
const CAP_H = 100;

function setup() {
  const c = createCanvas(720, 400);
  c.parent("sketch-holder");

  pressureSlider = createSlider(0.2, 2, 1, 0.01);
  pressureSlider.position(20, 20);
  pressureSlider.style("width", "200px");

  glycocalyxCheckbox = createCheckbox("Glycocalyx ενεργό", true);
  glycocalyxCheckbox.position(20, 50);

  for (let i = 0; i < 120; i++) {
    waterParticles.push(new WaterParticle());
  }

  for (let i = 0; i < 20; i++) {
    proteinParticles.push(new ProteinParticle());
  }
}

function draw() {
  background(245);

  drawLabels();
  drawCapillary();
  drawGlycocalyx();
  drawInterstitial();

  for (let w of waterParticles) {
    w.update();
    w.draw();
  }

  for (let p of proteinParticles) {
    p.update();
    p.draw();
  }
}

function drawLabels() {
  fill(0);
  textSize(14);
  text("Υδροστατική πίεση", 20, 15);
}

function drawCapillary() {
  fill(180, 220, 255);
  rect(CAP_X, CAP_Y, CAP_W, CAP_H);
  fill(0);
  text("Τριχοειδές", CAP_X + 10, CAP_Y - 5);
}

function drawGlycocalyx() {
  if (glycocalyxCheckbox.checked()) {
    fill(160, 220, 160);
    rect(CAP_X + CAP_W - 15, CAP_Y - 5, 15, CAP_H + 10);
    fill(0);
    textSize(11);
    text("Glycocalyx", CAP_X + CAP_W - 65, CAP_Y - 10);
  }
}

function drawInterstitial() {
  fill(230);
  rect(CAP_X + CAP_W + 20, CAP_Y - 10, 100, CAP_H + 20);
  fill(0);
  textSize(12);
  text("Διάμεσος\nχώρος", CAP_X + CAP_W + 25, CAP_Y + 20);
}

/* ================= PARTICLES ================= */

class WaterParticle {
  constructor() {
    this.x = random(CAP_X + 10, CAP_X + CAP_W - 30);
    this.y = random(CAP_Y + 10, CAP_Y + CAP_H - 10);
    this.vx = random(0.2, 0.6);
  }

  update() {
    let pressure = pressureSlider.value();

    // προς τα έξω
    this.x += this.vx * pressure;

    // μπλοκάρισμα επιστροφής αν glycocalyx ON
    if (glycocalyxCheckbox.checked()) {
      if (this.x > CAP_X + CAP_W - 18) {
        this.x = CAP_X + CAP_W - 18;
      }
    }

    // εκτός οθόνης → επανεισαγωγή
    if (this.x > width) {
      this.x = random(CAP_X + 10, CAP_X + 200);
      this.y = random(CAP_Y + 10, CAP_Y + CAP_H - 10);
    }
  }

  draw() {
    noStroke();
    fill(0, 100, 255);
    circle(this.x, this.y, 4);
  }
}

class ProteinParticle {
  constructor() {
    this.x = random(CAP_X + 15, CAP_X + CAP_W - 40);
    this.y = random(CAP_Y + 15, CAP_Y + CAP_H - 15);
  }

  update() {
    // Πρωτεΐνες: δεν περνούν ποτέ
    this.x += random(-0.1, 0.1);
    this.y += random(-0.1, 0.1);
  }

  draw() {
    noStroke();
    fill(220, 0, 0);
    circle(this.x, this.y, 7);
  }
}

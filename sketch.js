// ================== ΡΥΘΜΙΣΕΙΣ ==================
const CAP_X = 80;
const CAP_Y = 170;
const CAP_W = 520;
const CAP_H = 100;

const INTER_X = CAP_X + CAP_W + 20;

let water = [];
let proteins = [];

let pressureSlider;
let glycocalyxChk;

// ================== SETUP ==================
function setup() {
  const c = createCanvas(760, 420);
  c.parent("sketch-holder");

  pressureSlider = createSlider(0.5, 2.5, 1.2, 0.01);
  pressureSlider.position(20, 20);
  pressureSlider.style("width", "200px");

  glycocalyxChk = createCheckbox("Glycocalyx ενεργό", true);
  glycocalyxChk.position(20, 50);

  // σωματίδια
  for (let i = 0; i < 160; i++) water.push(new Water());
  for (let i = 0; i < 25; i++) proteins.push(new Protein());
}

// ================== DRAW ==================
function draw() {
  background(245);

  drawLabels();
  drawCapillary();
  drawInterstitial();
  drawGlycocalyx();

  for (let w of water) {
    w.update();
    w.draw();
  }

  for (let p of proteins) p.draw();

  drawLegend();
}

// ================== ΣΧΕΔΙΑΣΗ =================
function drawCapillary() {
  fill(180, 220, 255);
  rect(CAP_X, CAP_Y, CAP_W, CAP_H);
}

function drawInterstitial() {
  fill(230);
  rect(INTER_X, CAP_Y - 10, 120, CAP_H + 20);
}

function drawGlycocalyx() {
  if (glycocalyxChk.checked()) {
    fill(160, 220, 160);
    rect(CAP_X + CAP_W - 14, CAP_Y - 5, 14, CAP_H + 10);
  }
}

function drawLabels() {
  fill(0);
  textSize(13);
  text("Υδροστατική πίεση", 20, 15);
  text("Τριχοειδές", CAP_X + 10, CAP_Y - 8);
  text("Διάμεσος\nχώρος", INTER_X + 10, CAP_Y + 20);
}

function drawLegend() {
  fill(255);
  rect(540, 20, 200, 90, 8);
  fill(0);
  text("ΥΠΟΜΝΗΜΑ", 550, 38);

  fill(0, 100, 255);
  circle(555, 55, 6);
  fill(0);
  text("Νερό", 570, 59);

  fill(220, 0, 0);
  circle(555, 75, 8);
  fill(0);
  text("Πρωτεΐνες", 570, 79);
  fill(150, 0, 200);
circle(555, 95, 6);
fill(0);
text("Επαναρρόφηση (χωρίς glycocalyx)", 570, 99);
}

// ================== ΣΩΜΑΤΙΔΙΑ =================
class Water {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(CAP_X + 10, CAP_X + CAP_W - 40);
    this.y = random(CAP_Y + 8, CAP_Y + CAP_H - 8);
    this.v = random(0.4, 1.1);
    this.backflow = false; // <-- αν κάνει επαναρρόφηση
  }

  update() {
    const P = pressureSlider.value();

    // κύρια ροή: ΠΑΝΤΑ προς τα έξω
    this.x += this.v * P;
    this.backflow = false;

    // ΕΠΑΝΑΡΡΟΦΗΣΗ ΜΟΝΟ ΧΩΡΙΣ GLYCOCALYX
    if (!glycocalyxChk.checked() && random() < 0.015) {
      this.x -= this.v * 1.8;
      this.backflow = true;
    }

    // όρια
    if (this.x > width || this.x < CAP_X + 5) {
      this.reset();
    }
  }

  draw() {
    noStroke();
    if (this.backflow) {
      fill(150, 0, 200); // 🟣 μωβ = επαναρρόφηση
    } else {
      fill(0, 100, 255); // 🔵 μπλε = διήθηση
    }
    circle(this.x, this.y, 4);
  }
}
class Protein {
  constructor() {
    this.x = random(CAP_X + 15, CAP_X + CAP_W - 50);
    this.y = random(CAP_Y + 10, CAP_Y + CAP_H - 10);
  }

  draw() {
    fill(220, 0, 0);
    noStroke();
    circle(this.x, this.y, 8);
  }
}

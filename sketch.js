/* ======================================================
   ΝΕΑ ΕΞΙΣΩΣΗ STARLING – INTERACTIVE ΠΡΟΣΟΜΟΙΩΣΗ
   Τελική σταθερή έκδοση
   ====================================================== */

/* ---------- ΓΕΩΜΕΤΡΙΑ ---------- */
const CAP_X = 80;
const CAP_Y = 190;
const CAP_W = 520;
const CAP_H = 100;
const INTER_X = CAP_X + CAP_W + 20;

/* ---------- ΚΑΤΑΣΤΑΣΗ ---------- */
let water = [];
let proteins = [];
let pressureSlider;
let glycocalyxChk;

/* ---------- SETUP ---------- */
function setup() {
  const c = createCanvas(780, 430);
  c.parent("sketch-holder");

  pressureSlider = createSlider(0.6, 2.5, 1.2, 0.01);
  pressureSlider.position(20, 20);
  pressureSlider.style("width", "220px");

  glycocalyxChk = createCheckbox(" Glycocalyx ενεργό", true);
  glycocalyxChk.position(20, 50);

  for (let i = 0; i < 170; i++) water.push(new Water());
  for (let i = 0; i < 28; i++) proteins.push(new Protein());
}

/* ---------- DRAW ---------- */
function draw() {
  background(245);

  drawCapillary();
  drawInterstitial();
  drawGlycocalyx();
  drawLabels();
  drawLegend();

  for (let w of water) {
    w.update();
    w.draw();
  }

  for (let p of proteins) p.draw();
}

/* ---------- ΣΧΕΔΙΑΣΗ ΧΩΡΩΝ ---------- */
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
    rect(CAP_X + CAP_W - 14, CAP_Y - 6, 14, CAP_H + 12);
  }
}

function drawLabels() {
  fill(0);
  textSize(13);
  text("Υδροστατική πίεση", 20, 15);
  text("Τριχοειδές", CAP_X + 10, CAP_Y - 8);
  text("Διάμεσος\nχώρος", INTER_X + 12, CAP_Y + 20);
}

/* ---------- ΥΠΟΜΝΗΜΑ (ΔΙΑΚΡΙΤΙΚΟ) ---------- */
function drawLegend() {
  const x = 20, y = 90, w = 170, h = 70;

  noStroke();
  fill(255, 245);
  rect(x, y, w, h, 6);

  fill(0);
  textSize(12);
  text("Υπόμνημα", x + 10, y + 16);

  fill(0, 100, 255);
  circle(x + 15, y + 32, 4);
  fill(0);
  text("Νερό", x + 30, y + 35);

  fill(150, 0, 200);
  circle(x + 15, y + 47, 4);
  fill(0);
  text("Νερό (επιστροφή)", x + 30, y + 50);

  fill(220, 0, 0);
  circle(x + 15, y + 62, 5);
  fill(0);
  text("Πρωτεΐνες", x + 30, y + 65);
}

/* ---------- ΣΩΜΑΤΙΔΙΑ ΝΕΡΟΥ ---------- */
class Water {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(CAP_X + 12, CAP_X + CAP_W - 40);
    this.y = random(CAP_Y + 8, CAP_Y + CAP_H - 8);
    this.v = random(0.6, 1.1);
    this.state = "out";   // out = διήθηση, in = επαναρρόφηση
    this.alpha = 255;     // για fade‑in
  }

  update() {
    const P = pressureSlider.value();

    if (this.state === "out") {
      // ΠΑΝΤΑ διήθηση προς τα έξω
      this.x += this.v * P;

      // ΣΠΑΝΙΑ επαναρρόφηση (μόνο χωρίς glycocalyx)
      if (!glycocalyxChk.checked() && random() < 0.004) {
        this.state = "in";
        this.alpha = 0;   // ξεκινά fade‑in
      }
    }
    else if (this.state === "in") {
      // Ήπια, περιορισμένη επιστροφή
      this.x -= this.v * 1.2;
      this.alpha = min(this.alpha + 12, 255); // fade‑in
    }

    if (this.x > width || this.x < CAP_X + 6) {
      this.reset();
    }
  }

  draw() {
    noStroke();
    if (this.state === "in") {
      fill(150, 0, 200, this.alpha); // 🟣 fade‑in επαναρρόφηση
      circle(this.x, this.y, 5);
    } else {
      fill(0, 100, 255);              // 🔵 διήθηση
      circle(this.x, this.y, 4);
    }
  }
}

/* ---------- ΠΡΩΤΕΪΝΕΣ ---------- */
class Protein {
  constructor() {
    this.x = random(CAP_X + 16, CAP_X + CAP_W - 50);
    this.y = random(CAP_Y + 12, CAP_Y + CAP_H - 12);
  }

  draw() {
    fill(220, 0, 0);
    noStroke();
    circle(this.x, this.y, 7);
  }
}

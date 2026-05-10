/* ======================================================
   ΠΑΛΙΑ vs ΝΕΑ ΕΞΙΣΩΣΗ STARLING
   Διδακτική προσομοίωση με toggle
   ====================================================== */

/* ---------- ΓΕΩΜΕΤΡΙΑ ---------- */
const CAP_X = 80;
const CAP_Y = 200;
const CAP_W = 520;
const CAP_H = 100;
const INTER_X = CAP_X + CAP_W + 20;

/* ---------- ΚΑΤΑΣΤΑΣΗ ---------- */
let water = [];
let proteins = [];

let pressureSlider;
let glycocalyxChk;
let starlingMode; // "old" ή "new"

/* ---------- SETUP ---------- */
function setup() {
  const c = createCanvas(800, 440);
  c.parent("sketch-holder");

  // Υδροστατική πίεση
  pressureSlider = createSlider(0.6, 2.5, 1.2, 0.01);
  pressureSlider.position(20, 20);
  pressureSlider.style("width", "220px");

  // Glycocalyx
  glycocalyxChk = createCheckbox(" Glycocalyx ενεργό", true);
  glycocalyxChk.position(20, 50);

  // Toggle μοντέλου Starling
  starlingMode = createRadio();
  starlingMode.option("Παλιά Starling", "old");
  starlingMode.option("Νέα Starling", "new");
  starlingMode.selected("new");
  starlingMode.position(20, 75);

  // Σωματίδια
  for (let i = 0; i < 180; i++) water.push(new Water());
  for (let i = 0; i < 30; i++) proteins.push(new Protein());
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

/* ---------- ΣΧΕΔΙΑΣΗ ---------- */
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

  // Ετικέτα μοντέλου
  textSize(12);
  const label =
    starlingMode.value() === "old"
      ? "Μοντέλο: Παλιά Starling"
      : "Μοντέλο: Νέα Starling";
  text(label, CAP_X + CAP_W / 2 - 60, CAP_Y - 8);
}

/* ---------- ΥΠΟΜΝΗΜΑ ---------- */
function drawLegend() {
  const x = 20, y = 115, w = 165, h = 70;

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
  text("Επιστροφή", x + 30, y + 50);

  fill(220, 0, 0);
  circle(x + 15, y + 62, 5);
  fill(0);
  text("Πρωτεΐνες", x + 30, y + 65);
}

/* ---------- ΝΕΡΟ ---------- */
class Water {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(CAP_X + 12, CAP_X + CAP_W - 40);
    this.y = random(CAP_Y + 8, CAP_Y + CAP_H - 8);
    this.v = random(0.6, 1.1);
    this.state = "out"; // out / in
    this.alpha = 255;
  }

  update() {
    const P = pressureSlider.value();
    const mode = starlingMode.value(); // old / new

    if (this.state === "out") {
      // ΠΑΝΤΑ διήθηση προς τα έξω
      this.x += this.v * P;

      /* ---------- ΝΕΑ STARLING ---------- */
      if (mode === "new") {
        if (!glycocalyxChk.checked() && random() < 0.004) {
          this.state = "in";
          this.alpha = 0;
        }
      }

      /* ---------- ΠΑΛΙΑ STARLING ---------- */
      if (mode === "old") {
        const venousZone = CAP_X + CAP_W * 0.7;
        if (this.x > venousZone && random() < 0.02) {
          this.state = "in";
          this.alpha = 0;
        }
      }
    }
    else if (this.state === "in") {
      this.x -= this.v * 1.3;
      this.alpha = min(this.alpha + 14, 255);
    }

    if (this.x > width || this.x < CAP_X + 6) {
      this.reset();
    }
  }

  draw() {
    noStroke();
    if (this.state === "in") {
      fill(150, 0, 200, this.alpha);
      circle(this.x, this.y, 5);
    } else {
      fill(0, 100, 255);
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
``

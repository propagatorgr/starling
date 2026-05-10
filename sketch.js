/* ======================================================
   ΝΕΑ ΕΞΙΣΩΣΗ STARLING – ΤΕΛΙΚΗ RESPONSIVE ΥΛΟΠΟΙΗΣΗ
   με collapsible legend (p5 DOM)
   ====================================================== */

/* ---------- ΣΧΕΔΙΑΣΤΙΚΕΣ ΔΙΑΣΤΑΣΕΙΣ ---------- */
const DESIGN_W = 800;
const DESIGN_H = 440;

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

// Legend DOM
let legendDiv;
let legendHeader;
let legendContent;
let legendOpen = false;

/* ---------- SETUP ---------- */
function setup() {
  const cw = min(windowWidth - 20, DESIGN_W);
  const ch = cw * (DESIGN_H / DESIGN_W);
  const c = createCanvas(cw, ch);
  c.parent("sketch-holder");

  /* --- Slider --- */
  pressureSlider = createSlider(0.6, 2.5, 1.2, 0.01);
  pressureSlider.position(20, 20);
  pressureSlider.style("width", "220px");

  /* --- Checkbox --- */
  glycocalyxChk = createCheckbox(" Glycocalyx ενεργό", true);
  glycocalyxChk.position(20, 50);

  /* ---------- COLLAPSIBLE LEGEND (p5 DOM) ---------- */
  legendDiv = createDiv();
  legendDiv.style("position", "absolute");
  legendDiv.style("background", "#fff");
  legendDiv.style("border-radius", "8px");
  legendDiv.style("box-shadow", "0 2px 6px rgba(0,0,0,0.15)");
  legendDiv.style("font-size", "14px");
  legendDiv.style("overflow", "hidden");
  legendDiv.style("min-width", "170px");

  legendHeader = createDiv("Υπόμνημα ▸");
  legendHeader.parent(legendDiv);
  legendHeader.style("padding", "8px 12px");
  legendHeader.style("cursor", "pointer");
  legendHeader.style("font-weight", "bold");
  legendHeader.style("user-select", "none");

  legendContent = createDiv(`
    <div><span style="color:rgb(0,100,255)">●</span> Νερό</div>
    <div><span style="color:rgb(150,0,200)">●</span> Νερό (επιστροφή)</div>
    <div><span style="color:rgb(220,0,0)">●</span> Πρωτεΐνες</div>
  `);
  legendContent.parent(legendDiv);
  legendContent.style("padding", "0 12px 10px 12px");
  legendContent.style("display", "none");

  legendHeader.mousePressed(toggleLegend);

  placeLegend();

  /* --- Σωματίδια --- */
  for (let i = 0; i < 170; i++) water.push(new Water());
  for (let i = 0; i < 28; i++) proteins.push(new Protein());
}

/* ---------- RESPONSIVE ---------- */
function windowResized() {
  const cw = min(windowWidth - 20, DESIGN_W);
  const ch = cw * (DESIGN_H / DESIGN_W);
  resizeCanvas(cw, ch);
  placeLegend();
}

/* ---------- LEGEND HELPERS ---------- */
function toggleLegend() {
  legendOpen = !legendOpen;
  legendContent.style("display", legendOpen ? "block" : "none");
  legendHeader.html(legendOpen ? "Υπόμνημα ▼" : "Υπόμνημα ▸");
}

function placeLegend() {
  // ψηλά, δεξιά από slider – εκτός canvas
  legendDiv.position(260, 20);
}

/* ---------- DRAW ---------- */
function draw() {
  background(245);

  // Κλιμάκωση σχεδίου
  const s = width / DESIGN_W;
  scale(s);

  drawCapillary();
  drawInterstitial();
  drawGlycocalyx();
  drawLabels();

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
  text("Τριχοειδές", CAP_X + 10, CAP_Y - 8);
  text("Διάμεσος\nχώρος", INTER_X + 12, CAP_Y + 20);
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
    this.state = "out";   // out / in
    this.alpha = 255;
  }

  update() {
    const P = pressureSlider.value();

    if (this.state === "out") {
      // ΠΑΝΤΑ διήθηση
      this.x += this.v * P;

      // Παλιό μοντέλο Starling (χωρίς glycocalyx)
      if (!glycocalyxChk.checked() && random() < 0.004) {
        this.state = "in";
        this.alpha = 0;
      }
    }
    else if (this.state === "in") {
      // Ήπια επαναρρόφηση
      this.x -= this.v * 1.2;
      this.alpha = min(this.alpha + 12, 255);
    }

    if (this.x > DESIGN_W || this.x < CAP_X + 6) {
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

/* ======================================================
   ΝΕΑ ΕΞΙΣΩΣΗ STARLING – ΤΕΛΙΚΗ ΔΙΔΑΚΤΙΚΗ ΠΡΟΣΟΜΟΙΩΣΗ
   ====================================================== */

/* ---------- DESIGN SIZE ---------- */
const DESIGN_W = 800;
const DESIGN_H = 440;

/* ---------- GEOMETRY ---------- */
const CAP_X = 80;
const CAP_Y = 200;
const CAP_W = 520;
const CAP_H = 100;
const INTER_X = CAP_X + CAP_W + 20;

/* ---------- STATE ---------- */
let water = [];
let proteins = [];

let pressureSlider;
let glycocalyxChk;

/* ---------- LEGEND ---------- */
let legendDiv, legendHeader, legendContent;
let legendOpen = false;

/* ---------- INFO ---------- */
let infoBtn, infoDiv;
let infoOpen = false;

/* ---------- SETUP ---------- */
function setup() {
  const cw = min(windowWidth - 20, DESIGN_W);
  const ch = cw * (DESIGN_H / DESIGN_W);
  createCanvas(cw, ch).parent("sketch-holder");

  /* --- Slider --- */
  pressureSlider = createSlider(0.6, 2.5, 1.2, 0.01);
  pressureSlider.position(20, 20);
  pressureSlider.style("width", "220px");

  /* --- Checkbox --- */
  glycocalyxChk = createCheckbox(" Glycocalyx ενεργό", true);
  glycocalyxChk.position(20, 50);

  /* ==================================================
     COLLAPSIBLE LEGEND – κοντά στο slider
     ================================================== */
  legendDiv = createDiv();
  styleBox(legendDiv, 180);

  legendHeader = createDiv("Υπόμνημα ▸");
  legendHeader.parent(legendDiv);
  styleHeader(legendHeader);

  legendContent = createDiv(`
    <div><span style="color:rgb(0,100,255)">●</span> Νερό</div>
    <div><span style="color:rgb(150,0,200)">●</span> Νερό (επιστροφή)</div>
    <div><span style="color:rgb(220,0,0)">●</span> Πρωτεΐνες</div>
  `);
  legendContent.parent(legendDiv);
  legendContent.style("padding", "0 12px 10px 12px");
  legendContent.style("display", "none");

  legendHeader.mousePressed(() => {
    legendOpen = !legendOpen;
    legendContent.style("display", legendOpen ? "block" : "none");
    legendHeader.html(legendOpen ? "Υπόμνημα ▼" : "Υπόμνημα ▸");
  });

  /* ==================================================
     INFO BUTTON – ΠΟΛΥ ΔΕΞΙΑ
     ================================================== */
  infoBtn = createButton("ℹ️ Τι δείχνει αυτό;");
  infoBtn.style("position", "absolute");
  infoBtn.mousePressed(() => {
    infoOpen = !infoOpen;
    infoDiv.style("display", infoOpen ? "block" : "none");
  });

  /* INFO PANEL – ανοίγει ΚΑΤΩ */
  infoDiv = createDiv(`
    <strong>Τι δείχνει το μοντέλο</strong><br><br>

    ▶ <strong>Glycocalyx ανενεργό</strong><br>
    Αντιστοιχεί στην <em>παλιά θεωρία Starling</em>:
    θεωρούσαμε ότι υπάρχει επαναρρόφηση
    στο φλεβικό άκρο του τριχοειδούς.<br><br>

    ▶ <strong>Glycocalyx ενεργό</strong><br>
    Η <em>νέα θεωρία Starling</em> δείχνει ότι
    η επαναρρόφηση πρακτικά καταργείται,
    λόγω του υπο‑glycocalyx χώρου.<br><br>

    Η διαφορά δεν είναι η πίεση,
    αλλά το <strong>μοντέλο του τριχοειδικού τοιχώματος</strong>.
  `);
  styleBox(infoDiv, 300);
  infoDiv.style("display", "none");

  placeUI();

  /* --- Particles --- */
  for (let i = 0; i < 170; i++) water.push(new Water());
  for (let i = 0; i < 28; i++) proteins.push(new Protein());
}

/* ---------- RESPONSIVE ---------- */
function windowResized() {
  const cw = min(windowWidth - 20, DESIGN_W);
  const ch = cw * (DESIGN_H / DESIGN_W);
  resizeCanvas(cw, ch);
  placeUI();
}

/* ---------- UI POSITIONING ---------- */
function placeUI() {
  // Υπόμνημα – κοντά στο slider
  legendDiv.position(260, 20);

  // Info button – πολύ δεξιά
  const infoX = min(windowWidth - 200, DESIGN_W - 160);
  const infoY = 20;

  infoBtn.position(infoX, infoY);
  infoDiv.position(infoX, infoY + 40); // ΑΝΟΙΓΕΙ ΠΡΟΣ ΤΑ ΚΑΤΩ
}

/* ---------- DRAW ---------- */
function draw() {
  background(245);

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

/* ---------- DRAWING ---------- */
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

/* ---------- WATER ---------- */
class Water {
  constructor() { this.reset(); }

  reset() {
    this.x = random(CAP_X + 12, CAP_X + CAP_W - 40);
    this.y = random(CAP_Y + 8, CAP_Y + CAP_H - 8);
    this.v = random(0.6, 1.1);
    this.state = "out";
    this.alpha = 255;
  }

  update() {
    const P = pressureSlider.value();

    if (this.state === "out") {
      this.x += this.v * P;

      // Παλιά Starling (χωρίς glycocalyx)
      if (!glycocalyxChk.checked() && random() < 0.004) {
        this.state = "in";
        this.alpha = 0;
      }
    } 
    else if (this.state === "in") {
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

/* ---------- PROTEINS ---------- */
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

/* ---------- UI HELPERS ---------- */
function styleBox(div, w) {
  div.style("position", "absolute");
  div.style("background", "#fff");
  div.style("border-radius", "10px");
  div.style("box-shadow", "0 4px 12px rgba(0,0,0,0.25)");
  div.style("padding", "10px 14px");
  div.style("font-size", "14px");
  div.style("max-width", w + "px");
}

function styleHeader(h) {
  h.style("cursor", "pointer");
  h.style("font-weight", "bold");
  h.style("user-select", "none");
}

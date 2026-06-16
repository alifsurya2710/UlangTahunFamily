import QRCode from "qrcode";
import { createCanvas, loadImage, registerFont } from "canvas";
import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT  = path.join(__dirname, "..", "public", "qr-ulang-tahun.png");
const URL_STR = "https://ulang-tahun-family.vercel.app";

// ── Ukuran Canvas (Portrait / Instagram ratio) ──────────────────────────────────
const WIDTH  = 1080;
const HEIGHT = 1350;
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx    = canvas.getContext("2d");

// ── Helpers ───────────────────────────────────────────────────────────────────
function rrect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function heartPath(bx, by, bw, bh) {
  const x = bx + bw / 2;
  const y = by;
  ctx.beginPath();
  // start at the top cleft
  ctx.moveTo(x, y + bh * 0.25);
  // left top lobe
  ctx.bezierCurveTo(
    x - bw * 0.1, y, 
    x - bw * 0.5, y, 
    x - bw * 0.5, y + bh * 0.35
  );
  // left bottom curve to point
  ctx.bezierCurveTo(
    x - bw * 0.5, y + bh * 0.7, 
    x - bw * 0.2, y + bh * 0.9, 
    x, y + bh
  );
  // right bottom curve from point
  ctx.bezierCurveTo(
    x + bw * 0.2, y + bh * 0.9, 
    x + bw * 0.5, y + bh * 0.7, 
    x + bw * 0.5, y + bh * 0.35
  );
  // right top lobe
  ctx.bezierCurveTo(
    x + bw * 0.5, y, 
    x + bw * 0.1, y, 
    x, y + bh * 0.25
  );
  ctx.closePath();
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. BACKGROUND LUAR (Soft Greyish-Pink)
// ═══════════════════════════════════════════════════════════════════════════════
ctx.fillStyle = "#f5f3f5";
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// ═══════════════════════════════════════════════════════════════════════════════
// 2. KARTU UTAMA (Main Card)
// ═══════════════════════════════════════════════════════════════════════════════
const CARD_MARGIN = 60;
const CW = WIDTH - CARD_MARGIN * 2;
const CH = HEIGHT - CARD_MARGIN * 2;
const CX = CARD_MARGIN;
const CY = CARD_MARGIN;
const CR = 60;

// Drop shadow
ctx.save();
ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
ctx.shadowBlur = 40;
ctx.shadowOffsetY = 15;
ctx.fillStyle = "#ffffff";
rrect(CX, CY, CW, CH, CR);
ctx.fill();
ctx.restore();

// White base
ctx.fillStyle = "#ffffff";
rrect(CX, CY, CW, CH, CR);
ctx.fill();

// Soft pink glow accents inside the card
ctx.save();
ctx.clip(); // clip to card
const glow1 = ctx.createRadialGradient(CX + 150, CY + 150, 0, CX + 150, CY + 150, 400);
glow1.addColorStop(0, "rgba(255, 230, 235, 0.8)");
glow1.addColorStop(1, "rgba(255, 255, 255, 0)");
ctx.fillStyle = glow1;
ctx.fillRect(CX, CY, CW, CH);

const glow2 = ctx.createRadialGradient(CX + CW - 100, CY + CH - 100, 0, CX + CW - 100, CY + CH - 100, 500);
glow2.addColorStop(0, "rgba(255, 235, 240, 0.6)");
glow2.addColorStop(1, "rgba(255, 255, 255, 0)");
ctx.fillStyle = glow2;
ctx.fillRect(CX, CY, CW, CH);
ctx.restore();

// ═══════════════════════════════════════════════════════════════════════════════
// 3. TEKS "Spesial Untuk Kamu" (Top)
// ═══════════════════════════════════════════════════════════════════════════════
ctx.save();
ctx.fillStyle = "#ff4d6d";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// Coba pakai font italic/cursive bawaan OS
ctx.font = "italic 700 85px 'Brush Script MT', 'Palatino Linotype', 'Georgia', serif";

// Sedikit shadow biar teks lebih menonjol
ctx.shadowColor = "rgba(255, 77, 109, 0.2)";
ctx.shadowBlur = 10;
ctx.shadowOffsetY = 4;
ctx.fillText("Hadiah Untuk Keluarga", WIDTH / 2, CY + 180);
ctx.restore();

// ═══════════════════════════════════════════════════════════════════════════════
// 4. BINGKAI LOVE & GAMBAR
// ═══════════════════════════════════════════════════════════════════════════════
const HW = 650;
const HH = 600;
const HX = (WIDTH - HW) / 2;
const HY = CY + 300;

// Drop shadow di balik Love
ctx.save();
ctx.shadowColor = "rgba(255, 100, 140, 0.4)";
ctx.shadowBlur = 50;
ctx.shadowOffsetY = 20;
ctx.fillStyle = "#ffffff";
heartPath(HX, HY, HW, HH);
ctx.fill();
ctx.restore();

// Clip gambar ke dalam Love
ctx.save();
heartPath(HX, HY, HW, HH);
ctx.clip();

try {
  // Load gambar background ulang tahun atau gambar lain
  const bgImgPath = path.join(__dirname, "..", "public", "birthday-bg.png");
  const bgImg = await loadImage(bgImgPath);
  
  // Gambar akan di scale fill ke dalam Love
  const scale = Math.max(HW / bgImg.width, HH / bgImg.height);
  const imgW = bgImg.width * scale;
  const imgH = bgImg.height * scale;
  const imgX = HX + HW/2 - imgW/2;
  const imgY = HY + HH/2 - imgH/2;
  
  ctx.drawImage(bgImg, imgX, imgY, imgW, imgH);
  
  // Kasih overlay gelap sedikit supaya QR code tetap terlihat
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(HX, HY, HW, HH);
} catch(e) {
  // Fallback kalau gambar ga ada
  const hGrad = ctx.createLinearGradient(HX, HY, HX + HW, HY + HH);
  hGrad.addColorStop(0, "#ffb3c6");
  hGrad.addColorStop(1, "#ff8fa3");
  ctx.fillStyle = hGrad;
  ctx.fill();
}
ctx.restore();

// Stroke/Garis luar Love (Pink tebal)
ctx.save();
const strokeGrad = ctx.createLinearGradient(HX, HY, HX, HY + HH);
strokeGrad.addColorStop(0, "#ff4d6d");
strokeGrad.addColorStop(1, "#ff758c");
ctx.strokeStyle = strokeGrad;
ctx.lineWidth = 18;
heartPath(HX, HY, HW, HH);
ctx.stroke();

// Inner highlight
ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
ctx.lineWidth = 4;
heartPath(HX + 8, HY + 8, HW - 16, HH - 16);
ctx.stroke();
ctx.restore();

// ═══════════════════════════════════════════════════════════════════════════════
// 5. QR CODE (Di tengah Love)
// ═══════════════════════════════════════════════════════════════════════════════
const QR_SIZE = 280;
const QR_X = (WIDTH - QR_SIZE) / 2;
const QR_Y = HY + (HH - QR_SIZE) / 2 + 15;

// Kotak putih di belakang QR supaya scan 100% mulus
ctx.save();
ctx.shadowColor = "rgba(0,0,0,0.2)";
ctx.shadowBlur = 20;
ctx.fillStyle = "#ffffff";
rrect(QR_X - 15, QR_Y - 15, QR_SIZE + 30, QR_SIZE + 30, 25);
ctx.fill();
ctx.restore();

const qrDataUrl = await QRCode.toDataURL(URL_STR, {
  width: QR_SIZE,
  margin: 1,
  color: { dark: "#000000", light: "#ffffff" },
  errorCorrectionLevel: "H",
});

const qrImg = await loadImage(qrDataUrl);
ctx.drawImage(qrImg, QR_X, QR_Y, QR_SIZE, QR_SIZE);

// ═══════════════════════════════════════════════════════════════════════════════
// 6. TEKS "SCAN INI YAA!" (Bottom)
// ═══════════════════════════════════════════════════════════════════════════════
ctx.save();
ctx.fillStyle = "#5c5c5c";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = "bold 32px 'Outfit', 'Inter', 'Arial', sans-serif";
ctx.letterSpacing = "6px"; // Note: letterSpacing might not work perfectly in canvas, so we can manually simulate or just rely on font
ctx.fillText("SCAN INI YAA!", WIDTH / 2, HY + HH + 120);
ctx.restore();

// ═══════════════════════════════════════════════════════════════════════════════
// 7. SIMPAN HASIL
// ═══════════════════════════════════════════════════════════════════════════════
const out = createWriteStream(OUTPUT);
canvas.createPNGStream().pipe(out);
out.on("finish", () => console.log("✅ QR saved →", OUTPUT));

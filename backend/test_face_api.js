const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const path = require('path');

async function test() {
  const modelDir = path.join(__dirname, 'weights');
  
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelDir);
  console.log("Models loaded!");

  const canvas = new Canvas(200, 200);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 200, 200);

  try {
    const detection = await faceapi.detectSingleFace(canvas);
    console.log("Detection successful:", detection);
  } catch (err) {
    console.error("Detection failed:", err);
  }
}

test();

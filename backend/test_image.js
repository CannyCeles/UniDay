const faceapi = require('face-api.js');
const { Canvas, Image, ImageData, loadImage } = require('canvas');
const path = require('path');

async function test() {
  const modelDir = path.join(__dirname, 'weights');
  
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelDir);
  console.log("Models loaded!");

  const imagePath = path.join(__dirname, 'uploads', 'profiles', '1779180954762-450663529.png');
  console.log("Loading image:", imagePath);
  
  try {
    const img = await loadImage(imagePath);
    console.log(`Image loaded! width=${img.width}, height=${img.height}`);
    
    const detection = await faceapi.detectSingleFace(img);
    console.log("Detection successful:", detection);
  } catch (err) {
    console.error("Detection failed:", err);
  }
}

test();

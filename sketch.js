let handpose;
let video;
let predictions = [];
let selectedImage;

function preload() {
  // 預載入圖片
  scissorsImage = loadImage('7024086.jpg');
  rockImage = loadImage('7024376.jpg');
  paperImage = loadImage('7071198.jpg');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  console.log('Handpose model ready!');
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const hand = predictions[0];
    const gesture = detectGesture(hand);

    if (gesture === 'scissors') {
      selectedImage = scissorsImage;
    } else if (gesture === 'rock') {
      selectedImage = rockImage;
    } else if (gesture === 'paper') {
      selectedImage = paperImage;
    }

    if (selectedImage) {
      image(selectedImage, 0, 0, width, height);
      selectedImage = null; // 重置選擇的圖片
    }
  }
}

function detectGesture(hand) {
  // 偵測手勢的邏輯
  const fingers = hand.annotations;
  if (!fingers) return null; // 確保 annotations 存在

  const thumb = fingers.thumb[3];
  const indexFinger = fingers.indexFinger[3];
  const middleFinger = fingers.middleFinger[3];
  const ringFinger = fingers.ringFinger[3];
  const pinky = fingers.pinky[3];

  if (distance(indexFinger, middleFinger) > 50 && distance(ringFinger, pinky) < 30) {
    return 'scissors';
  } else if (distance(indexFinger, thumb) < 30 && distance(middleFinger, ringFinger) < 30) {
    return 'rock';
  } else if (distance(indexFinger, thumb) > 50 && distance(pinky, thumb) > 50) {
    return 'paper';
  }
  return null;
}

function distance(point1, point2) {
  return dist(point1[0], point1[1], point2[0], point2[1]);
}

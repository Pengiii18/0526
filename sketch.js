let video;
let poseNet, handpose;
let noseX = 0, noseY = 0;
let maskImages = {};
let currentMask = '7071198.jpg'; // 預設面罩圖片

function preload() {
  maskImages['7024086.jpg'] = loadImage('7024086.jpg'); // 剪刀
  maskImages['7024376.jpg'] = loadImage('7024376.jpg'); // 石頭
  maskImages['7071198.jpg'] = loadImage('7071198.jpg'); // 布
}

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  handpose = ml5.handpose(video, () => console.log('Handpose 模型已載入'));
  handpose.on('predict', gotHandPose);
}

function draw() {
  background(220);
  image(video, 0, 0);

  // 使用圖片作為面罩
  if (maskImages[currentMask]) {
    image(maskImages[currentMask], noseX - 50, noseY - 25, 100, 50); // 調整圖片位置與大小
  }
}

function modelLoaded() {
  console.log('PoseNet 模型已載入');
}

function gotPoses(poses) {
  if (poses.length > 0) {
    noseX = poses[0].pose.nose.x;
    noseY = poses[0].pose.nose.y;
  }
}

function gotHandPose(predictions) {
  if (predictions.length > 0) {
    const landmarks = predictions[0].landmarks;

    // 簡單手勢判斷（剪刀、石頭、布）
    if (isScissors(landmarks)) {
      currentMask = '7024086.jpg'; // 剪刀
    } else if (isRock(landmarks)) {
      currentMask = '7024376.jpg'; // 石頭
    } else if (isPaper(landmarks)) {
      currentMask = '7071198.jpg'; // 布
    }
  }
}

// 判斷剪刀手勢
function isScissors(landmarks) {
  // 簡單判斷：食指和中指伸直，其餘手指彎曲
  const [indexTip, middleTip, ringTip, pinkyTip] = [
    landmarks[8], landmarks[12], landmarks[16], landmarks[20]
  ];
  return indexTip[1] < landmarks[6][1] && middleTip[1] < landmarks[10][1] &&
         ringTip[1] > landmarks[14][1] && pinkyTip[1] > landmarks[18][1];
}

// 判斷石頭手勢
function isRock(landmarks) {
  // 簡單判斷：所有手指彎曲
  return landmarks.slice(8, 21).every(pt => pt[1] > landmarks[0][1]);
}

// 判斷布手勢
function isPaper(landmarks) {
  // 簡單判斷：所有手指伸直
  return landmarks.slice(8, 21).every(pt => pt[1] < landmarks[0][1]);
}

let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let maskImage;

function preload() {
  maskImage = loadImage('7071198.jpg'); // 載入面罩圖片
}

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function draw() {
  background(220);
  image(video, 0, 0);

  // 使用圖片作為面罩
  if (maskImage) {
    image(maskImage, noseX - 50, noseY - 25, 100, 50); // 調整圖片位置與大小
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

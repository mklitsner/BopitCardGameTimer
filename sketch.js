// Single-sketch example

//const { SoundFile } = require("../../../../Users/MacbookPro/.vscode/extensions/samplavigne.p5-vscode-1.2.7/p5types")


let state = "timerReady"

//files
let screamFiles = []

let menubutton, backbutton

let failFiles,beatFile,

bopItImg,bkgrnd01Img,bkgrnd02Img,bkgrnd03Img;

function preload(){
 bopItImg = loadImage('assets/layerAssets/BopitCardGameLayer_0002_Layer-2.png');
 bkgrnd01Img = loadImage("assets/layerAssets/BopitCardGameLayer_0003_Layer-1.png");
 bkgrnd02Img = loadImage('assets/layerAssets/BopitCardGameLayer_0001_Layer-3.png');
 bkgrnd03Img = loadImage('assets/layerAssets/BopitCardGameLayer_0000_Layer-4.png');
 getAudioContext().suspend();
 beatFile =loadSound("assets/Beats loop.ogg");
 for(let i=0;i<4;++i){
  screamFiles[i]=loadSound('assets/scream/VO_Die_0'+(i+1)+'.ogg');
}
}

function setup (){
  var cnv =createCanvas (windowWidth, windowHeight);
  cnv.mousePressed(enableSound);
  menubutton = createButton('Menu');
  backbutton = createButton('Back')
  menubutton.mousePressed(goToMenu)
  backbutton.mousePressed(goToTimer)
  backbutton.attribute('hidden','')
  amplitude = new p5.Amplitude(0.8);
  nScale =height/bkgrnd01Img.height
  goToTimer()
  beatDuration=beatFile.duration();

}

var nScale

function draw(){
 background(255)
 ProScaleImage(bkgrnd01Img,1)
 nScale =height/bkgrnd01Img.height
 let bopitSize = 1;

 if(state == "timerReady"){
  startTimer()

 }else if(state == "timerRunning"){
  let level = amplitude.getLevel();
  bopitSize = map(level,0,1,0.9,1.3)
  timerRunningLooped()
 }else if(state == "timesUp"){
  playScream()
 }else if (state == "menu"){
  
 }

 if(state!="menu"){
  scaleImage(bkgrnd02Img,nScale)
  scaleImage(bkgrnd03Img,nScale)
  scaleImage(bopItImg,nScale*bopitSize)
  }

 imageMode(CENTER)
//  let fps = frameRate();
//  fill(255)  
//  text(fps, width/2, height/2);
}

let beatTime

function startTimer(){
  if(mouseIsPressed){

    if(dist(width/2,height/2,mouseX,mouseY)<nScale*eScale){
      Pressed();
      beatTime=int(Math.random()*10+5) * beatDuration
      state = "timerRunning"
      looped()
    }

  }
}

let IsLooping = true

let startTime

let speedupTime = 5000

function timerRunningLooped(){
  
  if(IsLooping){
    beatFile.loop()
    beatFile.rate(1)
    IsLooping=false
    startTime = millis()
  }

  var timeleft = beatTime-(millis()-startTime)/1000

  print(timeleft)

  if(timeleft<10){
    if(timeleft<5){
      beatFile.rate(2)
    }else{
      beatFile.rate(1.5)
    }
  }
  if(timeleft<=0){
    state="timesUp"
    stopTimer()
  }
}

function stopTimer(){
  beatFile.stop()
}

function playScream(){
  var num= int(Math.random()*4)
  screamFiles[num].play()
  state="timerReady"
}

function goToMenu(){
  state="menu"
  print("menu Pressed")
  menubutton.attribute('hidden','')
  backbutton.removeAttribute('hidden')
  stopTimer();
  backbutton.position(0.5*(width-bkgrnd01Img.width*nScale),height-backbutton.height);

}
function goToTimer(){
  state="timerReady"
  print("back Pressed")
  backbutton.attribute('hidden','')
  menubutton.removeAttribute('hidden')
  menubutton.position(0.5*(width-bkgrnd01Img.width*nScale),height-menubutton.height);
}

function looped(){
IsLooping = true
}

function enableSound(){
  userStartAudio();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function ProScaleImage(img, scale){
  image(img, 0.5*width, 0.5*height, scale*img.width*height/img.height, scale*height);
}

function scaleImage(img, scale){
  image(img, 0.5*width, 0.5*height, scale*img.width, scale*img.height);
}
var eScale=500


function Pressed(){
  ellipseMode(CENTER)
eScale=500
  fill(150,0,210)
  ellipse(width/2,height/2, nScale*eScale, nScale *eScale)
  //blendMode(MULTIPLY)
  }


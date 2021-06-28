// Single-sketch example

//const { SoundFile } = require("../../../../Users/MacbookPro/.vscode/extensions/samplavigne.p5-vscode-1.2.7/p5types")


let state = "timerReady"


//bug: https://github.com/processing/p5.js-sound/issues/506

//files
let screamFiles

let menubutton
let backbutton

let failFiles
let beatFile

let bopItImg
let bkgrnd01Img
let bkgrnd02Img
let bkgrnd03Img

let timerLengthSetting

function preload(){
  print("v"+0.3)
  getAudioContext().suspend();
 bopItImg = loadImage('assets/layerAssets/BopitCardGameLayer_0002_Layer-2.png');
 bkgrnd01Img = loadImage("assets/layerAssets/BopitCardGameLayer_0003_Layer-1.png");
 bkgrnd02Img = loadImage('assets/layerAssets/BopitCardGameLayer_0001_Layer-3.png');
 bkgrnd03Img = loadImage('assets/layerAssets/BopitCardGameLayer_0000_Layer-4.png');
 beatFile =loadSound("assets/Beats loop.mp3");

//  scream1 =loadSound('assets/scream/VO_Die_01.ogg');
//  scream2 =loadSound('assets/scream/VO_Die_02.ogg');
//  scream3 =loadSound('assets/scream/VO_Die_03.ogg');
//  scream4 =loadSound('assets/scream/VO_Die_04.ogg');
 
//  screamFiles=[scream1,scream2,scream3,scream4]
}

function setup (){
  print("v"+0.1)
  var cnv =createCanvas (windowWidth, windowHeight);
  cnv.mousePressed(enableSound);
  menubutton = createButton('Menu');
  backbutton = createButton('Back')
  menubutton.mousePressed(goToMenu)
  backbutton.mousePressed(goToTimer)
  backbutton.attribute('hidden','')
  amplitude = new p5.Amplitude(0.8);
  cnvScale =height/bkgrnd01Img.height
  goToTimer()
  beatDuration=beatFile.duration();
  eScale=500;
  timerLengthSetting=1


}

var cnvScale

function draw(){
 background(255)
 ProScaleImage(bkgrnd01Img,1)
 cnvScale =height/bkgrnd01Img.height
 let bopitSize = 1;
 if(state == "timerReady"){
  startTimer();
 }else if(state == "timerRunning"){
  let level = amplitude.getLevel();
  bopitSize = map(level,0,1,0.9,1.3)
  timerRunningLooped()
 }else if(state == "timesUp"){
  playScream()
 }else if (state == "menu"){
  
 }

 if(state!="menu"){
  scaleImage(bkgrnd02Img,cnvScale)
  scaleImage(bkgrnd03Img,cnvScale)
  scaleImage(bopItImg,cnvScale*bopitSize)
  }

 imageMode(CENTER)
}

let beatTime

function startTimer(){
  if(mouseIsPressed){
    if(dist(width/2,height/2,mouseX,mouseY)<eScale*cnvScale*0.5){
      Pressed()
      beatTime=int(Math.random()*10+5) * beatDuration
      //beatTime = int(Math.random()*10+5)
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

  if(timeleft<5){
    if(timeleft<2){
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
  // screamFiles[num].play()
  state="timerReady"
}

function goToMenu(){
  state="menu"
  print("menu Pressed")
  menubutton.attribute('hidden','')
  backbutton.removeAttribute('hidden')
  stopTimer();
  backbutton.position(0.5*(width-bkgrnd01Img.width*cnvScale),height-backbutton.height);

}
function goToTimer(){
  state="timerReady"
  print("back Pressed")
  backbutton.attribute('hidden','')
  menubutton.removeAttribute('hidden')
  menubutton.position(0.5*(width-bkgrnd01Img.width*cnvScale),height-menubutton.height);
}

function looped(){
IsLooping = true
}

function enableSound(){
  userStartAudio();
  getAudioContext().resume()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function ProScaleImage(img, scale){
  image(img, 0.5*width, 0.5*height, scale*img.width*height/img.height, scale*height);
}

function scaleImage(img, scale, event){
  image(img, 0.5*width, 0.5*height, scale*img.width, scale*img.height).mousePressed(event);
}

function scaleImage(img, scale){
  image(img, 0.5*width, 0.5*height, scale*img.width, scale*img.height);
}
var eScale=500


function Pressed(){
  ellipseMode(CENTER)
  fill(150,0,210)
  ellipse(width/2,height/2, cnvScale*eScale, cnvScale *eScale)
  //blendMode(MULTIPLY)
  }


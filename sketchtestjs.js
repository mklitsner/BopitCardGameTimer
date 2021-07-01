// Single-sketch example

//const { SoundFile } = require("../../../../Users/MacbookPro/.vscode/extensions/samplavigne.p5-vscode-1.2.7/p5types")


let state = "timerReady"


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
 bopItImg = loadImage('assets/layerAssets/BopitCardGameLayer_0002_Layer-2.png');
 bkgrnd01Img = loadImage("assets/layerAssets/BopitCardGameLayer_0003_Layer-1.png");
 bkgrnd02Img = loadImage('assets/layerAssets/BopitCardGameLayer_0001_Layer-3.png');
 bkgrnd03Img = loadImage('assets/layerAssets/BopitCardGameLayer_0000_Layer-4.png');
 beatSound = loadSound("assets/Beats loop.ogg");
scream1 =loadSound('assets/scream/VO_Die_01.ogg');
scream2 =loadSound('assets/scream/VO_Die_02.ogg');
scream3 =loadSound('assets/scream/VO_Die_03.ogg');
scream4 =loadSound('assets/scream/VO_Die_04.ogg');

screamSounds=[scream1,scream2,scream3,scream4]

}

function setup (){
  var cnv =createCanvas (windowWidth, windowHeight);
  menubutton = createButton('Menu');
  backbutton = createButton('Back')
  backbutton.attribute('hidden','')
  amplitude = new p5.Amplitude(0.8);
  cnvScale =height/bkgrnd01Img.height
  beatDuration=beatSound.duration();
  eScale=500;
  timerLengthSetting=1
  getAudioContext().suspend();
}

var cnvScale

function draw(){
 background(0)
}



let state = "timerReady"
let page = "TIMER"
let isDebug = false;


//bug: https://github.com/processing/p5.js-sound/issues/506
//bugFix: cant use ogg in chrome or safari web browser
//files
let screamSounds = []
let failSounds = []

let bopItImg
let bkgrnd01Img
let bkgrnd02Img
let bkgrnd03Img
let beatSound

//elements
let menubutton
let link
let speedSlider


let timerLengthSetting

function preload() {
  print("v" + 0.6)
  getAudioContext().suspend();
  bopItImg = loadImage('assets/layerAssets/BopitCardGameLayer_0002.png');
  bkgrnd01Img = loadImage("assets/layerAssets/BopitCardGameLayer_0003_Layer-1.png");
  bkgrnd02Img = loadImage('assets/layerAssets/BopitCardGameLayer_0001_Layer-3.png');
  bkgrnd03Img = loadImage('assets/layerAssets/BopitCardGameLayer_0000_Layer-4.png');
  beatSound = loadSound("assets/Beats loop.mp3");

  for (let i = 0; i < 4; i++) {
    var num = i + 1
    screamSounds[i] = loadSound("assets/scream/VO_Die_0" + num + ".mp3")
    printDebug(screamSounds[i])
  }

  for (let i = 0; i < 15; i++) {
    var num = i + 1
    failSounds[i] = loadSound("assets/failPhrases/failPhrase" + num + ".mp3")
    printDebug(failSounds[i])
  }

}

let sliderMin = 10
let sliderStep = 10
function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(enableSound);

  link = createA('https://bopitforgood.com/', 'see more from the inventor of Bop It', '_blank');
  link.attribute('hidden', '')
  link.attribute('target',)
  link.addClass("link")

  menubutton = createButton('Menu');
  menubutton.addClass("button")
  menubutton.mousePressed(goToMenu)

  if(isDebug){
    sliderMin = 1
    sliderStep = 1
  }

  speedSlider = createSlider(sliderMin, sliderMin + sliderStep * 2, sliderMin + sliderStep, sliderStep)
  speedSlider.addClass("slider")
  printDebug(speedSlider)

  amplitude = new p5.Amplitude(0.8);
  cnvScale = height / bkgrnd01Img.height
  goToTimer()
  beatDuration = beatSound.duration();
  eScale = 500;
  timerLengthSetting = 1
  ProScaleImage(bkgrnd01Img, 1)
  speedSlider.style('width', .5 * bkgrnd01Img.width + 'px')
  windowResized()
}

var cnvScale
var buttonPos
function draw() {

  background(255)
  ProScaleImage(bkgrnd01Img, 1)
  buttonPos = width - bkgrnd01Img.width * cnvScale
  if (windowWidth < bkgrnd01Img.width * cnvScale) {
    buttonPos = 0
  }

  cnvScale = height / bkgrnd01Img.height
  let bopitSize = 1;

  if (page == "TIMER") {

    if (state == "timerReady") {
      startTimer();
    } else if (state == "timerRunning") {
      let level = amplitude.getLevel();
      bopitSize = map(level, 0, 1, 0.9, 1.3)
      timerRunningLooped()
    } else if (state == "timesUp") {
      playScream()
    } else if (state == "endPhrase") {
      redFade()
    }

    // scaleImage(bkgrnd02Img, cnvScale)
    // scaleImage(bkgrnd03Img, cnvScale)
    scaleImage(bopItImg, cnvScale * bopitSize / 2)

  } else if (page == "MENU") {
    speedText()

  }

  imageMode(CENTER)
}

let beatTime

function startTimer() {
  if (mouseIsPressed) {
    if (dist(width / 2, height / 2, mouseX, mouseY) < eScale * cnvScale * 0.5) {
      bopItPressed()
      var timerMinPerc = 0.5
      var timerMax = speedSlider.value()
      var timerMin = speedSlider.value() * timerMinPerc
      beatTime = int(Math.random() * (timerMax - timerMin) + timerMin) * beatDuration
      // beatTime = int(Math.random()*10+5)
      state = "timerRunning"
      looped()
    }
  }
}

let IsLooping = true

let startTime

function timerRunningLooped() {

  if (IsLooping) {
    beatSound.loop()
    beatSound.rate(1)
    IsLooping = false
    startTime = millis()
  }

  var timeleft = beatTime - (millis() - startTime) / 1000

  printDebug(timeleft)

  if (timeleft < beatTime * 0.5) {
    if (timeleft < beatTime * 0.1) {
      beatSound.rate(2)
    } else {
      beatSound.rate(1.5)
    }
  }
  if (timeleft <= 0) {
    state = "timesUp"
    stopTimer()
  }
}

function stopTimer() {
  beatSound.stop()
}

function playScream() {
  state = "endPhrase"
  var num = int(Math.random() * 4)
  printDebug("scream " + num)
  screamSounds[num].play()
  screamSounds[num].onended(playFailPhrase)
  fade = 255
}

function playFailPhrase() {
  var num = int(Math.random() * 15)
  printDebug("fail " + num)
  failSounds[num].play()
  failSounds[num].onended(function () {
    state = "timerReady"
  })
}

let fade = 255
function redFade() {
  rect(0, 0, width, height)
  fill(255, 0, 0, fade)
  if (fade > 0) {
    fade = fade-10
  }
}

function goToMenu() {
  page = "MENU"
  state = "menu"
  link.removeAttribute('hidden')
  link.position(0.5 * width, 0.8 * height)
  link.center('horizontal')
  menubutton.elt.innerHTML = "Back"
  menubutton.center('horizontal')
  printDebug(menubutton)
  speedSlider.removeAttribute('hidden')
  speedSlider.position(0.5 * width, 0.5 * height)
  speedSlider.center('horizontal')
  //slider.style('width', 10*bkgrnd01Img.width );
  stopTimer();
  menubutton.mousePressed(goToTimer)

}
function goToTimer() {
  page = "TIMER"
  state = "timerReady"
  menubutton.elt.innerHTML = "Menu"
  menubutton.center('horizontal')
  link.attribute('hidden', '')
  speedSlider.attribute('hidden', '')
  printDebug(link)
  menubutton.mousePressed(goToMenu)
}


function speedText() {
  let title = 'Timer Duration'
  let setting = 'SHORTEST'

  switch (speedSlider.value()) {
    case sliderMin:
      setting = 'SHORTEST'
      break;
    case sliderMin + sliderStep:
      setting = 'NORMAL'
      break;
    case sliderMin + sliderStep * 2:
      setting = 'LONGEST'
      break;
    default:
  }

  fill(255);
  text(title + '\n' + setting, 0.5 * width, 0.35 * height);
  textSize(30)
  textAlign(CENTER, CENTER)
}

function looped() {
  IsLooping = true
}

function enableSound() {
  userStartAudio();
  getAudioContext().resume()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buttonPos = width - bkgrnd01Img.width * cnvScale
  if (windowWidth < bkgrnd01Img.width * cnvScale) {
    buttonPos = 0
  }
  menubutton.position(0.5 * width, bkgrnd01Img.height*cnvScale- menubutton.height*3);
  menubutton.center('horizontal')
  speedSlider.position(0.5 * width, 0.5 * height)
  speedSlider.style('width', .5 * bkgrnd01Img.width + 'px')
  speedSlider.center('horizontal')
  link.position(0.5 * width, 0.8 * height)
  link.center('horizontal')
}

function ProScaleImage(img, scale) {
  image(img, 0.5 * width, 0.5 * height, scale * img.width * height / img.height, scale * height);
}

function scaleImage(img, scale) {
  image(img, 0.5 * width, 0.5 * height, scale * img.width, scale * img.height)
}

var eScale = 500
function bopItPressed() {
  ellipseMode(CENTER)
  fill(150, 0, 210)
  ellipse(width / 2, height / 2, cnvScale * eScale, cnvScale * eScale)
}


function printDebug(text) {
  if (isDebug)
    print(text)
}




let state = "timerReady"
let page = "TIMER"
let isDebug = false;
let version = 0.19


//bug: https://github.com/processing/p5.js-sound/issues/506
//bugFix: cant use ogg in chrome or safari web browser
//files
let screamSounds = []
let failSounds = []
let failSoundstoPlay=[]
let phrasesArray = []
let lastThreePhrases = []

let bopItImg
let bkgrnd01Img
let bkgrnd02Img
let bkgrnd03Img
let beatSound
let cymbalSound

//elements
let menubutton
let stopitButton
let link
let rules
let speedSlider
let blankSlider
let spread
let phraseText
let newPhrase
let phraseIntro = "Your new Shout It phrase is <br>"

let menuHeight
let stopitHeight
let phraseHeight
let rulesHeight = .77
let linkHeight = .85
let blankHeight = .42
let speedHeight = .12
let sliderHeightSpacing = .15

let timerLengthSetting

function preload() {
  print("v" + version)
  getAudioContext().suspend();
  bopItImg = loadImage('assets/layerAssets/BopitCardGameLayer_0002.png');
  bkgrnd01Img = loadImage("assets/layerAssets/BopitCardGameLayer_0003_Layer-1.png");
  //bkgrnd02Img = loadImage('assets/layerAssets/BopitCardGameLayer_0001_Layer-3.png');
  //bkgrnd03Img = loadImage('assets/layerAssets/BopitCardGameLayer_0000_Layer-4.png');
  beatSound = loadSound("assets/Beats loop.mp3");
  cymbalSound = loadSound('assets/CymbalShort.mp3');
  phrasesArray = loadStrings('assets/ShoutItPhrases.txt');
  //print(phrasesArray)

  for (let i = 0; i < 4; i++) {
    var num = i + 1
    screamSounds[i] = loadSound("assets/scream/VO_Die_0" + num + ".mp3")
    printDebug(screamSounds[i])
  }

  spread= int(Math.random()*10)


  for (let i = 0; i < 5; i++) {
    var num = i + spread +1
    failSounds[i] = loadSound("assets/failPhrases/failPhrase" + num + ".mp3")
    printDebug(failSounds[i])
  }
  printDebug("spread is " +spread)

}

let sliderMin = 10
let sliderStep = 10
let blankMin = 1
let blankStep= 1
function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(enableSound);

  link = createA('https://bopitforgood.com/', 'see more from the inventor of Bop It', '_blank');
  link.attribute('hidden', '')
  link.attribute('target',)
  link.addClass("link")

  rules = createA(
    'https://www.dropbox.com/sh/azsxioxac498ih8/AACA3hckZ6Kw4Uhp-TrViLJwa?dl=0'
  , 'RULES');
  rules.attribute('hidden', '')
  rules.attribute('target',)
  rules.addClass("link")

  menubutton = createButton('Menu')
  menubutton.addClass("button")
  menubutton.show()
  menubutton.mousePressed(goToMenu)
  menuHeight= .9

  stopitButton = createButton('Stop It')
  stopitButton.addClass("bigButton")
  stopitButton.mousePressed(OnStopItPressed)
  stopitHeight = .75

  newPhrase = ""
  lastPhrase = ""
  phraseText= createDiv(phraseIntro + newPhrase+" !")
  phraseText.addClass("button")
  phraseHeight = .12


  if (isDebug) {
    sliderMin = 1
    sliderStep = 1
  }

  speedSlider = createSlider(sliderMin, sliderMin + sliderStep * 2, sliderMin + sliderStep, sliderStep)
  speedSlider.addClass("slider")
  printDebug(speedSlider)

  blankSlider = createSlider(blankMin, blankMin + blankStep, blankMin + blankStep, blankStep)
  blankSlider.addClass("slider")

  //blankSlider.value() = blankMin
  SetNewPhrase()
  phraseText.show()

  amplitude = new p5.Amplitude(0.8);
  cnvScale = height / bkgrnd01Img.height
  goToTimer()
  beatDuration = beatSound.duration();
  eScale = 500;
  timerLengthSetting = 1
  ProScaleImage(bkgrnd01Img, 1)
  speedSlider.style('width', .5 * bkgrnd01Img.width + 'px')
  blankSlider.style('width', .5 * bkgrnd01Img.width + 'px')
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
      onPressTimer();
    } else if (state == "timerRunning") {
      let level = amplitude.getLevel();
      bopitSize = map(level, 0, 1, 0.9, 1.3)
      timerRunningLooped()
      onPressTimer()
    } else if (state == "endPhrase") {
      redFade()
    }

    scaleImage(bopItImg, cnvScale * bopitSize / 2)

  } else if (page == "MENU") {
    speedText()
    blankText()

  }

  imageMode(CENTER)
}

let beatTime
let waitTillNextPress=false
function onPressTimer() {
  if (mouseIsPressed&&!waitTillNextPress) {
    if (dist(width / 2, height / 2, mouseX, mouseY) < eScale * cnvScale * 0.5) {
      waitTillNextPress=true
      bopItPressed()
      if (state == "timerRunning") {
        Reset()
        HideOtherButtons()
        printDebug("TimerRunning Press")
      } else {
        StartTimer()
        HideOtherButtons()
        printDebug(" NOt TimerRunning Press")
      }
    }
  }
}

function mouseReleased(){
  waitTillNextPress = false;
}

function StartTimer(){
printDebug("Cymbal")
  cymbalSound.play()
  var timerMinPerc = 0.5
  var timerMax = speedSlider.value()
  var timerMin = speedSlider.value() * timerMinPerc
  beatTime = int(Math.random() * (timerMax - timerMin) + timerMin) * beatDuration

  state = "timerRunning"
  looped()
}

function Reset(){
  stopTimer()
  StartTimer()
}

function SetNewPhrase(){
  //some function to set a new phrase
  lastPhrase=newPhrase
  const isGenerateRandom = blankSlider.value() == blankMin;
  if(isGenerateRandom){
  var index = int(random(0,phrasesArray.length))
  newPhrase= '" '+phrasesArray[index]
  phraseText.elt.innerHTML = phraseIntro+newPhrase+'! "'
  }else{
    phraseText.elt.innerHTML = "Make up a new Shout It <br> Phrase!"
  }
}

function HideOtherButtons(){
  menubutton.hide()
  phraseText.hide()
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
    TimesUp(true)
    stopTimer()
  }
}

function stopTimer() {
  beatSound.stop()
}

function OnStopItPressed(){
  if(state=="timerRunning")
  TimesUp(false)
  stopTimer()
}

function TimesUp(bool, playPhrase) {
  state = "endPhrase"
  var num = int(Math.random() * 4)
  printDebug("scream " + num)
  screamSounds[num].play()
  if(playPhrase){
  screamSounds[num].onended(playFailPhrase)
  }
  fade = 255
  menubutton.show()
  SetNewPhrase()
  phraseText.show()
}

function playFailPhrase() {
  printDebug("fail to play length " +failSoundstoPlay.length)
  printDebug("fail length " +failSounds.length)
  if(failSoundstoPlay.length==0){
    for (let i = 0; i < failSounds.length; i++) {
      failSoundstoPlay.push(failSounds[i])
    }
  }
  printDebug("fail to play length " +failSoundstoPlay.length)
  var num = int(Math.random() * failSoundstoPlay.length)
  printDebug("fail " + num)
  failSoundstoPlay[num].play()
  failSoundstoPlay[num].onended(function () {
    state = "timerReady"
  })
  failSoundstoPlay.splice(num,1)
  printDebug("fail to play length " +failSoundstoPlay.length)
}

let fade = 255
function redFade() {
  rect(0, 0, width, height)
  fill(255, 0, 0, fade)
  if (fade > 0) {
    fade = fade - 10
  }
}

function goToMenu() {
  page = "MENU"
  state = "menu"

  phraseText.hide()
  stopitButton.hide()
  link.removeAttribute('hidden')
  link.position(0.5 * width, linkHeight * height)
  link.center('horizontal')

  rules.removeAttribute('hidden')
  rules.position(0.5 * width, rulesHeight * height)
  rules.center('horizontal')

  menubutton.elt.innerHTML = "Back"
  printDebug(menubutton)
  speedSlider.removeAttribute('hidden')
  speedSlider.position(0.5 * width, (speedHeight+sliderHeightSpacing) * height)
  speedSlider.center('horizontal')
  blankSlider.removeAttribute('hidden')
  blankSlider.position(0.5 * width, (blankHeight+sliderHeightSpacing) * height)
  blankSlider.center('horizontal')

  stopTimer();
  menubutton.mousePressed(goToTimer)
  menubutton.position(0.5 * width, menuHeight * height)
  menubutton.center('horizontal')
  windowResized()
}

function goToTimer() {
  page = "TIMER"
  state = "timerReady"
  menubutton.elt.innerHTML = "Menu"
  link.attribute('hidden', '')
  rules.attribute('hidden', '')
  speedSlider.attribute('hidden', '')
  blankSlider.attribute('hidden', '')
  printDebug(link)
  stopitButton.show()
  phraseText.show()
  menubutton.mousePressed(goToMenu)
  menubutton.position(0.5 * width, menuHeight * height)
  menubutton.center('horizontal')
  stopitButton.mousePressed(OnStopItPressed)
  stopitButton.position(0.5 * width, stopitHeight * height)
  stopitButton.center('horizontal')
  windowResized()
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

  ParamText(title, setting, speedHeight);
}


function blankText() {
  let title = 'Shout It Phrase'
  let setting = 'GENERATE RANDOM'

  switch (blankSlider.value()) {
    case blankMin:
      setting = 'GENERATE RANDOM'
      break;
    case blankMin + blankStep:
      setting = 'USE YOUR OWN'
      break;
    default:
  }

  blankSlider.input(SetNewPhrase)



  ParamText(title, setting, blankHeight);
if(lastPhrase!=""&& blankSlider.value()==blankMin){
  textSize(20);
  fill(0, 150, 150);
  text("Last Shout It Phrase was \n '"+lastPhrase+'! "', 0.5 * width, (blankHeight+sliderHeightSpacing+.12) * height);
}
  
}

function ParamText(title, setting, hPos) {
  textAlign(CENTER, CENTER)
  textSize(25);
  fill(255);
  text(title, 0.5 * width, hPos * height);
  fill(255, 255, 0);
  text(setting, 0.5 * width, (hPos + .06) * height);
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
  menubutton.position(0.5 * width, menuHeight * height);
  menubutton.center('horizontal')
  phraseText.position(0.5 * width, phraseHeight * height);
  phraseText.center('horizontal')
  stopitButton.position(0.5 * width, stopitHeight * height);
  stopitButton.center('horizontal')
  speedSlider.position(0.5 * width, (speedHeight+sliderHeightSpacing) * height)
  speedSlider.style('width', .5 * bkgrnd01Img.width + 'px')
  speedSlider.center('horizontal')
  blankSlider.position(0.5 * width, (blankHeight+sliderHeightSpacing) * height)
  blankSlider.style('width', .5 * bkgrnd01Img.width + 'px')
  blankSlider.center('horizontal')
  link.position(0.5 * width, linkHeight * height)
  link.center('horizontal')
  rules.position(0.5 * width, rulesHeight * height)
  rules.center('horizontal')
}

function ProScaleImage(img, scale) {

    image(img, 0.5 * width, 0.5 * height, scale * img.width * height / img.height, scale * height);
 
    //image(img, 0.5 * width, 0.5 * height, scale * width, scale * img.height * width / img.width);
  
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


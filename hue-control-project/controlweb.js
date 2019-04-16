let hubIp = '192.168.1.195';    // the hub IP address
let username = 'pQ-zq9xgH0JXko2fNwSEyg2lXp18AB8tehFYsuiJ';  // My user name as per the hue developer API

let canvas;
let lightSwitch;
let modeSwitch;
let brightSlider;
let hueSlider;
let satSlider;

let lightState;
let lightNo = 1;
let manualMode = true;

let phueSlider = 32767;
let psatSlider = 127;
let pbrightSlider = 255;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    url = "http://" + hubIp + "/api" + username;

    

    // on  off button
    lightSwitch = createButton("Power");
    lightSwitch.position(40, 100);
    lightSwitch.class('lightSwitch');
    lightSwitch.mouseClicked(toggleLight);

    //button to switch from manual mode to auto
    //set button mode text
  
    modeSwitch = createButton("Mode");
    modeSwitch.position(40, 150);
    modeSwitch.class('lightSwitch');
    modeSwitch.mouseClicked(toggleMode);

    //hue slider
    hueSlider = createSlider(0, 65535, 6000, 100);
    hueSlider.class('qualitySlider');
    hueSlider.position(140, 200);

    //saturation slider
    satSlider = createSlider(0, 254, 60, 1);
    satSlider.class('qualitySlider');
    satSlider.position(140, 250);

    brightSlider = createSlider(1, 255, 255, 1);
    brightSlider.class('qualitySlider');
    brightSlider.position(140, 300);


}

function draw(){
  textSize(18);
  textAlign(RIGHT);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  background(map(hueSlider.value(),0,65535,0,360,true),map(satSlider.value(),0,254,0,100,true),map(brightSlider.value(),0,254,0,100,true))
  //text backgrounds
  fill(360,0,100, 60);
  rect(30,200, 100, 30, 5);
  rect(30,250, 100, 30, 5);
  rect(30,300, 100, 30, 5);

  //control text
  fill(0,0,0);
  text('Hue    ',120 , 220)
  text('Saturation', 120 , 270)
  text('Brightness',120, 320);

  //mode and state
  textSize(24);
  textAlign(LEFT);
  if(lightState){
    text("light is on", 180, 115);
  } else {
    text("light is off", 180, 115);
  }

  if(manualMode) {
    text("in manual mode", 180, 165);
  } else {
    text("in automatic mode", 180, 165);
  }

  if(hueSlider.value() != phueSlider || satSlider.value() != psatSlider || brightSlider.value() != pbrightSlider){
    changeLightColour();
    phueSlider = hueSlider.value();
    psatSlider = satSlider.value();
    pbrightSlider = brightSlider.value();
  }

}

function toggleLight(){
  let path = url + '/lights'
  httpDo(path, 'GET', toggleGetResponse);
}

function toggleMode(){
  manualMode = !manualMode;
  console.log(manualMode);
}

function toggleGetResponse(getData){
  let lights = JSON.parse(getData);
  lightState = lights["1"].state.on

  let body = {'on': !lightState};
  let path = url + '/lights/' + lightNo + '/state/'
  httpDo(path, 'PUT', body, togglePutData);

}

function togglePutData(putData){
  var response = JSON.stringify(putData);
  if (response.includes("success")){
    lightState = !lightState
  }
}

function changeLightColour(){
    var path = url + '/lights/' + lightNo + '/state';
    var body = {'bri': brightSlider.value(), 'sat': satSlider.value(),'hue': hueSlider.value()};
    var path = url + '/lights/' + lightNo + '/state/'
    httpDo(path, 'PUT', body, changeColourResponse);
  }

function changeColourResponse(){
  console.log('New Light values set');
}

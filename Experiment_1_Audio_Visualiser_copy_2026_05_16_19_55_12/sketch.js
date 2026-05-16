let mic;
let fftLine; // for the linear mode
let fftBars; // for the bar mode
let fftCircle; // for the circular mode
let amp; // for the amplitude mode
let mode = 0; // going to add in 4 visualiser types

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  mic = new p5.AudioIn(); // calls the p5 function 
  mic.start(); // starts the audio feed from the microphone
  
  // fft configurations below for each visualiser type, the first value being for the smoothening and the second one for the amount of frequency bins 
  fftLines = new p5.FFT(0.98, 1024); // for the line visualiser, I've entered a high smoothening value to make sure the lines don't look jagged, and added a high number of frequency bins to make the line look less like a rubber string
  fftLines.setInput(mic);
  
  fftBars = new p5.FFT(0.8, 64); // for the bar visualiser, the smoothening isn't as important since it's not a line, so I've kept it at a decent value, whereas I added only 64 freq. bins to allow for 64 bars to be displayed on screen
  fftBars.setInput(mic);
  
  fftCircle = new p5.FFT(0.98, 1024); // copy of the line visualiser, since the circle visualiser is just a line wrapped in the outline of a circle
  fftCircle.setInput(mic);
}

function keyPressed() { // functionality for going between modes
  if (key === '1') mode = 0; // the default linear mode
  if (key === '2') mode = 1; // bar mode
  if (key === '3') mode = 2; // circular mode
  if (key === '4') mode = 3; // amplitude mode
}

function monitorFrame() { // computer frame for aesthetic purposes
  noFill();
  
  stroke(45); // the grey outer bezel
  strokeWeight(30);
  rect(0, 0, width, height); 

  stroke(0, 200); // the black inner bezel
  strokeWeight(20);
  rect(20, 20, width - 40, height - 40); 
}

function guideText() { // text labelling as a guide for the modes
  fill(0, 255, 150);
  noStroke();
  textSize(16);
  textFont('Courier'); 
  textAlign(LEFT);
  
  text("1 - LINEAR 2 - BARS \n3 - CIRCULAR 4 - AMPLITUDE", 40, 80);
}

function CRTEffect() { // applied a crt monitor effect for aesthetic purposes, basically just thin semi- transparent black lines split across the screen
  stroke(0, 0, 0, 80);
  strokeWeight(3);
  
  for (let i = 0; i < height; i += 8) { 
    line(0, i, width, i);
 }
}

function lineform() { // the first mode
  let lineform = fftLines.waveform(); // calling the native p5 library waveform function
  
  beginShape();
  noFill();
  stroke(0, 255, 150);
  strokeWeight(3);

  for (let i = 0; i < lineform.length; i+=12) {
    let x = map(i, 0, lineform.length, 0, width);
    let y = map(lineform[i], -1, 1, height / 2 - 300, height / 2 + 300); // fancy code that dictates both the length of the line and the space by which it could occupy vertically ( when exposed to loud sound)
  
    if (i === 0 || i === lineform.length - 10) {
      curveVertex(x, y); // smoothening
    }
    curveVertex(x, y);
  }
  endShape();
}

function barform() { // the second mode
  let spectrum = fftBars.analyze(); // calling the native fft library function again
  
  // calculates the width of the bar based on the # of frequencies
  let barWidth = width / spectrum.length;

  for (let i = 0; i < spectrum.length; i++) {
    // ties the freq value to height
    let h = map(spectrum[i], 0, 255, 0, height / 2);
    
    // moves the bar base to the middle of the screen
    let x = i * barWidth;
    
    fill(0, 255, 150); 
    noStroke();
    
    // draws the bars, I've added an additional line underneath to add a mirror effect 
    rect(x, height / 2, barWidth - 2, -h / 2);
    rect(x, height / 2, barWidth - 2, h / 2);
  }
}

function circleform() { // the third mode
  push(); // only added push and pop to make sure that "translate" would move only the circle to the center of the screen, not do something silly like go out of bounds. I've spent half an hour trying to solve that
   translate(width / 2, height / 2); 
   let circleform = fftCircle.waveform(); // calling the native waveform function once more
  
   noFill();
   stroke(0, 255, 150);
   strokeWeight(3);

   beginShape(); // the circle, pretty much just a linear waveform that I've modified to be wrapped in a circular shape.
   for (let i = 0; i < circleform.length; i++) {
     let angle = map(i, 0, circleform.length, 0, 360);
    
     let minRadius = 50;
     let maxRadius = 170; 
    
     let r = map(circleform[i], -0.4, 0.4, minRadius, maxRadius);

     r = constrain(r, minRadius, maxRadius + 10); // manages the size of the circle when active

     let x = r * cos(radians(angle));
     let y = r * sin(radians(angle));
    
     vertex(x, y);
   }
   endShape(CLOSE);
  pop();
}

function ampform() { // the last mode, the amplitude circle
  let vol = mic.getLevel(); // takes the volume level from the microphone
  
  let d = map(vol, 0, 0.1, 100, 600); // ties the mic level to a presentable measure that'd be used for the circle itself
  
  noStroke();
  fill(0, 255, 150); 
  
  ellipse(width / 2, height / 2, d, d); // the circle itself
  
  fill(0, 50, 0);
  ellipse(width / 2, height / 2, d * 0.4, d * 0.4); // a smaller circle I've added within the bigger circle to make it look less boring.

}

function modeLabel() { // text at the bottom right corner that tells the user what mode they're currently on
  fill(0, 255, 150);
  noStroke();
  textSize(18);
  textFont('Courier');
  textAlign(RIGHT, BOTTOM);

  let x = width - 40;
  let y = height - 40;

  let modeNames = ['LINEAR', 'BARS', 'CIRCULAR', 'AMPLITUDE'];
  text("VISUALISER MODE: " + modeNames[mode], x, y);
}
  
function draw() { 
  background(0, 50, 0); // dark green bg
  
  switch (mode) { // should go between modes based on the numkey input from the user 
      case 0:
        lineform();
        break;
        
      case 1:
        barform();
        break;
        
      case 2: 
        circleform();
        break;
        
      case 3: 
        ampform();
        break;
  }
  CRTEffect(); // applies the monitor effect
  guideText(); // applies the guide text
  modeLabel(); // applies the mode label text
  monitorFrame(); // applies the bezels around the screen
}
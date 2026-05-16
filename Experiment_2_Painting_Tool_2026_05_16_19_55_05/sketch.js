let picker;
let isEraser = false;
let brushType;
let currentHue = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  picker = createColorPicker("black"); // colour picker GUI for changing brush colour, starts at black
  picker.position(0, 0); // I've put it at the top left corner for easy access
  
  colorMode(HSB, 360, 100, 100); // going to use this one for the rainbow brush tool

  eraser = createButton("Eraser: Off"); // eraser tool button
  eraser.position(0, 25); // positioned underneath the colour picker
  eraser.mousePressed(eraserToggle); // when pressed, registers the activity to the function mentioned (eraserToggle)
  
  brushType = 'pen'; // the default brush type upon running
  
  // informative text below
  textSize(14) 
  text('Switch between brushes by pressing number keys. 1 - Pen, 2 - Spray, 3 - Pencil, 4 - Rainbow', 55, 18); // positioning to keep it at the top and to the side of the buttons
}

function eraserToggle() {
  isEraser = !isEraser; // flips the state of the eraser tool

  if (isEraser) {
    eraser.html('Eraser: On'); // changes text when its on
  } else {
    eraser.html('Eraser: Off'); // changes text when its off
  }
}

function keyPressed() { // brush selection
  if (key === '1') brushType = 'pen';
  if (key === '2') brushType = 'spray';
  if (key === '3') brushType = 'pencil';
  if (key === '4') brushType = 'rainbow';
}

function draw() {
  if (mouseIsPressed) {
    if (isEraser) { // activates when eraser is toggled on
      stroke("white");
      
      strokeWeight(10); // Adjust for brush size
      line(pmouseX, pmouseY, mouseX, mouseY);
      
    } else { // goes when eraser is toggled off
      
      if (brushType == 'pen') {
        strokeWeight(10);
        line(pmouseX, pmouseY, mouseX, mouseY);
        stroke(picker.color()); // refers to the colour selected from the picker
      }
      
      else if (brushType == 'spray') {
         for (let i = 0; i < 25; i++) { // draws 25 dots spaced apart in a random manner to mimic the spray brush tool
           strokeWeight(2.5);
           let x = mouseX + random(-15, 15);
           let y = mouseY + random(-15, 15);
           point(x, y);
         }
      }
      
      else if (brushType == 'pencil') {
        strokeWeight(1);
        line(pmouseX, pmouseY, mouseX, mouseY);
        stroke(picker.color());
      }
      
      else if (brushType == 'rainbow') {
        stroke(currentHue, 100, 100); // i've learned from a tutorial that it's best to use HSB for rainbow stuff
        strokeWeight(10);
        line(pmouseX, pmouseY, mouseX, mouseY);
    
        currentHue = (currentHue + 5) % 360; // the added value increases the speed by which the brush will cycle colours
      }
    }
  }
}

let poemText = "I once met a traveler from an antique land who said: “Two vast and trunkless legs of stone stand in the desert... Near them, on the sand, Half sunk, a shattered visage lies, whose frown, And wrinkled lip, and sneer of cold command, Tell that its sculptor well those passions read Which yet survive, stamped on these lifeless things, The hand that mocked them, and the heart that fed: And on the pedestal these words appear: ‘My name is Ozymandias, king of kings: Look on my works, ye Mighty, and despair!’ Nothing beside remains. Round the decay Of that colossal wreck, boundless and bare The lone and level sands stretch far away."; // the text of the poem itself, to be laid over the reference image later
let words = [];
let wordIndex = 0; // variables for the word wrapping system I've implemented. This originally sets the index to 0, and would count upward as more words are tracked over.

function preload() {
  font = loadFont('CourierPrime-Bold.ttf'); // text font I've found on Google Fonts 
  refImg = loadImage('obelisk.png'); // the reference image
}

function setup() {
  createCanvas(500, 800); // vertical canvas to fit the image
  background(0); // set it dark for aesthetic purposes
  refImg.resize(width, height); // resizing the image to fit with the canvas
  
  textAlign(LEFT, CENTER); // text starts from the left
  textSize(13.5); 
  textFont(font); // uses the font from earlier
  noLoop(); 
  words = poemText.split(" ");
}

function draw() {
 push(); // title texts set in their own bubble for differing 
  textAlign(CENTER, CENTER); // aligns the text down the middle
  
  textSize(28);
  fill(255);
  text("OZYMANDIAS", 250, 80); // main title text
 pop();

  let currentX = 8; // starting horizontal line point
  let currentY = 8; // starting vertical line point
  let lineHeight = 18; // spacing between lines
  let spaceWidth = 8; // gap between words

  while (currentY < height) {   // go through line rows from top - bottom
    
    if (wordIndex >= words.length) { // stops the printing process once all the words in the poem have finished
      break;
    }
    
    let currentWord = words[wordIndex];
    let wordW = textWidth(currentWord);
    
    if (currentX + wordW > width - 10) { // checks if the word pushes past the border of the image, and kicks it down to the next line if so
      currentX = 10;
      currentY += lineHeight;
      continue; 
    }
    
    // calculates the four corner boundaries of a specific whole wordbox
    let wordLeft   = currentX;
    let wordRight  = currentX + wordW;
    let wordTop    = currentY - lineHeight / 2;
    let wordBottom = currentY + lineHeight / 2;
    
    // samples the hidden silhouette asset transparency channels at all 4 word box corners
    let aTopLeft     = alpha(refImg.get(wordLeft, wordTop));
    let aTopRight    = alpha(refImg.get(wordRight, wordTop));
    let aBottomLeft  = alpha(refImg.get(wordLeft, wordBottom));
    let aBottomRight = alpha(refImg.get(wordRight, wordBottom));
    
    // reveals the text only when it is within the borders based on the reference image, pretty important part of the whole thing
    if (aTopLeft > 240 && aTopRight > 240 && aBottomLeft > 240 && aBottomRight > 240) {
      
      fill(255);
      noStroke();
      
      // draws the word onto the canvas
      text(currentWord, currentX, currentY);
      
      // moves on to the next word
      currentX += wordW + spaceWidth;
      wordIndex++; 
      
    } else { // fancy code failsafes below
      currentX += 3; // slides horizontal cursor right by 3 px to test next spot if the word hits transparent space
      
      if (currentX > width - 10) { // if sliding pushes past the right boundary, force move down to the next row line
        currentX = 10;
        currentY += lineHeight;
      }
    }
  }
}
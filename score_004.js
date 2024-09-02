let audioElement, fft;

function setup() {
  // Create a canvas that will be placed in the existing HTML container
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('audioCanvas'); // Attach the canvas to the container with id 'audioCanvas'

  // Select the HTML audio element
  audioElement = document.getElementById('audio-player');

  // Create a p5.MediaElement from the audio element
  let audio = new p5.MediaElement(audioElement);

  // Initialize FFT for frequency analysis
  fft = new p5.FFT();
  fft.setInput(audio);

  noFill();
}

function draw() {
  background(0);

  // Get the frequency spectrum data
  let spectrum = fft.analyze();

  // Draw the waveform
  stroke(255);
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    vertex(x, y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

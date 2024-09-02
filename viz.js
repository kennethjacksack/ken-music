function setup() {
    // Create a p5.js canvas and attach it to the container with id 'audioCanvas'
    const canvas = createCanvas(600, 300); // Increased height for better visualization
    canvas.parent('audioCanvas'); // Attach canvas to the container
    background(0);
    stroke(255);
}

function draw() {
    background(0);

    if (window.waveformAnalyser) {
        let waveform = window.waveformAnalyser.getValue();
        noFill();
        stroke(255);

        beginShape();
        for (let i = 0; i < waveform.length; i++) {
            // Map x to fit the canvas width
            let x = map(i, 0, waveform.length, 0, width);
            // Map y to fit the canvas height
            let y = map(waveform[i], -1, 1, height, 0);
            vertex(x, y);
        }
        endShape();
    }
}

// Ensure p5 is initialized
document.addEventListener('DOMContentLoaded', () => {
    if (typeof p5 === 'undefined') {
        new p5();
    }
});

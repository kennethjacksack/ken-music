document.addEventListener('DOMContentLoaded', () => {
    const sineButton = document.getElementById('sineButton');
    const squareButton = document.getElementById('squareButton');
    const triangleButton = document.getElementById('triangleButton');
    const sawtoothButton = document.getElementById('sawtoothButton');
    const frequencySlider = document.getElementById('frequencySlider');
    const frequencyValue = document.getElementById('frequencyValue');
    const gainSlider = document.getElementById('gainSlider');
    const gainValue = document.getElementById('gainValue');

    // Create a waveform analyser
    const waveformAnalyser = new Tone.Waveform(1024);

    // Create a sine oscillator (default type)
    let oscillator = new Tone.Oscillator({
        frequency: 261.63, // Middle C
        type: 'sine'
    });

    // Create a gain node for adjusting volume
    let gainNode = new Tone.Gain(0.1).toDestination(); // Initial gain

    // Connect the oscillator to the gain node, and the gain node to the waveform analyser
    oscillator.connect(gainNode);
    gainNode.connect(waveformAnalyser);

    oscillator.start(); // Start the oscillator immediately

    // Expose the analyser globally for viz.js
    window.waveformAnalyser = waveformAnalyser;

    // Function to change waveform type
    function changeWaveform(type) {
        oscillator.type = type;
    }

    // Button event listeners to change the waveform
    sineButton.addEventListener('click', () => changeWaveform('sine'));
    squareButton.addEventListener('click', () => changeWaveform('square'));
    triangleButton.addEventListener('click', () => changeWaveform('triangle'));
    sawtoothButton.addEventListener('click', () => changeWaveform('sawtooth'));

    // Frequency slider event listener
    frequencySlider.addEventListener('input', () => {
        const frequency = parseFloat(frequencySlider.value);
        oscillator.frequency.value = frequency;
        frequencyValue.textContent = `${frequency} Hz`;
    });

    // Gain slider event listener
    gainSlider.addEventListener('input', () => {
        const gainDb = parseFloat(gainSlider.value);
        const gainValueLinear = Math.pow(10, gainDb / 20); // Convert dB to linear scale
        gainNode.gain.value = gainValueLinear;
        gainValue.textContent = `${gainDb} dB`;
    });
});

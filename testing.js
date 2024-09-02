document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas1');
    const audio = document.getElementById('audio-player'); // Updated ID to match the HTML
    const ctx = canvas.getContext('2d');

    // Set up the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 6; // Set height to half the viewport height

    // Set up the audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Visualization parameters
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Start visualization
    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            ctx.fillStyle = 'white';
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    }

    // Start audio and visualizer
    async function startAudio() {
        try {
            await audioContext.resume(); // Resume audio context if it's suspended
            audio.play(); // Start audio playback
            draw(); // Start visualization
        } catch (error) {
            console.error('Error starting audio or visualizer:', error);
        }
    }

    // Automatically start the audio context and playback
    startAudio();

    // Additional event listener to handle user interaction if required
    document.addEventListener('click', startAudio);
});

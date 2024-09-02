document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const progressBar = document.getElementById('progress-bar');
    const shapes = document.querySelectorAll('.background-shapes .shape');

    // Create elements to display time markers
    const timeDisplay = document.createElement('div');
    timeDisplay.classList.add('time-display');
    document.querySelector('.container').appendChild(timeDisplay);

    // Format time as mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update progress bar and time markers as the audio plays
    audioPlayer.addEventListener('timeupdate', function() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progress = (currentTime / duration) * 100;
        
        progressBar.value = progress;
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    });

    // Seek the audio when the progress bar is clicked
    progressBar.addEventListener('input', function() {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // Play button functionality
    playButton.addEventListener('click', function() {
        audioPlayer.play();
        shapes.forEach(shape => shape.style.opacity = 1); // Start animation
    });

    // Pause button functionality
    pauseButton.addEventListener('click', function() {
        audioPlayer.pause();
    });
});

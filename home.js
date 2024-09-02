document.addEventListener('DOMContentLoaded', () => {
    const shuffleButton = document.getElementById('shuffleButton');
    const stopButton = document.getElementById('stopButton');

    // List of song filenames in the folder
    const songs = [
        'Butterfly.wav',
        'Find A Way.mp3',
        'Pulse Control A.wav',
        'Liminal Piano.mp3'
        // Add other song filenames here
    ];

    let audio = null;
    let isPlaying = false;
    let lastPlayedSong = null; // Variable to store the last played song
    let secondToLastPlayedSong = null; // Variable to store the second-to-last played song

    // Function to play a random song
    function playRandomSong() {
        let randomSong;

        // Ensure the new song is different from the last two played songs
        do {
            randomSong = songs[Math.floor(Math.random() * songs.length)];
        } while (randomSong === lastPlayedSong || randomSong === secondToLastPlayedSong);

        // Stop current audio if playing
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        // Create a new audio element
        audio = new Audio(`music/${randomSong}`);

        // Play the audio
        audio.play();
        isPlaying = true;

        // Update the last played songs
        secondToLastPlayedSong = lastPlayedSong;
        lastPlayedSong = randomSong;

        shuffleButton.classList.add('active');

        // Handle audio playback errors
        audio.onerror = () => {
            console.error('Failed to load or play the audio file.');
        };
    }

    // Function to stop the current audio
    function stopAudio() {
        if (audio && isPlaying) {
            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            shuffleButton.classList.remove('active');
        }
    }

    // Shuffle button click event
    shuffleButton.addEventListener('click', () => {
        if (isPlaying) {
            stopAudio(); // Stop if currently playing
        }
        playRandomSong(); // Play a new random song
    });

    // Stop button click event
    stopButton.addEventListener('click', () => {
        stopAudio(); // Stop the audio
    });
});
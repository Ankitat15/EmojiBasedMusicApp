// script.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const songList = document.getElementById('songList');
    const playlist = document.getElementById('playlist');
    const nowPlaying = document.getElementById('nowPlaying');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const volumeControl = document.getElementById('volumeControl');
    const volumeIcon = document.getElementById('volumeIcon');

    let currentAudio = null;

    // Mock API URL (replace with a real API like Spotify, Deezer, etc.)
    const API_URL = 'https://api.example.com/songs'; // Replace with actual API endpoint

    // Fetch songs from API
    async function fetchSongs(query = '') {
        try {
            const response = await fetch(`${API_URL}?q=${query}`);
            const data = await response.json();
            return data.songs; // Adjust based on API response structure
        } catch (error) {
            console.error('Error fetching songs:', error);
            return [];
        }
    }

    // Display songs
    async function displaySongs(query = '') {
        const songs = await fetchSongs(query);
        songList.innerHTML = '';
        songs.forEach(song => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${song.title} 🎵 - ${song.artist}</span>
                <button onclick="addToPlaylist('${song.id}', '${song.title}', '${song.artist}', '${song.url}')">➕ Add to Playlist</button>
            `;
            songList.appendChild(li);
        });
    }

    // Add song to playlist
    window.addToPlaylist = (id, title, artist, url) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${title} 🎶 - ${artist}</span>
            <button onclick="playSong('${url}', '${title}', '${artist}')">▶️ Play</button>
            <button onclick="removeFromPlaylist('${id}')">❌ Remove</button>
        `;
        playlist.appendChild(li);
    };

    // Remove song from playlist
    window.removeFromPlaylist = (id) => {
        const li = document.querySelector(`#playlist li button[onclick="removeFromPlaylist('${id}')"]`).parentElement;
        li.remove();
    };

    // Play song
    window.playSong = (url, title, artist) => {
        if (currentAudio) {
            currentAudio.pause();
        }
        currentAudio = new Audio(url);
        currentAudio.play();
        nowPlaying.textContent = `🎶 Now Playing: ${title} - ${artist}`;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    };

    // Play/Pause button
    playPauseBtn.addEventListener('click', () => {
        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else if (currentAudio) {
            currentAudio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    // Stop button
    stopBtn.addEventListener('click', () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            nowPlaying.textContent = '';
        }
    });

    // Volume control
    volumeControl.addEventListener('input', () => {
        if (currentAudio) {
            currentAudio.volume = volumeControl.value;
            volumeIcon.textContent = volumeControl.value == 0 ? '🔇' : '🔊';
        }
    });

    // Search functionality
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        displaySongs(query);
    });

    // Initial display of songs
    displaySongs();
});
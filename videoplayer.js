const overlay = document.getElementById('videoOverlay');
const player = document.getElementById('customPlayer');
const closeBtn = document.getElementById('closePlayerBtn');

const playPauseBtn = document.getElementById('playPauseBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const progressBar = document.querySelector('.progress-bar');
const progressFilled = document.querySelector('.progress-filled');
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.querySelector('.settings-menu');
const qualityMenu = document.getElementById('qualityMenu');
const speedMenu = document.getElementById('speedMenu');

let currentVideoSrcs = { auto: '' };

// Наведение и клик по карточкам

document.querySelectorAll('.work-item').forEach(item => {
    const wrapper = item.querySelector('.video-wrapper');
    const videoEl = item.querySelector('video.video-element');
    const posterImg = item.querySelector('img.video-poster');
    const videoSrc = item.dataset.video;

    if (!wrapper || !videoEl || !posterImg || !videoSrc) return;

    wrapper.addEventListener('mouseenter', () => {
        wrapper.classList.add('playing');
        videoEl.currentTime = 0;
        videoEl.play();
    });

    wrapper.addEventListener('mouseleave', () => {
        videoEl.pause();
        wrapper.classList.remove('playing');
    });

    item.addEventListener('click', () => {
        currentVideoSrcs = {
            auto: videoSrc,
            '360': videoSrc.replace('.mp4', '_360.mp4'),
            '480': videoSrc.replace('.mp4', '_480.mp4'),
            '720': videoSrc.replace('.mp4', '_720.mp4'),
            '1080': videoSrc.replace('.mp4', '_1080.mp4')
        };

        setQuality('auto');
        overlay.classList.remove('hidden');
        player.play();
    });
});

closeBtn.addEventListener('click', () => {
    player.pause();
    player.src = '';
    overlay.classList.add('hidden');
});

playPauseBtn.addEventListener('click', () => {
    if (player.paused) {
        player.play();
    } else {
        player.pause();
    }
});



player.addEventListener('play', () => {
    playPauseBtn.innerHTML = `<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
});

player.addEventListener('pause', () => {
    playPauseBtn.innerHTML = `<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>`;
});

function updatePlayButtonIcon(isPlaying) {
    playPauseBtn.innerHTML = isPlaying
        ? `<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>`
        : `<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><polygon points="8,5 19,12 8,19"/></svg>`;
}

player.addEventListener('play', () => {
    updatePlayButtonIcon(true);
});

player.addEventListener('pause', () => {
    updatePlayButtonIcon(false);
});


player.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(player.duration);
});

player.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(player.currentTime);
    progressFilled.style.width = `${(player.currentTime / player.duration) * 100}%`;
});

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    player.currentTime = percent * player.duration;
});

const playerBox = document.querySelector('.player-box');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        playerBox.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});


settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle('hidden');
});

document.addEventListener('click', () => {
    settingsMenu.classList.add('hidden');
});

qualityMenu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
        qualityMenu.querySelectorAll('li').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const quality = item.dataset.quality;
        switchQuality(quality);
    });
});

speedMenu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
        speedMenu.querySelectorAll('li').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        player.playbackRate = parseFloat(item.dataset.speed);
    });
});

function setQuality(quality) {
    if (quality === 'auto') {
        player.src = currentVideoSrcs.auto;
    } else {
        player.src = currentVideoSrcs[quality] || currentVideoSrcs.auto;
    }
    player.play();
}

function switchQuality(quality) {
    const currentTime = player.currentTime;
    player.src = currentVideoSrcs[quality] || currentVideoSrcs.auto;
    player.currentTime = currentTime;
    player.play();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const clickOverlay = document.getElementById('videoClickOverlay');
const centerIcon = document.createElement('div');
centerIcon.classList.add('center-icon');
player.parentElement.appendChild(centerIcon);

clickOverlay.addEventListener('click', () => {
    if (player.paused) {
        player.play();
        showCenterIcon('play');
    } else {
        player.pause();
        showCenterIcon('pause');
    }
});

function showCenterIcon(type) {
    centerIcon.classList.remove('play', 'pause');
    void centerIcon.offsetWidth; // trigger reflow
    centerIcon.classList.add(type);
    centerIcon.style.opacity = '1';
    setTimeout(() => {
        centerIcon.style.opacity = '0';
    }, 600);
}

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('customPlayer');
    const volumeSlider = document.querySelector('.volume-slider input[type="range"]');
    const volumePercentage = document.querySelector('.volume-percentage'); // если есть

    if (!video || !volumeSlider) return;

    // Начальная громкость 100%
    video.volume = 1.0;
    volumeSlider.value = 100;
    if (volumePercentage) volumePercentage.textContent = '100%';

    // При изменении слайдера меняем громкость и % рядом
    volumeSlider.addEventListener('input', () => {
        const vol = volumeSlider.value;
        video.volume = vol / 100;
        if (volumePercentage) volumePercentage.textContent = vol + '%';
    });
});

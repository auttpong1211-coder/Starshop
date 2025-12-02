// --- Theme Toggler ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

const setThemeIcon = (isDarkMode) => {
    if (isDarkMode) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
};

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    setThemeIcon(true);
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    setThemeIcon(isDarkMode);
});

// --- Particle Toggler ---
const particleToggle = document.getElementById('particle-toggle');
if (particleToggle) {
    const particleIcon = particleToggle.querySelector('i');

    if (localStorage.getItem('particles') === 'off') {
        body.classList.add('particles-off');
        particleIcon.style.color = '#aaa'; // Set icon to grey if off
    }

    particleToggle.addEventListener('click', () => {
        body.classList.toggle('particles-off');
        const areParticlesOff = body.classList.contains('particles-off');
        localStorage.setItem('particles', areParticlesOff ? 'off' : 'on');
        particleIcon.style.color = areParticlesOff ? '#aaa' : ''; // Reset color or set to grey
    });
}


// --- Music Player ---
const musicToggleElem = document.getElementById('music-toggle');
const bgMusicElem = document.getElementById('bg-music');
const volumeSliderElem = document.getElementById('volume-slider');

if (musicToggleElem && bgMusicElem && volumeSliderElem) {
    const musicIcon = musicToggleElem.querySelector('i');
    let isMusicPlaying = false;
    let currentSongIndex = 0;

    const playlist = ["music/Jazz-cafe.mp3", "music/Jazz-cafe 3.mp3"];

    const setVolume = () => {
        const volume = volumeSliderElem.value / 100;
        bgMusicElem.volume = volume;
        if (!isMusicPlaying) return;

        if (volume === 0) musicIcon.className = 'fas fa-volume-xmark';
        else if (volume < 0.5) musicIcon.className = 'fas fa-volume-low';
        else musicIcon.className = 'fas fa-volume-high';
    };

    const playNextSong = () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        bgMusicElem.src = playlist[currentSongIndex];
        bgMusicElem.play();
    };

    bgMusicElem.addEventListener('ended', playNextSong);

    const toggleMusic = () => {
        if (isMusicPlaying) {
            bgMusicElem.pause();
            isMusicPlaying = false;
            musicIcon.className = 'fas fa-volume-xmark';
        } else {
            bgMusicElem.play();
            isMusicPlaying = true;
            setVolume();
        }
    };

    musicToggleElem.addEventListener('click', toggleMusic);
    volumeSliderElem.addEventListener('input', setVolume);

    const startMusicOnFirstInteraction = () => {
        if (isMusicPlaying || (bgMusicElem.currentTime > 0 && !bgMusicElem.paused)) return;
        bgMusicElem.play().then(() => { isMusicPlaying = true; setVolume(); }).catch(error => console.error("Autoplay prevented:", error));
        document.body.removeEventListener('click', startMusicOnFirstInteraction, true);
    };

    document.body.addEventListener('click', startMusicOnFirstInteraction, true);

    bgMusicElem.src = playlist[currentSongIndex];
    bgMusicElem.volume = volumeSliderElem.value / 100;
}


// --- News Modal ---
const modal = document.getElementById('news-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = modal ? modal.querySelector('.modal-close') : null;
const readMoreBtns = document.querySelectorAll('.read-more-btn');

const openModal = (title, content) => {
    modalTitle.textContent = title;
    modalBody.textContent = content;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
};

const closeModal = () => {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
};

readMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = e.target.closest('.news-card');
        const title = card.dataset.title;
        const content = card.dataset.content;
        openModal(title, content);
    });
});

// Ensure modal-related event listeners are only added if the modal exists
if (modal) {
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}


// --- Image Modal (for shop.html) ---
const imageModal = document.getElementById('image-modal');
if (imageModal) {
    const modalImage = document.getElementById('modal-image');
    const productImages = document.querySelectorAll('.product-image');
    const closeImageModalBtn = document.querySelector('.image-modal-close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const imageCounter = document.getElementById('image-counter');
    let currentImageIndex;

    productImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.preventDefault(); // ป้องกันพฤติกรรมเริ่มต้นของเบราว์เซอร์
            imageModal.classList.add('active');
            currentImageIndex = index;
            showImage(currentImageIndex); // Use showImage to also update counter
        });
    });

    const closeImageModal = () => {
        imageModal.classList.add('closing'); // Add class to trigger close animation
        setTimeout(() => {
            imageModal.classList.remove('active');
            imageModal.classList.remove('closing'); // Clean up class
            document.body.classList.remove('modal-open');
        }, 400); // Match animation duration
    };

    const showImage = (index) => {
        modalImage.src = productImages[index].src;
        imageCounter.textContent = `${index + 1} / ${productImages.length}`;
        document.body.classList.add('modal-open'); // Ensure body class is set
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : productImages.length - 1;
        showImage(currentImageIndex);
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex < productImages.length - 1) ? currentImageIndex + 1 : 0;
        showImage(currentImageIndex);
    };

    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
        if (!imageModal.classList.contains('active')) return; // Do nothing if modal is not active

        if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'Escape') {
            closeImageModal();
        }
    });

    closeImageModalBtn.addEventListener('click', closeImageModal);

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) { // Close if clicking on the background
            closeImageModal();
        }
    });
}
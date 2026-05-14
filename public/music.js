document.addEventListener('DOMContentLoaded', () => {
    // Prevent script from running multiple times on the same page
    if (document.getElementById('musicToggle')) {
        return;
    }

    // 1. Create Audio and Button elements
    const bgMusic = document.createElement('audio');
    bgMusic.id = 'bgMusic';
    bgMusic.loop = true;
    const source = document.createElement('source');
    source.src = 'mythic-bg.mp3';
    source.type = 'audio/mpeg';
    bgMusic.appendChild(source);
    bgMusic.appendChild(document.createTextNode('Tarayıcınız ses dosyasını desteklemiyor.'));

    const musicToggle = document.createElement('button');
    musicToggle.id = 'musicToggle';
    musicToggle.title = 'Müzik Aç/Kapat';

    // Apply styles to the button
    Object.assign(musicToggle.style, {
        position: 'fixed',
        bottom: '25px',
        left: '30px',
        zIndex: '999',
        background: 'rgba(11,12,16,0.8)',
        border: '1px solid #c5a880',
        color: '#c5a880',
        padding: '10px',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '50px',
        height: '50px',
        fontSize: '18px',
        transition: '0.3s'
    });

    document.body.append(bgMusic, musicToggle);

    // 2. State management functions
    const updateButton = () => {
        musicToggle.textContent = bgMusic.paused ? '🔇' : '🎵';
    };

    const saveState = () => {
        sessionStorage.setItem('musicTime', bgMusic.currentTime);
        sessionStorage.setItem('musicPlaying', !bgMusic.paused);
    };

    const loadState = () => {
        const musicTime = sessionStorage.getItem('musicTime');
        const musicPlaying = sessionStorage.getItem('musicPlaying') === 'true';

        // Wait for metadata to be ready to set currentTime
        bgMusic.addEventListener('loadedmetadata', () => {
            if (musicTime) {
                bgMusic.currentTime = parseFloat(musicTime);
            }
            if (musicPlaying) {
                bgMusic.play().catch(e => {
                    console.warn("Müzik otomatik başlatılamadı. Kullanıcı etkileşimi gerekiyor.", e);
                    updateButton(); // Show as paused
                });
            }
        }, { once: true });

        // If metadata is already loaded, fire the event manually
        if (bgMusic.readyState >= 1) {
            bgMusic.dispatchEvent(new Event('loadedmetadata'));
        }
        
        updateButton();
    };

    // 3. Event Listeners
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.error("Müzik çalınamadı:", e));
        } else {
            bgMusic.pause();
        }
    });

    bgMusic.addEventListener('play', updateButton);
    bgMusic.addEventListener('pause', updateButton);

    window.addEventListener('beforeunload', saveState);

    // 4. Initial Load
    loadState();
});
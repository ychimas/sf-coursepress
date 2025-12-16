// JavaScript
export function init() {
    // Cargar iframe inicial (video 1)
    loadIframe({
        id: 'Slide1_5Web',
        src: 'https://iframe.mediadelivery.net/embed/516177/439767a9-793d-4267-8bef-9713f9736fec?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-vertical-web',
        style: 'width: 20vw; height: 80vh; min-height: 300px;',
    });

    loadIframe({
        id: 'Slide1_5Mobile',
        src: 'https://iframe.mediadelivery.net/embed/516177/439767a9-793d-4267-8bef-9713f9736fec?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-vertical-mobile',
        style: 'width: 20vw; height: 80vh; min-height: 300px;',
    });

    // URLs de los 4 videos
    const videoUrls = {
        '1': 'https://iframe.mediadelivery.net/embed/516177/439767a9-793d-4267-8bef-9713f9736fec?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        '2': 'https://iframe.mediadelivery.net/embed/516177/e0b6836a-ed15-4d4b-a899-95d9e8f81772?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        '3': 'https://iframe.mediadelivery.net/embed/516177/282180c1-6b29-46c3-b38f-e80fa6450e6b?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        '4': 'https://iframe.mediadelivery.net/embed/516177/f6ea0524-d23a-4fbb-a6c9-88ab98279d64?autoplay=false&loop=false&muted=false&preload=true&responsive=true'
    };


    const circles = document.querySelectorAll('.step-circle1_5');
    const contents = document.querySelectorAll('.step-content1_5');

    function activateStep(targetStep) {
        const targetContent = document.getElementById(`content-${targetStep}`);

        // Remover active de todos los círculos y contenidos
        circles.forEach(c => c.classList.remove('active'));
        contents.forEach(content => {
            content.classList.remove('active');
            content.classList.add('collapsed');
        });

        // Activar el paso seleccionado
        circles.forEach(c => {
            if (c.getAttribute('data-target') === targetStep) {
                c.classList.add('active');
            }
        });
        targetContent.classList.remove('collapsed');
        targetContent.classList.add('active');

        // Cambiar el iframe según el paso seleccionado
        const iframeContainer = document.getElementById('Slide1_5Web');
        if (iframeContainer && videoUrls[targetStep]) {
            iframeContainer.innerHTML = '<div class="loader spinner-pulse"></div>';
            loadIframe({
                id: 'Slide1_5Web',
                src: videoUrls[targetStep],
                className: 'iframe-video-vertical-web',
                style: 'width: 20vw; height: 80vh; min-height: 300px;',
            });

            loadIframe({
                id: 'Slide1_5Mobile',
                src: videoUrls[targetStep],
                className: 'iframe-video-vertical-mobile',
                style: 'width: 20vw; height: 80vh; min-height: 300px;',
            });
        }

        // Pausar todos los audios
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });

        // Autoplay del audio para todos los pasos cuando se hace clic
        const targetAudio = targetContent.querySelector('audio');
        if (targetAudio) {
            setTimeout(() => {
                targetAudio.play().catch(e => console.log('Autoplay prevented:', e));
            }, 100);
        }
    }

    // Event listeners para círculos
    circles.forEach(circle => {
        circle.addEventListener('click', function () {
            const targetStep = this.getAttribute('data-target');
            activateStep(targetStep);
        });
    });



    // Accesibilidad con teclado
    circles.forEach(circle => {
        circle.setAttribute('tabindex', '0');
        circle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}
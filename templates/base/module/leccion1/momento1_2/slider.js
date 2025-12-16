export function init() {
    loadIframe({
        id: 'Slide1_2Web',
        src: 'https://iframe.mediadelivery.net/embed/516177/b6f1d43d-0a0d-430f-b733-cdbe61b2d4fc?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-horizontal-web',
        style: 'width: 37vw; height: 52vh; min-height: 300px;',
    });

    loadIframe({
        id: 'Slide1_2Mobile',
        src: 'https://iframe.mediadelivery.net/embed/516177/b6f1d43d-0a0d-430f-b733-cdbe61b2d4fc?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-horizontal-mobile',
        style: 'width: 37vw; height: 52vh; min-height: 300px;',
    });

    // Funcionalidad para mostrar descripciones al hacer clic
    document.querySelectorAll('.flow-step').forEach(step => {
        step.addEventListener('click', function () {
            const stepNumber = this.dataset.step;
            const description = document.getElementById(`desc-${stepNumber}`);
            const timelineContainer = document.querySelector('.timeline-container');

            // Ocultar todas las descripciones
            document.querySelectorAll('.step-description').forEach(desc => {
                desc.classList.remove('show');
            });

            // Posicionar la descripción a la derecha del paso clickeado
            if (window.innerWidth <= 768) {
                const stepRect = this.getBoundingClientRect();
                const containerRect = timelineContainer.getBoundingClientRect();
                const relativeTop = stepRect.top - containerRect.top;
                description.style.top = relativeTop + 'px';
            }

            // Mostrar la descripción correspondiente
            description.classList.add('show');
            
            // Activar el layout móvil (mover timeline a la izquierda)
            timelineContainer.classList.add('active');
        });
    });
}
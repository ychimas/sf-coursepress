export function init() {
    const cards = document.querySelectorAll('.karin-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Evitar volteo si se hace clic en elementos de audio o transcripción
            if (e.target.closest('audio, .transcription-toggle, .audio-center')) {
                return;
            }
            
            // Pausar todos los audios antes de cambiar de card
            const audios = document.querySelectorAll('audio');
            audios.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            
            // Si esta carta ya está volteada, voltearla de vuelta
            if (this.classList.contains('flipped')) {
                this.classList.remove('flipped');
                return;
            }
            
            // Voltear todas las cartas de vuelta
            cards.forEach(c => c.classList.remove('flipped'));
            
            // Voltear la carta clickeada
            this.classList.add('flipped');
        });
    });
}
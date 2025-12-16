// Control para que solo un audio suene a la vez
export function init() {
    const audios = document.querySelectorAll('audio');

    audios.forEach(audio => {
        audio.addEventListener('play', function () {
            // Pausar todos los otros audios cuando uno empiece a reproducirse
            audios.forEach(otherAudio => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });
        });
    });

}

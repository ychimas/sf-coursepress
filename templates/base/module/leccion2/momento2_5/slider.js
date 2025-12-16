export function init() {
    function showContentEquiposEpp(opcion) {
        // Parar todos los audios antes de cambiar de contenido
        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });

        // Elimina la clase "active_tipos_acoso" de todos los botones y contenidos
        document.querySelectorAll('.buttons_tipos_acoso button').forEach(btn => btn.classList.remove('active_tipos_acoso'));
        document.querySelectorAll('.content_tipos_acoso').forEach(content => content.classList.remove('active_tipos_acoso'));

        // Activa el botón y el contenido correspondiente
        document.getElementById(`boton${opcion}_tipos_acoso`).classList.add('active_tipos_acoso');
        document.getElementById(`contenido${opcion}_tipos_acoso`).classList.add('active_tipos_acoso');
    }



    // Exponer funciones globalmente
    window.showContentEquiposEpp = showContentEquiposEpp;
}


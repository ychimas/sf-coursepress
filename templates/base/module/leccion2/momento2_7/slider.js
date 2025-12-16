export function init() {

    let isUnlocked = false; // Candado para controlar la reproducción del audio inicial

    // Datos de la información
    const infoDataMom3Sld11 = {
        1: {
            text: "<strong>1. Cliente o Usuario</strong>",
            audio: "./momento2_7/audio/Ejemplo_violencia_1_ppt20.mp3",
            transcripcion: [
                { "end": 2.16, "start": 0, "text": "Cliente o usuario agresión física." },
                { "end": 6.3, "start": 2.74, "text": "Un cliente insatisfecho, en un supermercado o banco," },
                { "end": 9.62, "start": 6.82, "text": "golpea o empuja a un cajero o ejecutivo." }
            ]
        },
        2: {
            text: "<strong>2. Cliente o Usuario</strong>",
            audio: "./momento2_7/audio/Ejemplo_violencia_2_ppt20.mp3",
            transcripcion: [
                { "end": 2.22, "start": 0, "text": "Cliente o usuario amenaza verbal grave." },
                { "end": 9.02, "start": 2.96, "text": "Un paciente o un familiar de un paciente, en un centro de salud, grita e insulta gravemente" },
                { "end": 13.86, "start": 9.02, "text": "a un técnico de enfermería amenazándolo con represalias fuera del trabajo." }
            ]
        },
        3: {
            text: "<strong>3. Proveedor o Repartidor</strong>",
            audio: "./momento2_7/audio/Ejemplo_violencia_3_ppt20.mp3",
            transcripcion: [
                { "end": 2.8, "start": 0, "text": "Proveedor o repartidor intimidación o amenazas." },
                { "end": 8.12, "start": 3.38, "text": "Un conductor de reparto al tener un problema con el encargado de bodega de la empresa," },
                { "end": 13.84, "start": 8.46, "text": "lo acorrala y le grita con uso de garabatos, amenazando con causarle un daño físico." }
            ]
        },
        4: {
            text: "<strong>4. Persona ajena (Vándalo o Ladrón)</strong>",
            audio: "./momento2_7/audio/Ejemplo_violencia_4_ppt20.mp3",
            transcripcion: [
                { "end": 2.12, "start": 0, "text": "Persona ajena, vándalo o ladrón." },
                { "end": 4.98, "start": 2.88, "text": "Asalto o Robo con violencia." },
                { "end": 8.98, "start": 5.82, "text": "Un trabajador es asaltado y agredido físicamente," },
                { "end": 11.74, "start": 9.4, "text": "mientras realiza funciones de venta en la calle," },
                { "end": 14.32, "start": 12.1, "text": "o mientras abre o cierra el establecimiento." }
            ]
        },
        5: {
            text: "<strong>5. Visitante</strong>",
            audio: "./momento2_7/audio/Ejemplo_violencia_5_ppt20.mp3",
            transcripcion: [
                { "end": 2.5, "start": 0, "text": "Visitante, daño material y riesgo." },
                { "end": 8.5, "start": 3.06, "text": "Una visita a las instalaciones de la empresa entra en cólera durante una negociación y" },
                { "end": 13.86, "start": 8.5, "text": "lanza objetos, rompiendo equipos y poniendo en riesgo la integridad física de los empleados" },
                { "end": 14.66, "start": 13.86, "text": "presentes." }
            ]
        }
    };

    // Función para cambiar la información
    function changeInfo(buttonId, autoplay = false) {
        const infoText = document.getElementById('info-text-mom3-11');
        const audioPlayer = document.getElementById('audioPlayer-mom3-11');
        const data = infoDataMom3Sld11[buttonId];

        if (infoText && data) {
            infoText.innerHTML = data.text;
        }

        if (audioPlayer && data) {
            // Pausar el audio actual
            audioPlayer.pause();

            // Limpiar transcripción activa
            const transcripcionGlobal = document.getElementById('transcripcion-global');
            if (transcripcionGlobal) {
                transcripcionGlobal.style.display = 'none';
                transcripcionGlobal.innerHTML = '';
            }

            // Cambiar la fuente del audio
            audioPlayer.src = data.audio;

            // Actualizar transcripción
            audioPlayer.setAttribute('data-transcripcion', JSON.stringify(data.transcripcion));

            // Cargar el nuevo audio
            audioPlayer.load();

            // Reproducir automáticamente si se solicita
            if (autoplay) {
                audioPlayer.addEventListener('canplaythrough', function () {
                    audioPlayer.play().catch(e => console.log('Error al reproducir:', e));
                }, { once: true });
            }

            // Limpiar eventos anteriores del botón de transcripción
            const transcriptionToggle = document.querySelector('.transcription-toggle');
            if (transcriptionToggle) {
                transcriptionToggle.replaceWith(transcriptionToggle.cloneNode(true));
            }

            // Reinicializar transcripciones inmediatamente
            if (window.initTranscripciones) {
                window.initTranscripciones();
            }
        }

        // Actualizar estado activo de los botones
        const buttons = document.querySelectorAll('.circle-button-mom3-11');

        buttons.forEach(button => {
            if (button.getAttribute('data-id') === buttonId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Añadir event listeners a los botones
    const buttons = document.querySelectorAll('.circle-button-mom3-11');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const buttonId = this.getAttribute('data-id');

            // Desbloquear el audio al hacer clic en cualquier tooltip
            if (!isUnlocked) {
                isUnlocked = true;
                const audioCenter = document.querySelector('.audio-center');
                if (audioCenter) {
                    audioCenter.classList.remove('audio-locked');
                }
            }

            changeInfo(buttonId, true); // Activar autoplay al hacer clic
        });
    });

    // Inicializar transcripciones
    if (window.initTranscripciones) {
        window.initTranscripciones();
    }

    // Mostrar candado inicial en el audio
    const audioCenter = document.querySelector('.audio-center');
    if (audioCenter) {
        audioCenter.classList.add('audio-locked');
    }

    // Bloquear reproducción manual del audio inicial
    const audioPlayer = document.getElementById('audioPlayer-mom3-11');
    if (audioPlayer) {
        audioPlayer.addEventListener('play', (e) => {
            if (!isUnlocked) {
                e.preventDefault();
                audioPlayer.pause();
                console.log('Audio bloqueado. Haz clic en un tooltip primero.');
            }
        });
    }

    // Inicializar con el primer elemento activo (sin autoplay)
    changeInfo('1', false);
}
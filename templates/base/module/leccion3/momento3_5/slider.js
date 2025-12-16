export function init() {

    // Actividad Select
    let preguntaActual = 1;
    let respuestasUsuario = {};
    let resultados = {};
    let quizCompletado = false;
    let preguntaActualNav = 1;
    const totalPreguntas = 6;
    let preguntasValidadas = 0;
    const respuestasCorrectas = { "1": false, "2": false, "3": false, "4": false, "5": false, "6": false };

    function actualizarProgresoPreguntas() {
        const progressText = document.getElementById('progress-text');
        if (progressText) progressText.textContent = `${preguntasValidadas} de ${totalPreguntas} preguntas validadas`;
        const barra = document.getElementById('progress-bar-fill');
        if (barra) barra.style.width = ((preguntasValidadas / totalPreguntas) * 100) + '%';
    }

    function validarPregunta(numeroPregunta) {
        const preguntaElement = document.querySelector(`[data-pregunta="${numeroPregunta}"]`);
        const opcionSeleccionada = preguntaElement.querySelector('.opcion-respuesta.seleccionada_alertas');
        const mensajeError = document.getElementById(`mensaje_error_${numeroPregunta}`);
        const resultadoAlertas = document.getElementById(`resultado_alertas_${numeroPregunta}`);
        const btnValidar = preguntaElement.querySelector('.btn-validar');
        const btnSiguienteContainer = preguntaElement.querySelector('.btn-siguiente-container');

        if (!opcionSeleccionada) {
            mensajeError.classList.remove('d-none');
            mensajeError.innerHTML = '<div class="alert multi-select-feedback-warning"><i class="fas fa-info-circle me-2"></i>Debes seleccionar una opción antes de validar.</div>';
            resultadoAlertas.classList.add('d-none');
            return;
        }

        mensajeError.classList.add('d-none');
        const respuestaUsuario = opcionSeleccionada.getAttribute('data-valor') === 'true';
        respuestasUsuario[numeroPregunta] = respuestaUsuario;
        const esCorrecta = respuestasUsuario[numeroPregunta] === respuestasCorrectas[numeroPregunta];
        resultados[numeroPregunta] = esCorrecta;

        if (!preguntaElement.classList.contains('pregunta-validada')) {
            preguntaElement.classList.add('pregunta-validada');
            preguntasValidadas++;
            actualizarProgresoPreguntas();
        }

        preguntaElement.querySelectorAll('.opcion-respuesta').forEach((opcion) => {
            opcion.style.pointerEvents = 'none';
            opcion.classList.remove('act');
        });

        if (esCorrecta) {
            opcionSeleccionada.classList.add('true');
        } else {
            opcionSeleccionada.classList.add('false');
        }

        if (btnValidar) btnValidar.classList.add('d-none');

        if (numeroPregunta === totalPreguntas) {
            mostrarResumenFinal();
        } else {
            const tiposAcoso = {
                1: 'acoso laboral',
                2: 'acoso laboral',
                3: 'acoso sexual',
                4: 'acoso sexual',
                5: 'violencia por terceros',
                6: 'situación que afecta tu bienestar laboral'
            };

            if (respuestaUsuario) {
                resultadoAlertas.innerHTML = `<div class="alert multi-select-feedback-warning"><i class="fas fa-exclamation-triangle me-2"></i>Esta situación podría indicar ${tiposAcoso[numeroPregunta]}. Es importante buscar apoyo y considerar reportar la situación.</div>`;
            } else {
                resultadoAlertas.innerHTML = '<div class="alert multi-select-feedback-success"><i class="fas fa-check-circle me-2"></i>Esta situación no indica señales de acoso o violencia laboral.</div>';
            }
            resultadoAlertas.classList.remove('d-none');

            if (btnSiguienteContainer) {
                btnSiguienteContainer.classList.remove('d-none');
                const btnSiguiente = btnSiguienteContainer.querySelector('button');
                if (btnSiguiente) btnSiguiente.classList.remove('d-none');
            }
        }
    }

    function mostrarPregunta(numeroPregunta) {
        document.querySelectorAll('.preguntas_01').forEach((pregunta) => pregunta.classList.add('d-none'));
        const preguntaElement = document.querySelector(`[data-pregunta="${numeroPregunta}"]`);
        if (preguntaElement) {
            preguntaElement.classList.remove('d-none');
            if (!quizCompletado) {
                preguntaElement.querySelectorAll('.opcion-respuesta').forEach((opcion) => {
                    opcion.classList.remove('seleccionada_alertas', 'act', 'true', 'false');
                    opcion.style.pointerEvents = 'auto';
                });
                const mensajeError = document.getElementById(`mensaje_error_${numeroPregunta}`);
                const resultadoAlertas = document.getElementById(`resultado_alertas_${numeroPregunta}`);
                if (mensajeError) mensajeError.classList.add('d-none');
                if (resultadoAlertas) resultadoAlertas.classList.add('d-none');
                const btnValidar = preguntaElement.querySelector('.btn-validar');
                const btnSiguienteContainer = preguntaElement.querySelector('.btn-siguiente-container');
                if (btnValidar) btnValidar.classList.remove('d-none');
                if (btnSiguienteContainer) {
                    btnSiguienteContainer.classList.add('d-none');
                    const btnSiguiente = btnSiguienteContainer.querySelector('button');
                    if (btnSiguiente) btnSiguiente.classList.add('d-none');
                }
            }
        }
    }

    function mostrarResumenFinal() {
        const respuestasCorrectas_count = Object.values(resultados).filter((resultado) => resultado === true).length;
        const porcentaje = Math.round((respuestasCorrectas_count / totalPreguntas) * 100);
        let feedbackClass = porcentaje >= 75 ? 'multi-select-feedback-success' : porcentaje >= 50 ? 'multi-select-feedback-warning' : 'multi-select-feedback-error';

        const items = [];
        for (let i = 1; i <= totalPreguntas; i++) {
            const ok = resultados[i];
            const icon = ok ? '<i class="fa-solid fa-check ms-1" style="color:#fff"></i>' : '<i class="fa-solid fa-xmark ms-1" style="color:#fff"></i>';
            const situacion = respuestasUsuario[i] ? 'Situación de riesgo identificada' : 'Sin señales de riesgo';
            const text = situacion;
            items.push(`<li class="mb-1 text-justify" style="color:#fff">Pregunta ${i}: ${text} ${icon}</li>`);
        }

        const situacionesRiesgo = Object.keys(respuestasUsuario).filter(key => respuestasUsuario[key] === true).length;
        let mensajeResumen = '';
        if (situacionesRiesgo === 0) {
            mensajeResumen = 'No se identificaron situaciones de acoso o violencia laboral.';
            feedbackClass = 'multi-select-feedback-success';
        } else if (situacionesRiesgo <= 2) {
            mensajeResumen = `Se identificaron ${situacionesRiesgo} situación(es) que podrían indicar acoso o violencia laboral. Te recomendamos buscar orientación.`;
            feedbackClass = 'multi-select-feedback-warning';
        } else {
            mensajeResumen = `Se identificaron ${situacionesRiesgo} situaciones que indican posible acoso o violencia laboral. Es importante que busques apoyo inmediato.`;
            feedbackClass = 'multi-select-feedback-error';
        }

        const feedbackExterno = document.getElementById('feedback-final-externo');
        if (feedbackExterno) {
            feedbackExterno.innerHTML = `<div class="resumen-final"><div class="text-justify ${feedbackClass}"><div style="color:#fff"><strong>Resumen de Evaluación:</strong> ${mensajeResumen}</div><ul class="mt-2 list-unstyled text-justify" style="color:#fff">${items.join('')}</ul></div></div>`;
            feedbackExterno.classList.remove('d-none');
        }

        quizCompletado = true;
        preguntaActualNav = totalPreguntas;
        document.getElementById('navegacion-resumen').classList.remove('d-none');
        document.getElementById('totalPreguntasNav').textContent = totalPreguntas;
        document.getElementById('preguntaActualNav').textContent = totalPreguntas;
        document.querySelectorAll('.btn-siguiente-container').forEach((container) => container.classList.add('d-none'));
    }

    function reiniciarActividad() {
        preguntaActual = 1;
        respuestasUsuario = {};
        resultados = {};
        quizCompletado = false;
        preguntaActualNav = 1;
        preguntasValidadas = 0;

        document.querySelectorAll('.opcion-respuesta').forEach((opcion) => {
            opcion.classList.remove('seleccionada_alertas', 'act', 'true', 'false');
            opcion.style.pointerEvents = 'auto';
        });

        document.querySelectorAll('.preguntas_01').forEach((pregunta) => pregunta.classList.remove('pregunta-validada'));
        document.querySelectorAll('[id^="mensaje_error_"]').forEach((elemento) => elemento.classList.add('d-none'));
        document.querySelectorAll('[id^="resultado_alertas_"]').forEach((elemento) => elemento.classList.add('d-none'));

        const feedbackExterno = document.getElementById('feedback-final-externo');
        if (feedbackExterno) {
            feedbackExterno.innerHTML = '';
            feedbackExterno.classList.add('d-none');
        }

        document.getElementById('navegacion-resumen').classList.add('d-none');
        document.querySelectorAll('.btn-validar').forEach((btn) => btn.classList.remove('d-none'));

        actualizarProgresoPreguntas();
        mostrarPregunta(1);
    }

    document.getElementById('preguntas-container').addEventListener('click', function (event) {
        if (event.target.classList.contains('opcion-respuesta')) {
            const preguntaContainer = event.target.closest('.preguntas_01');
            const opciones = preguntaContainer.querySelectorAll('.opcion-respuesta');
            opciones.forEach((opt) => opt.classList.remove('seleccionada_alertas', 'act', 'true', 'false'));
            event.target.classList.add('seleccionada_alertas', 'act');
        }

        if (event.target.classList.contains('btn-validar') || event.target.closest('.btn-validar')) {
            const btn = event.target.classList.contains('btn-validar') ? event.target : event.target.closest('.btn-validar');
            const numeroPregunta = parseInt(btn.getAttribute('data-pregunta'));
            validarPregunta(numeroPregunta);
        }

        if (event.target.hasAttribute('data-siguiente') || event.target.closest('[data-siguiente]')) {
            if (quizCompletado) return;
            const btn = event.target.hasAttribute('data-siguiente') ? event.target : event.target.closest('[data-siguiente]');
            const siguientePregunta = parseInt(btn.getAttribute('data-siguiente'));
            preguntaActual = siguientePregunta;
            mostrarPregunta(siguientePregunta);
        }

        if (event.target.classList.contains('btn-reiniciar') || event.target.closest('.btn-reiniciar')) {
            reiniciarActividad();
        }
    });

    document.getElementById('btnAnteriorNav').addEventListener('click', () => {
        if (preguntaActualNav > 1) {
            preguntaActualNav--;
            mostrarPregunta(preguntaActualNav);
            document.getElementById('preguntaActualNav').textContent = preguntaActualNav;
        }
    });

    document.getElementById('btnSiguienteNav').addEventListener('click', () => {
        if (preguntaActualNav < totalPreguntas) {
            preguntaActualNav++;
            mostrarPregunta(preguntaActualNav);
            document.getElementById('preguntaActualNav').textContent = preguntaActualNav;
        }
    });

    mostrarPregunta(1);
    actualizarProgresoPreguntas();
}
// Datos de la actividad
const pasosCorrectos = [
    "Se evalúan riesgos para identificar áreas peligrosas durante el montaje de la estructura metálica.",
    "Se instalan guardas metálicas resistentes en herramientas como sierras y taladros para evitar contactos accidentales.",
    "Los trabajadores reciben capacitación sobre el uso correcto de las guardas.",
    "Se implementa un programa de mantenimiento para inspeccionar y asegurar el buen estado de las guardas.",
    "Antes de cada turno, los trabajadores verifican que las guardas estén en su lugar y funcionando.",
];

// Elemento contenedor
const contenedorActividad = document.getElementById('ordenar-pasos-actividad');

// Verificar si es dispositivo móvil
const esMovil = window.innerWidth <= 768;

if (esMovil) {
    renderizarVersionMobile(contenedorActividad);
} else {
    renderizarVersionWeb(contenedorActividad);
}

// Añadir listener para cambios de tamaño de ventana
window.addEventListener('resize', function () {
    const nuevaEsMovil = window.innerWidth <= 768;

    if (nuevaEsMovil !== esMovil) {
        location.reload(); // Recargar para cambiar entre versiones
    }
});

function renderizarVersionWeb(contenedor) {
    // Función para generar pasos desordenados
    function generarPasosDesordenados() {
        return pasosCorrectos.map((texto, i) => ({ numero: i + 1, texto })).sort(() => Math.random() - 0.5);
    }

    let pasos = generarPasosDesordenados();
    let resultado = "";
    let correctCount = 0;
    let ordenando = false;
    let porcentaje = 0;

    // Crear elementos de la interfaz
    const webVersion = document.createElement('div');
    webVersion.className = 'web-version';

    const contenedorPasos = document.createElement('div');
    contenedorPasos.className = 'contenedor-pasosWEB';

    // Crear tarjetas de pasos
    pasos.forEach((paso, index) => {
        const tarjeta = crearTarjetaPasoWeb(paso, index);
        contenedorPasos.appendChild(tarjeta);
    });

    webVersion.appendChild(contenedorPasos);

    // Contenedor de resultado
    const resultadoContenedor = document.createElement('div');
    resultadoContenedor.className = 'resultado-contenedor';
    resultadoContenedor.style.display = 'none';

    // Contenedor de botones
    const botonesContainer = document.createElement('div');
    botonesContainer.className = 'botones-containerOP';

    // Botón Validar
    const btnValidar = document.createElement('button');
    btnValidar.className = 'sf-btn sf-btn-purple btn-validar';
    btnValidar.disabled = true;
    btnValidar.innerHTML = '<i class="fa fa-check-circle"></i> Validar';

    // Botón Reiniciar
    const btnReiniciar = document.createElement('button');
    btnReiniciar.className = 'sf-btn sf-btn-purple btn-reiniciar';
    btnReiniciar.innerHTML = '<i class="fas fa-repeat"></i> Reiniciar';

    botonesContainer.appendChild(btnValidar);
    botonesContainer.appendChild(btnReiniciar);

    webVersion.appendChild(resultadoContenedor);
    webVersion.appendChild(botonesContainer);

    contenedor.appendChild(webVersion);

    // Funciones para la versión web
    function handleDragStart(e, index) {
        e.dataTransfer.setData("index", index);
        ordenando = true;
        btnValidar.disabled = false;
    }

    function handleDrop(e, targetIndex) {
        const draggedIndex = e.dataTransfer.getData("index");
        const newPasos = [...pasos];
        const temp = newPasos[draggedIndex];
        newPasos[draggedIndex] = newPasos[targetIndex];
        newPasos[targetIndex] = temp;
        pasos = newPasos;

        // Actualizar la interfaz
        actualizarTarjetasWeb();
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function actualizarTarjetasWeb() {
        // Limpiar contenedor
        while (contenedorPasos.firstChild) {
            contenedorPasos.removeChild(contenedorPasos.firstChild);
        }

        // Volver a crear tarjetas
        pasos.forEach((paso, index) => {
            const tarjeta = crearTarjetaPasoWeb(paso, index);
            contenedorPasos.appendChild(tarjeta);
        });
    }

    function crearTarjetaPasoWeb(paso, index) {
        const esCorrecto = resultado && paso.texto === pasosCorrectos[index];

        const tarjeta = document.createElement('div');
        tarjeta.className = `tarjeta-paso1 ${resultado ? (esCorrecto ? 'correcto' : 'incorrecto') : ''}`;
        tarjeta.draggable = true;
        tarjeta.addEventListener('dragstart', (e) => handleDragStart(e, index));
        tarjeta.addEventListener('dragover', handleDragOver);
        tarjeta.addEventListener('drop', (e) => handleDrop(e, index));

        const contenido = document.createElement('div');
        contenido.className = 'contenido-tarjeta';
        contenido.innerHTML = `<span>${paso.numero}. ${paso.texto}</span>`;

        if (resultado) {
            const feedback = document.createElement('div');
            feedback.className = 'feedback-tarjeta';

            const icono = document.createElement('img');
            icono.className = 'icono-resultado';
            icono.src = esCorrecto ? 'assets/img/checkAct.png' : 'assets/img/xmarkAct.png';
            icono.alt = esCorrecto ? 'Correcto' : 'Incorrecto';

            feedback.appendChild(icono);
            contenido.appendChild(feedback);
        }

        tarjeta.appendChild(contenido);
        return tarjeta;
    }

    function validarOrden() {
        const correctAnswers = pasos.filter(
            (paso, index) => paso.texto === pasosCorrectos[index]
        );
        correctCount = correctAnswers.length;
        const totalCount = pasosCorrectos.length;
        porcentaje = Math.round((correctCount / totalCount) * 100);

        resultado = correctCount === totalCount ? "correcto" : "incorrecto";

        // Mostrar resultado
        resultadoContenedor.style.display = 'block';
        resultadoContenedor.innerHTML = `
          <p class="text-md mt-4 font-bold text-center">
            ${correctCount} de ${pasosCorrectos.length} respuestas correctas ${porcentaje}%
          </p>
          <p class="resultadoOP ${resultado}">
            ${resultado === "correcto"
                ? "¡Excelente trabajo! Has ordenado todo correctamente."
                : porcentaje > 50
                    ? "Buen intento, pero hay espacio para mejorar."
                    : "Sigue practicando, ¡puedes hacerlo mejor!"}
          </p>
        `;

        // Deshabilitar botón de validar y actualizar tarjetas
        btnValidar.disabled = true;
        actualizarTarjetasWeb();
    }

    function reiniciarPasos() {
        pasos = generarPasosDesordenados();
        resultado = "";
        correctCount = 0;
        porcentaje = 0;
        ordenando = false;

        // Ocultar resultado
        resultadoContenedor.style.display = 'none';

        // Deshabilitar botón de validar
        btnValidar.disabled = true;

        // Actualizar tarjetas
        actualizarTarjetasWeb();
    }

    // Añadir event listeners a los botones
    btnValidar.addEventListener('click', validarOrden);
    btnReiniciar.addEventListener('click', reiniciarPasos);
}

function renderizarVersionMobile(contenedor) {
    let respuestas = Array(5).fill("");
    let colores = Array(5).fill("");
    let correctCount = 0;
    let habilitarValidar = false;
    let mostrarResultado = false;
    let porcentaje = 0;
    let mensajeRetroalimentacion = "";

    const opciones = ["Paso 1", "Paso 2", "Paso 3", "Paso 4", "Paso 5"];
    const numerosDesordenados = [...opciones].sort(() => Math.random() - 0.5);

    // Crear elementos de la interfaz
    const mobileVersion = document.createElement('div');
    mobileVersion.className = 'mobile-version';

    const contenedorPasos = document.createElement('div');
    contenedorPasos.className = 'contenedor-pasosMOBILE';

    // Crear tarjetas de pasos
    pasosCorrectos.forEach((paso, index) => {
        const tarjeta = crearTarjetaPasoMobile(paso, index);
        contenedorPasos.appendChild(tarjeta);
    });

    mobileVersion.appendChild(contenedorPasos);

    // Contenedor de resultado
    const resultadoContenedor = document.createElement('div');
    resultadoContenedor.className = 'contador-correctas';
    resultadoContenedor.style.display = 'none';

    // Contenedor de botones
    const botonesContainer = document.createElement('div');
    botonesContainer.className = 'botones-container';

    // Botón Validar
    const btnValidar = document.createElement('button');
    btnValidar.className = 'sf-btn sf-btn-purple btn-validar';
    btnValidar.disabled = true;
    btnValidar.innerHTML = '<i class="fas fa-check"></i> Validar';

    // Botón Reiniciar
    const btnReiniciar = document.createElement('button');
    btnReiniciar.className = 'sf-btn sf-btn-purple btn-reiniciar';
    btnReiniciar.innerHTML = '<i class="fas fa-repeat"></i> Reiniciar';

    botonesContainer.appendChild(btnValidar);
    botonesContainer.appendChild(btnReiniciar);

    mobileVersion.appendChild(resultadoContenedor);
    mobileVersion.appendChild(botonesContainer);

    contenedor.appendChild(mobileVersion);

    // Funciones para la versión móvil
    function handleSelectChange(e, index) {
        const newRespuestas = [...respuestas];
        newRespuestas[index] = e.target.value;
        respuestas = newRespuestas;
        habilitarValidar = newRespuestas.every((respuesta) => respuesta !== "");
        mostrarResultado = false;

        // Ocultar resultado si estaba visible
        resultadoContenedor.style.display = 'none';

        // Actualizar estado del botón
        btnValidar.disabled = !habilitarValidar;

        // Actualizar la interfaz
        actualizarTarjetasMobile();
    }

    function actualizarTarjetasMobile() {
        // Limpiar contenedor
        while (contenedorPasos.firstChild) {
            contenedorPasos.removeChild(contenedorPasos.firstChild);
        }

        // Volver a crear tarjetas
        pasosCorrectos.forEach((paso, index) => {
            const tarjeta = crearTarjetaPasoMobile(paso, index);
            contenedorPasos.appendChild(tarjeta);
        });
    }

    function crearTarjetaPasoMobile(paso, index) {
        const tieneSeleccion = respuestas[index] !== "" && !mostrarResultado;
        const tarjeta = document.createElement('div');
        tarjeta.className = `tarjeta-paso-mobile ${colores[index]} ${tieneSeleccion ? 'seleccionado' : ''}`;

        const texto = document.createElement('p');
        texto.textContent = paso;
        tarjeta.appendChild(texto);

        const select = document.createElement('select');
        select.id = `respuesta-${index}`;
        select.value = respuestas[index];
        select.className = `respuesta-select ${colores[index]} ${tieneSeleccion ? 'seleccionado' : ''}`;
        select.disabled = mostrarResultado;
        select.addEventListener('change', (e) => handleSelectChange(e, index));

        const opcionDefault = document.createElement('option');
        opcionDefault.value = "";
        opcionDefault.textContent = "Seleccione...";
        select.appendChild(opcionDefault);

        // Obtener opciones disponibles para este select
        const opcionesDisponibles = obtenerOpcionesDisponibles(index);

        opcionesDisponibles.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion;
            option.textContent = opcion;
            select.appendChild(option);
        });

        // Establecer el valor seleccionado
        select.value = respuestas[index];

        tarjeta.appendChild(select);
        return tarjeta;
    }

    function obtenerOpcionesDisponibles(index) {
        const seleccionadas = respuestas.filter((r, i) => i !== index && r !== "");
        return numerosDesordenados.filter(
            (opcion) => !seleccionadas.includes(opcion) || respuestas[index] === opcion
        );
    }

    function validarRespuestas() {
        const nuevosColores = respuestas.map((respuesta, index) =>
            respuesta === `Paso ${index + 1}` ? "correcto" : "incorrecto"
        );
        colores = nuevosColores;

        const correctas = nuevosColores.filter((color) => color === "correcto").length;
        correctCount = correctas;
        porcentaje = Math.round((correctas / pasosCorrectos.length) * 100);

        // Determinar el mensaje de retroalimentación
        if (correctas === pasosCorrectos.length) {
            mensajeRetroalimentacion = "¡Excelente trabajo! Has ordenado todo correctamente.";
        } else {
            mensajeRetroalimentacion = "Sigue practicando, ¡puedes hacerlo mejor!";
        }

        mostrarResultado = true;

        // Mostrar resultado
        resultadoContenedor.style.display = 'block';
        resultadoContenedor.innerHTML = `
          <p class="text-md mt-4 font-bold text-center resultado-mensaje">
            Respuestas correctas: ${correctCount} de ${pasosCorrectos.length} (${porcentaje}%)
          </p>
          <p class="text-md mt-2 text-center ${correctCount === pasosCorrectos.length ? 'texto-verde' : 'texto-rojo'}">
            ${mensajeRetroalimentacion}
          </p>
        `;

        // Deshabilitar botón de validar
        btnValidar.disabled = true;

        // Actualizar tarjetas
        actualizarTarjetasMobile();
    }

    function reiniciarRespuestas() {
        respuestas = Array(5).fill("");
        colores = Array(5).fill("");
        correctCount = 0;
        porcentaje = 0;
        habilitarValidar = false;
        mostrarResultado = false;
        mensajeRetroalimentacion = "";

        // Ocultar resultado
        resultadoContenedor.style.display = 'none';

        // Deshabilitar botón de validar
        btnValidar.disabled = true;

        // Actualizar tarjetas
        actualizarTarjetasMobile();
    }

    // Añadir event listeners a los botones
    btnValidar.addEventListener('click', validarRespuestas);
    btnReiniciar.addEventListener('click', reiniciarRespuestas);
}

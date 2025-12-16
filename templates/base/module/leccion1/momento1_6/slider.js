export function init() {
  loadIframe({
    id: 'Slide1_6Web',
    src: 'https://iframe.mediadelivery.net/embed/424470/ab772b78-9c1f-485e-a4ff-32ff28b67713?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-web',
    style: 'width: 20vw; height: 80vh; min-height: 300px;',
  });
  console.log('Inicializando contenido de momento2_10...');

  const items_cmp_estrategias = [
    {
      texto: "<p class='mb-0'><span class='sf-text-purple sf-txt-800'>1. Responsabilidad de la empresa:</span> Toda organización debe contar con un protocolo claro que prevenga el acoso y la violencia en el trabajo.<br><strong>Tip adicional animado: </strong>Debe estar incluido en el Reglamento Interno.</p>",
      imagen: "responsabilidad_empresa.webp"
    },
    {
      texto: "<p class='mb-0'><span class='sf-text-purple sf-txt-800'>2. Rol activo del trabajador:</span> Cada trabajador tiene el deber de actuar ante una situación de acoso, incluso si no es la víctima.<br><strong>Pop-up final: </strong>Ser testigo también implica responsabilidad.</p>",
      imagen: "rol_activo_trabajador.webp"
    },
    {
      texto: "<p class='mb-0'><span class='sf-text-purple sf-txt-800'>3. Formación continua:</span> Las empresas deben garantizar formación regular en prevención, género y mecanismos de denuncia.<br><strong>Pop-up animado: </strong>La educación previene el acoso.</p>",
      imagen: "formacion_continua.webp"
    }
  ];

  // Referencias a los elementos del DOM
  const lista_cmp = document.getElementById("cmp_list");
  const contenido_cmp = document.getElementById("contenido_cmp");

  // Función para inicializar la funcionalidad de tabs
  function inicializarTabs() {
    // Generar los elementos li dinámicamente (ya están en el HTML, solo agregamos funcionalidad)
    const items_li = lista_cmp.querySelectorAll("li");

    items_li.forEach((li, index) => {
      li.addEventListener("click", () => mostrarItem_cmp(index));
    });

    // Mostrar el primer elemento por defecto
    mostrarItem_cmp(0);
  }

  // Función para mostrar un elemento específico
  function mostrarItem_cmp(index) {
    // Remover la clase activa de todos los elementos
    document.querySelectorAll("#cmp_list li").forEach(li =>
      li.classList.remove("cmp_active")
    );

    // Agregar la clase activa al elemento seleccionado
    lista_cmp.children[index].classList.add("cmp_active");

    const delayClass = index === 0 ? " animate__delay-1s" : "";

    contenido_cmp.innerHTML = `
        <img src="./momento1_6/img/${items_cmp_estrategias[index].imagen}" 
            class="cmp_img animate__animated animate__zoomIn${delayClass}" 
            alt="Imagen grande ${index + 1}">
        <div class="cmp_desp">${items_cmp_estrategias[index].texto}</div>
      `;
    // Actualizar el contenido con la imagen y texto correspondiente
  }

  // Inicializar cuando el DOM esté listo
  inicializarTabs();

  // Variables globales
  let selections = {
    conductor: "",
    vehiculo: "",
    medio: ""
  };

  let isVerified = false;
  let showValidation = false;
  let validationResults = {
    conductor: null,
    vehiculo: null,
    medio: null
  };

  const allOptions = [
    "Un usuario que agrede verbalmente al personal de atención.",
    "Un compañero que envía mensajes con insinuaciones sexuales por chat.",
    "Un jefe que humilla públicamente a un trabajador por su desempeño."
  ];

  const correctAnswers = {
    conductor: "Un jefe que humilla públicamente a un trabajador por su desempeño.",
    vehiculo: "Un compañero que envía mensajes con insinuaciones sexuales por chat.",
    medio: "Un usuario que agrede verbalmente al personal de atención."
  };

  // Elementos DOM
  const validateBtn = document.querySelector('.validate-btn');
  const resetBtn = document.querySelector('.reset-btn');
  const resultsContainer = document.querySelector('.results-container-acc-traf');
  const resultsText = document.querySelector('.results-text-acc-traf');

  // Inicializar eventos
  function initEvents() {
    // Eventos para selects
    document.getElementById('select-conductor').addEventListener('change', (e) => {
      handleChange('conductor', e.target.value);
    });

    document.getElementById('select-vehiculo').addEventListener('change', (e) => {
      handleChange('vehiculo', e.target.value);
    });

    document.getElementById('select-medio').addEventListener('change', (e) => {
      handleChange('medio', e.target.value);
    });

    // Eventos para botones
    validateBtn.addEventListener('click', handleValidate);
    resetBtn.addEventListener('click', handleReset);

    // Inicialmente deshabilitar ambos botones
    validateBtn.disabled = true;
    resetBtn.disabled = true;
  }

  // Obtener opciones disponibles
  function getAvailableOptions() {
    const selectedValues = Object.values(selections).filter(val => val !== "");
    return allOptions.filter(option => !selectedValues.includes(option));
  }

  // Actualizar opciones en todos los selects
  function updateSelectOptions() {
    const availableOptions = getAvailableOptions();

    ['conductor', 'vehiculo', 'medio'].forEach(category => {
      const select = document.getElementById(`select-${category}`);
      const currentValue = select.value;

      // Guardar la opción actualmente seleccionada
      const currentOption = currentValue ? [currentValue] : [];

      // Limpiar opciones excepto la primera (placeholder)
      while (select.options.length > 1) {
        select.remove(1);
      }

      // Agregar opciones disponibles más la opción actual si existe
      availableOptions.concat(currentOption).forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
      });

      // Restaurar el valor seleccionado si existe
      if (currentValue) {
        select.value = currentValue;
      }
    });
  }

  // Manejar cambio de selección
  function handleChange(category, value) {
    selections[category] = value;

    // Actualizar opciones en todos los selects
    updateSelectOptions();

    // Verificar si al menos uno está seleccionado (para habilitar reiniciar)
    const anySelected = Object.values(selections).some(val => val !== "");
    resetBtn.disabled = !anySelected;

    // Verificar si todos están seleccionados (para habilitar validar)
    const allSelected = Object.values(selections).every(val => val !== "");
    isVerified = allSelected;
    validateBtn.disabled = !isVerified || showValidation;
  }

  // Validar respuestas
  function handleValidate() {
    validationResults = {
      conductor: selections.conductor === correctAnswers.conductor,
      vehiculo: selections.vehiculo === correctAnswers.vehiculo,
      medio: selections.medio === correctAnswers.medio
    };

    showValidation = true;

    // Aplicar estilos de validación
    ['conductor', 'vehiculo', 'medio'].forEach(category => {
      const card = document.getElementById(`card-${category}`);
      const select = document.getElementById(`select-${category}`);
      const feedback = card.querySelector('.feedback-text-acc-traf');
      const iconContainer = card.querySelector('.validation-icon-container-acc-traf');
      const icon = iconContainer.querySelector('.validation-icon-acc-traf');

      // Actualizar icono
      icon.src = validationResults[category] ?
        "../../assets/img/botones/checkAct.png" :
        "../../assets/img/botones/xmarkAct.png";

      // Aplicar clases según resultado
      if (validationResults[category]) {
        card.classList.add('correct-acc-traf');
        card.classList.remove('incorrect-acc-traf');
        select.classList.add('correct-select-acc-traf');
        select.classList.remove('incorrect-select-acc-traf');
        feedback.textContent = "¡Correcto!";
        feedback.classList.add('correct-feedback-acc-traf');
        feedback.classList.remove('incorrect-feedback-acc-traf');
      } else {
        card.classList.add('incorrect-acc-traf');
        card.classList.remove('correct-acc-traf');
        select.classList.add('incorrect-select-acc-traf');
        select.classList.remove('correct-select-acc-traf');
        feedback.textContent = "¡Incorrecto!";
        feedback.classList.add('incorrect-feedback-acc-traf');
        feedback.classList.remove('correct-feedback-acc-traf');
      }

      // Mostrar feedback e icono
      feedback.style.display = 'flex';
      iconContainer.style.display = 'block';
    });

    // Mostrar resultados
    const correctCount = Object.values(validationResults).filter(Boolean).length;
    resultsText.textContent = `Respuestas correctas: ${correctCount} de 3`;
    resultsContainer.style.display = 'block';

    // Actualizar estado de botones
    validateBtn.disabled = true;
    resetBtn.disabled = false;
  }

  // Reiniciar actividad
  function handleReset() {
    // Restablecer variables
    selections = {
      conductor: "",
      vehiculo: "",
      medio: ""
    };

    isVerified = false;
    showValidation = false;
    validationResults = {
      conductor: null,
      vehiculo: null,
      medio: null
    };

    // Restablecer UI
    ['conductor', 'vehiculo', 'medio'].forEach(category => {
      const card = document.getElementById(`card-${category}`);
      const select = document.getElementById(`select-${category}`);
      const feedback = card.querySelector('.feedback-text-acc-traf');
      const iconContainer = card.querySelector('.validation-icon-container-acc-traf');

      // Remover clases de validación
      card.classList.remove('correct-acc-traf', 'incorrect-acc-traf');
      select.classList.remove('correct-select-acc-traf', 'incorrect-select-acc-traf');
      select.value = "";

      // Ocultar feedback e icono
      feedback.style.display = 'none';
      iconContainer.style.display = 'none';
    });

    // Actualizar opciones
    updateSelectOptions();

    // Ocultar resultados
    resultsContainer.style.display = 'none';

    // Actualizar estado de botones (ambos deshabilitados)
    validateBtn.disabled = true;
    resetBtn.disabled = true;
  }

  // Inicializar la actividad
  initEvents();
  updateSelectOptions();
}


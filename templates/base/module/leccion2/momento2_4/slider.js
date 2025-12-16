export function init() {
  // Actividad de tipos de acoso laboral
  const signalsData = [
    {
      id: "descendente",
      text: "DESCENDENTE",
      description: "Criticar constantemente el trabajo del subordinado con gritos o insultos en reuniones públicas, o cuestionar sus decisiones sin fundamento."
    },
    {
      id: "horizontal",
      text: "HORIZONTAL",
      description: "El grupo de compañeros deja de hablarle a la víctima, no la invitan a actividades sociales del trabajo o no le pasan información necesaria para realizar sus tareas."
    },
    {
      id: "ascendente",
      text: "ASCENDENTE",
      description: "Desobedecer sistemáticamente las órdenes directas, cuestionar las decisiones del superior de forma ofensiva o burlarse de ellas en público."
    }
  ];

  // Estado de la aplicación
  let droppedItems = {
    descendente: null,
    horizontal: null,
    ascendente: null
  };

  let hiddenItems = [];
  let isOver = null;
  let validationResult = null;
  let isValidated = false;
  let isMobile = window.innerWidth < 768;
  let selectedOptions = {
    descendente: "",
    horizontal: "",
    ascendente: ""
  };
  let hasInteraction = false;

  // Elementos DOM
  const cardsContainer = document.getElementById('cards-container');
  const dragContainer = document.getElementById('drag-container');
  const validationMessage = document.getElementById('validation-message');
  const validateBtn = document.getElementById('validate-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Inicializar la actividad
  function initActivity() {
    // Mezclar las señales
    const shuffledSignals = [...signalsData].sort(() => Math.random() - 0.5);

    // Crear las tarjetas
    createCards(shuffledSignals);

    // Crear los elementos arrastrables (solo en desktop)
    if (!isMobile) {
      createDraggableItems(shuffledSignals);
    }

    // Agregar event listeners
    validateBtn.addEventListener('click', handleValidate);
    resetBtn.addEventListener('click', handleReset);

    // Detectar cambios de tamaño de ventana
    window.addEventListener('resize', handleResize);
  }

  // Crear las tarjetas con texto
  function createCards(signals) {
    cardsContainer.innerHTML = '';

    Object.keys(droppedItems).forEach(dropZone => {
      const signal = signalsData.find(s => s.id === dropZone);
      if (!signal) return;

      const card = document.createElement('div');
      card.className = `card-dadstrans ${isValidated ? (validationResult && validationResult[dropZone] ? 'correct-card-dadstrans' : 'incorrect-card-dadstrans') : ''}`;
      card.id = `card-${dropZone}`;

      const textContainer = document.createElement('div');
      textContainer.className = 'text-container-dadstrans';

      const description = document.createElement('div');
      description.className = 'description-text-dadstrans';
      description.textContent = signal.description;
      textContainer.appendChild(description);

      // Agregar audio con transcripción
      const audioContainer = document.createElement('div');
      audioContainer.className = 'audio-center audio-new-style py-2';

      const audio = document.createElement('audio');
      audio.className = 'audio-con-transcripcion';
      audio.controls = true;

      // Configurar transcripción y fuente según el tipo
      if (dropZone === 'horizontal') {
        audio.setAttribute('data-transcripcion', JSON.stringify([
          { "end": 6.22, "start": 0, "text": "Horizontal. El grupo de compañeros deja de hablarle a la víctima, no la invitan actividades" },
          { "end": 11.28, "start": 6.22, "text": "sociales del trabajo, o no le pasan información necesaria para realizar sus tareas." }
        ]));

        const source = document.createElement('source');
        source.src = './momento2_4/audio/Ejemplo_horizontal_ppt17.mp3';
        source.type = 'audio/mp3';
        audio.appendChild(source);
      } else if (dropZone === 'ascendente') {
        audio.setAttribute('data-transcripcion', JSON.stringify([
          { "end": 0.88, "start": 0, "text": "Ascendente." },
          { "end": 6.7, "start": 1.44, "text": "Desobedecer sistemáticamente las órdenes directas, cuestionar las decisiones del superior" },
          { "end": 9.84, "start": 6.7, "text": "de forma ofensiva, o burlarse de ellas en público." }
        ]));

        const source = document.createElement('source');
        source.src = './momento2_4/audio/Ejemplo_ascendente_ppt17.mp3';
        source.type = 'audio/mp3';
        audio.appendChild(source);
      } else if (dropZone === 'descendente') {
        audio.setAttribute('data-transcripcion', JSON.stringify([
          { "end": 0.84, "start": 0, "text": "Descendente." },
          { "end": 7.5, "start": 1.46, "text": "Criticar constantemente el trabajo del subordinado con gritos, o insultos en reuniones públicas, o" },
          { "end": 9.78, "start": 7.5, "text": "cuestionar sus decisiones sin fundamento." }
        ]));

        const source = document.createElement('source');
        source.src = './momento2_4/audio/Ejemplo_descendente_ppt17.mp3';
        source.type = 'audio/mp3';
        audio.appendChild(source);
      }

      audioContainer.appendChild(audio);

      const transcriptionToggle = document.createElement('i');
      transcriptionToggle.className = 'transcription-toggle fas fa-closed-captioning audio-estilos';
      audioContainer.appendChild(transcriptionToggle);

      textContainer.appendChild(audioContainer);

      if (isValidated && validationResult) {
        const validationIcon = document.createElement('div');
        validationIcon.className = 'validation-icon-dadstrans';

        const iconImg = document.createElement('img');
        iconImg.src = validationResult[dropZone] ? '../../assets/img/botones/checkAct.png' : '../../assets/img/botones/xmarkAct.png';
        iconImg.alt = validationResult[dropZone] ? 'Correcto' : 'Incorrecto';
        validationIcon.appendChild(iconImg);

        textContainer.appendChild(validationIcon);
      }

      card.appendChild(textContainer);

      if (isMobile) {
        // En móvil, mostrar select
        const select = document.createElement('select');
        select.className = `mobile-select-dadstrans ${isValidated ? (validationResult && validationResult[dropZone] ? 'correct-select-dadstrans' : 'incorrect-select-dadstrans') : ''}`;
        select.id = `select-${dropZone}`;
        select.value = selectedOptions[dropZone];

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione una opción';
        select.appendChild(defaultOption);

        // Obtener opciones disponibles
        getAvailableOptions(dropZone).forEach(signal => {
          const option = document.createElement('option');
          option.value = signal.text;
          option.textContent = signal.text;
          select.appendChild(option);
        });

        select.value = selectedOptions[dropZone];
        select.addEventListener('change', (e) => handleSelectChange(dropZone, e.target.value));

        card.appendChild(select);
      } else {
        // En desktop, mostrar zona de drop
        const dropZoneEl = document.createElement('div');
        dropZoneEl.className = `drop-zone-dadstrans ${isOver === dropZone ? 'drop-over-dadstrans' : ''} ${isValidated ? (validationResult && validationResult[dropZone] ? 'correct-dropzone-dadstrans' : 'incorrect-dropzone-dadstrans') : ''}`;
        dropZoneEl.id = dropZone;

        // Deshabilitar la zona de drop si ya tiene un elemento
        if (droppedItems[dropZone]) {
          dropZoneEl.style.pointerEvents = 'none';
          // dropZoneEl.style.opacity = '0.7';
        } else {
          dropZoneEl.style.pointerEvents = 'auto';
          // dropZoneEl.style.opacity = '1';
        }

        if (droppedItems[dropZone]) {
          const droppedItem = document.createElement('div');
          droppedItem.className = `dropped-item-dadstrans ${isValidated ? (validationResult && validationResult[dropZone] ? 'correct-dropped-dadstrans' : 'incorrect-dropped-dadstrans') : ''}`;
          droppedItem.textContent = signals.find(s => s.id === droppedItems[dropZone])?.text;
          dropZoneEl.appendChild(droppedItem);
        }

        // Eventos para drag and drop (solo si no tiene elemento)
        if (!droppedItems[dropZone]) {
          dropZoneEl.addEventListener('dragover', handleDragOver);
          dropZoneEl.addEventListener('drop', handleDrop);
        }

        card.appendChild(dropZoneEl);
      }

      cardsContainer.appendChild(card);
    });

    // Inicializar funcionalidad de transcripción
    setTimeout(() => {
      if (typeof window.initAudioTranscription === 'function') {
        window.initAudioTranscription();
      }
    }, 100);
  }

  // Crear elementos arrastrables (solo en desktop)
  function createDraggableItems(signals) {
    dragContainer.innerHTML = '';
    dragContainer.className = `drag-container-dadstrans ${hiddenItems.length === signals.length ? 'drag-container-hidden-dadstrans' : ''}`;

    signals.forEach(signal => {
      if (hiddenItems.includes(signal.id)) return;

      const dragItem = document.createElement('div');
      dragItem.className = 'drag-item-dadstrans';
      dragItem.textContent = signal.text;
      dragItem.draggable = true;
      dragItem.id = signal.id;

      // Eventos de drag and drop
      dragItem.addEventListener('dragstart', handleDragStart);

      dragContainer.appendChild(dragItem);
    });
  }

  // Manejar el inicio del arrastre
  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  // Manejar el arrastre sobre una zona
  function handleDragOver(e) {
    e.preventDefault();
    const dropZoneId = e.target.id;

    // Solo permitir arrastrar sobre zonas vacías
    if (!droppedItems[dropZoneId]) {
      isOver = dropZoneId;
      updateCardsUI();
    }
  }

  // Manejar el drop
  function handleDrop(e) {
    e.preventDefault();
    const signalId = e.dataTransfer.getData('text/plain');
    const dropZoneId = e.target.id;

    // Verificar que la zona de drop esté vacía
    if (droppedItems[dropZoneId]) return;

    droppedItems[dropZoneId] = signalId;
    hiddenItems.push(signalId);
    validationResult = null;
    isValidated = false;
    hasInteraction = true;

    updateUI();
  }

  // Manejar cambio de selección en móvil
  function handleSelectChange(dropZoneId, value) {
    // Si se selecciona una opción vacía, permitir cambiar
    if (value === "") {
      // Liberar la opción seleccionada anteriormente
      const previousSignalId = droppedItems[dropZoneId];
      if (previousSignalId) {
        hiddenItems = hiddenItems.filter(id => id !== previousSignalId);
      }

      selectedOptions[dropZoneId] = "";
      droppedItems[dropZoneId] = null;

      validationResult = null;
      isValidated = false;
      hasInteraction = true;

      updateUI();
      return;
    }

    // Eliminar la opción seleccionada de otros selects
    Object.keys(selectedOptions).forEach(key => {
      if (selectedOptions[key] === value && key !== dropZoneId) {
        selectedOptions[key] = "";
        droppedItems[key] = null;

        // Liberar el elemento oculto
        const signalIdToFree = signalsData.find(s => s.text === value)?.id;
        if (signalIdToFree) {
          hiddenItems = hiddenItems.filter(id => id !== signalIdToFree);
        }
      }
    });

    selectedOptions[dropZoneId] = value;

    // Actualizar droppedItems para la validación
    const signalId = signalsData.find(s => s.text === value)?.id || null;
    droppedItems[dropZoneId] = signalId;

    // Añadir a elementos ocultos
    if (signalId && !hiddenItems.includes(signalId)) {
      hiddenItems.push(signalId);
    }

    validationResult = null;
    isValidated = false;
    hasInteraction = true;

    updateUI();
  }

  // Manejar validación
  function handleValidate() {
    // Validar cada emparejamiento individualmente
    const results = {};
    let correctCount = 0;
    const totalCount = Object.keys(droppedItems).length;

    for (const [dropZone, signalId] of Object.entries(droppedItems)) {
      const isCorrect = signalId === dropZone;
      results[dropZone] = isCorrect;
      if (isCorrect) {
        correctCount++;
      }
    }

    validationResult = { ...results, correctCount, totalCount };
    isValidated = true;

    updateUI();
  }

  // Manejar reinicio
  function handleReset() {
    droppedItems = {
      descendente: null,
      horizontal: null,
      ascendente: null
    };
    hiddenItems = [];
    validationResult = null;
    isValidated = false;
    selectedOptions = {
      descendente: "",
      horizontal: "",
      ascendente: ""
    };
    hasInteraction = false;

    updateUI();
  }

  // Manejar cambio de tamaño de ventana
  function handleResize() {
    const newIsMobile = window.innerWidth < 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      updateUI();
    }
  }

  // Obtener opciones disponibles para selects móviles
  function getAvailableOptions(currentDropZone) {
    const selectedValues = Object.values(selectedOptions);
    return signalsData.filter(signal =>
      selectedOptions[currentDropZone] === signal.text ||
      !selectedValues.includes(signal.text)
    );
  }

  // Actualizar la UI
  function updateUI() {
    const allItemsPlaced = isMobile
      ? Object.values(selectedOptions).every(option => option !== "")
      : Object.values(droppedItems).every(item => item !== null);

    validateBtn.disabled = !allItemsPlaced || isValidated;
    resetBtn.disabled = !hasInteraction;

    // Solo actualizar las zonas de drop sin recrear todo
    updateDropZones();

    if (!isMobile) {
      const shuffledSignals = [...signalsData].sort(() => Math.random() - 0.5);
      createDraggableItems(shuffledSignals);
    }

    // Mostrar mensaje de validación si es necesario
    if (isValidated && validationResult) {
      validationMessage.style.display = 'block';
      validationMessage.innerHTML = '';

      const validationText = document.createElement('p');
      validationText.className = 'validation-text-dadstrans';

      const validationScore = document.createElement('p');
      validationScore.className = 'validation-score-dadstrans';

      if (validationResult.correctCount === validationResult.totalCount) {
        validationText.innerHTML = '<strong>¡Muy bien! ¡Has identificado correctamente los tipos de acoso laboral!</strong>';
      } else {
        validationText.innerHTML = '<strong>Algunas respuestas no son correctas.</strong>';
      }

      validationScore.innerHTML = `<strong>Tus respuestas correctas son: ${validationResult.correctCount} de ${validationResult.totalCount} (${Math.round((validationResult.correctCount / validationResult.totalCount) * 100)})%</strong>`;

      validationMessage.appendChild(validationText);
      validationMessage.appendChild(validationScore);
    } else {
      validationMessage.style.display = 'none';
    }
  }

  // Actualizar la UI de las tarjetas
  function updateCardsUI() {
    Object.keys(droppedItems).forEach(dropZone => {
      const card = document.getElementById(`card-${dropZone}`);
      if (!card) return;

      const dropZoneEl = document.getElementById(dropZone);
      if (dropZoneEl) {
        // Actualizar la apariencia basada en el estado
        dropZoneEl.className = `drop-zone-dadstrans ${isOver === dropZone ? 'drop-over-dadstrans' : ''} ${isValidated ? (validationResult && validationResult[dropZone] ? 'correct-dropzone-dadstrans' : 'incorrect-dropzone-dadstrans') : ''}`;

        // Deshabilitar zonas con elementos
        if (droppedItems[dropZone]) {
          dropZoneEl.style.pointerEvents = 'none';
          // dropZoneEl.style.opacity = '0.7';
        } else {
          dropZoneEl.style.pointerEvents = 'auto';
          // dropZoneEl.style.opacity = '1';
        }
      }
    });
  }

  // Función para actualizar solo las zonas de drop
  function updateDropZones() {
    Object.keys(droppedItems).forEach(dropZone => {
      const dropZoneEl = document.getElementById(dropZone);
      if (!dropZoneEl) return;

      dropZoneEl.innerHTML = '';
      dropZoneEl.className = `drop-zone-dadstrans ${isOver === dropZone ? 'drop-over-dadstrans' : ''} ${isValidated ? (validationResult && validationResult[dropZone] ? 'correct-dropzone-dadstrans' : 'incorrect-dropzone-dadstrans') : ''}`;

      if (droppedItems[dropZone]) {
        dropZoneEl.style.pointerEvents = 'none';
        // dropZoneEl.style.opacity = '0.7';

        const droppedItem = document.createElement('div');
        droppedItem.className = `dropped-item-dadstrans ${isValidated ? (validationResult && validationResult[dropZone] ? 'correct-dropped-dadstrans' : 'incorrect-dropped-dadstrans') : ''}`;
        droppedItem.textContent = signalsData.find(s => s.id === droppedItems[dropZone])?.text;
        dropZoneEl.appendChild(droppedItem);
      } else {
        dropZoneEl.style.pointerEvents = 'auto';
        // dropZoneEl.style.opacity = '1';
        dropZoneEl.addEventListener('dragover', handleDragOver);
        dropZoneEl.addEventListener('drop', handleDrop);
      }
    });
  }

  // Iniciar la actividad
  initActivity();
}
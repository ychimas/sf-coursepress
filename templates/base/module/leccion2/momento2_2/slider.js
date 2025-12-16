export function init() {
    // Datos de la actividad
    const itemsData = [
        {
            image: "momento2_2/img/conflicto_ppt15.webp",
            description: `Diferencia legítima de opinión, se puede resolver con diálogo.`,
            correctAnswer: "1",
            selectedAnswer: "",
            isCorrect: false,
        },
        {
            image: "momento2_2/img/acoso_ppt15.webp",
            description: "Conducta repetitiva o única que daña, humilla o perjudica.",
            correctAnswer: "2",
            selectedAnswer: "",
            isCorrect: false,
        },
        {
            image: "momento2_2/img/violencia_ppt15.webp",
            description: "Agresión directa, física o verbal, especialmente de terceros.",
            correctAnswer: "3",
            selectedAnswer: "",
            isCorrect: false,
        },
    ];

    const availableOptions = [
        { value: "3", label: "Violencia​" },
        { value: "1", label: "Conflicto" },
        { value: "2", label: "Acoso" },
    ];

    let isVerified = false;
    let correctCount = 0;
    let percentage = 0;

    // Elementos DOM
    const itemsGrid = document.getElementById("items-grid");
    const errorMessage = document.getElementById("error-message");
    const scoreText = document.getElementById("score-text");
    const validateBtn = document.getElementById("validate-btn");
    const resetBtn = document.getElementById("reset-btn");

    // Inicializar la actividad
    function initializeActivity() {
        renderItems();
        setupEventListeners();
    }

    // Renderizar los elementos de la actividad
    function renderItems() {
        itemsGrid.innerHTML = "";

        itemsData.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = `item-box ${item.selectedAnswer !== "" && !isVerified ? "selected" : ""} ${isVerified ? (item.isCorrect ? "correct" : "incorrect") : ""}`;

            // Filtrar opciones disponibles (excluyendo las ya seleccionadas en otros items)
            const filteredOptions = availableOptions.filter(option => {
                return !itemsData.some((itemData, i) => i !== index && itemData.selectedAnswer === option.value);
            });

            // Opciones para el select
            const optionsHTML = filteredOptions.map(option =>
                `<option value="${option.value}" ${item.selectedAnswer === option.value ? "selected" : ""}>${option.label}</option>`
            ).join("");

            itemElement.innerHTML = `
        <div class="image-container">
          <img src="${item.image}" alt="Método ${index + 1}" class="item-image" />
          ${isVerified ? `<img src="${item.isCorrect ? '../../assets/img/botones/checkAct.png' : '../../assets/img/botones/xmarkAct.png'}" class="feedback-icon" />` : ''}
        </div>
        <p class="item-description ${isVerified ? 'text-white' : ''}">${item.description}</p>
        <select class="item-select ${item.selectedAnswer !== "" && !isVerified ? "selected" : ""}" 
                data-index="${index}" ${isVerified ? "disabled" : ""}>
          <option value="" disabled ${!item.selectedAnswer ? "selected" : ""}>Seleccione...</option>
          ${optionsHTML}
        </select>
        ${isVerified ? `<p class="feedback-text">${item.isCorrect ? "¡Correcto!" : "¡Incorrecto!"}</p>` : ''}
      `;

            // Crear contenedor para card y botón
            const cardContainer = document.createElement("div");
            cardContainer.className = "card-container-mom2_2";
            
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "left-dir mt-3";
            buttonContainer.innerHTML = `
                <button class="sf-btn sf-btn-purple" data-bs-toggle="modal" data-bs-target="#sld2_2_caso${index + 1}">
                  <i class="fa fa-question-circle"></i> Caso ${index + 1}
                </button>
            `;

            cardContainer.appendChild(itemElement);
            cardContainer.appendChild(buttonContainer);
            itemsGrid.appendChild(cardContainer);
        });

        updateResetButton();
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Event delegation para los selects
        itemsGrid.addEventListener("change", function (e) {
            if (e.target.classList.contains("item-select")) {
                const index = parseInt(e.target.dataset.index);
                const value = e.target.value;
                handleSelect(index, value);
            }
        });

        validateBtn.addEventListener("click", handleValidate);
        resetBtn.addEventListener("click", handleReset);
    }

    // Manejar selección de opción
    function handleSelect(index, value) {
        itemsData[index].selectedAnswer = value;
        renderItems();
    }

    // Validar respuestas
    function handleValidate() {
        // Verificar que todas las opciones estén seleccionadas
        if (itemsData.some(item => item.selectedAnswer === "")) {
            errorMessage.textContent = "Debe seleccionar todas las opciones antes de validar.";
            errorMessage.style.display = "block";
            return;
        }

        errorMessage.style.display = "none";

        // Calcular respuestas correctas
        correctCount = 0;
        itemsData.forEach(item => {
            item.isCorrect = item.selectedAnswer === item.correctAnswer;
            if (item.isCorrect) correctCount++;
        });

        percentage = Math.round((correctCount / itemsData.length) * 100);
        isVerified = true;

        // Mostrar resultados
        scoreText.textContent = `${correctCount} de ${itemsData.length} respuestas correctas (${percentage}%)`;
        scoreText.style.display = "block";

        renderItems();
    }

    // Reiniciar actividad
    function handleReset() {
        itemsData.forEach(item => {
            item.selectedAnswer = "";
            item.isCorrect = false;
        });

        isVerified = false;
        correctCount = 0;
        percentage = 0;

        errorMessage.style.display = "none";
        scoreText.style.display = "none";

        renderItems();
    }

    // Actualizar estado del botón de reinicio
    function updateResetButton() {
        const anySelected = itemsData.some(item => item.selectedAnswer !== "");
        resetBtn.disabled = !anySelected;
    }

    // Inicializar la actividad
    initializeActivity();
}
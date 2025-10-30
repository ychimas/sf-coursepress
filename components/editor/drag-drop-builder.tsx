"use client"

import { useState, useEffect, useCallback } from "react"
import { Type, Image, MousePointer, Table, Video, Puzzle, Edit, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ComponentEditor } from "./component-editor"

interface DragDropBuilderProps {
  layout: string
  initialLeftContent?: any[]
  initialRightContent?: any[]
  onContentChange: (leftContent: any[], rightContent: any[], htmlContent: string, videos?: any[], images?: any[], audios?: any[], cssContent?: string, jsContent?: string) => void
  showComponentsPanel?: boolean
  onLayoutChange?: (newLayout: string) => void
  momentId?: string
  lessonName?: string
  projectId?: string
}

const generateSelectActivityCSS = () => {
  return `/* Estilos para la actividad de selección */
.select-container {
    font-family: 'Montserrat', sans-serif;
}

.select-activity {
    text-align: justify;
}

.select {
    border: 0.125rem solid #afafaf;
    border-radius: 0.625rem;
    padding: 0.0625rem 0.5rem;
    font-size: 0.875rem;
    color: #3a3a3a;
    cursor: pointer;
    outline: none;
    transition: all 0.3s;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1rem;
    min-width: 7.5rem;
    background-color: white;
}

.select:focus {
    border-color: #6b21a8;
}

.select-item {
    margin-bottom: 0.75rem;
}

.select-text {
    line-height: 1.6;
}

.select-feedback {
    border-radius: 0.375rem;
    text-align: center;
    font-weight: 500;
}

.select-correct {
    background-color: #4CAF50;
    color: white;
}

.select-incorrect {
    background-color: #F44336;
    color: white;
}

.select-results {
    font-weight: bold;
    margin-top: 0.5rem;
}

.select-selected {
    background-color: #6e3cd2;
    color: white;
    border-color: #6e3cd2;
}

.select-correct-answer {
    background-color: #4CAF50 !important;
    color: white !important;
    border-color: #388E3C !important;
}

.select-incorrect-answer {
    background-color: #F44336 !important;
    color: white !important;
    border-color: #D32F2F !important;
}

.select-error {
    color: #D32F2F;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0.75rem;
    padding: 0.625rem;
    border-radius: 0.3125rem;
}

.select-actions {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
}

.select-validate,
.select-reset {
    margin: 0 0.25rem;
}

.select-reset:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}`
}

const generateOrdenarPasosCSS = () => {
  return `/* Estilos para la actividad de ordenar pasos */
.ordenar-pasos-container {
    font-family: "Montserrat", sans-serif;
    font-size: 1rem;
    width: 100%;
    max-width: 62.5rem;
    margin: 0 auto;
    padding: 0.625rem 1.25rem;
    background: #fcfcfc;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.2);
}

.contenedor-pasosWEB {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.tarjeta-paso1 {
    position: relative;
    background: #0f172a;
    color: #ffffff;
    padding: 0.625rem;
    margin-top: 0.3125rem;
    border-radius: 0.3125rem;
    cursor: grab;
    transition: background 0.3s ease;
    border: 0.0625rem solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
}

.tarjeta-paso1.correcto {
    background: #4caf50;
    color: white;
    border-color: #4caf50;
}

.tarjeta-paso1.incorrecto {
    background: #f44336;
    color: white;
    border-color: #f44336;
}

.botones-containerOP {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 0.625rem !important;
}

.btn-validar:hover:not(:disabled) {
    background: #6d28d9;
}

.btn-validar:disabled {
    background: #b9a5ee;
    cursor: not-allowed;
}

.resultadoOP {
    text-align: center;
    margin-top: 0.375rem;
    font-size: 1rem;
    font-weight: bold;
}

.resultadoOP.correcto {
    color: #4caf50;
    margin: 0 !important;
}

.resultadoOP.incorrecto {
    color: #f44336;
    margin: 0 !important;
}

.contenido-tarjeta {
    flex: 1;
    text-align: left;
}

.resultado-contenedor {
    color: #8f8f8f;
    font-size: 1rem;
}

.contenedor-pasosMOBILE {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
    max-width: 50rem;
    background: #ffffff;
}

.tarjeta-paso-mobile {
    padding: 0.9375rem;
    background: #ffffff;
    border: 0.0625rem solid #ccc;
    border-radius: 0.5rem;
    text-align: justify;
    font-size: 1rem;
    color: #8f8f8f;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.tarjeta-paso-mobile.seleccionado {
    background-color: #6e3cd2;
    color: #fff;
}

.tarjeta-paso-mobile.correcto {
    background-color: #4caf50;
    color: #fff;
}

.tarjeta-paso-mobile.incorrecto {
    background-color: #f44336;
    color: #fff;
}

.respuesta-select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    text-align: center;
    border-radius: 0.75rem;
    border: 0.0625rem solid #ccc;
    box-sizing: border-box;
}

.respuesta-select.seleccionado {
    background-color: #8d5dee;
    color: #fff;
}

.respuesta-select.correcto {
    background-color: #4caf50;
    color: #fff;
}

.respuesta-select.incorrecto {
    background-color: #f44336;
    color: #fff;
}

.respuesta-select:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.texto-verde {
    color: #4caf50;
    font-weight: bold;
}

.texto-rojo {
    color: #f44336;
    font-weight: bold;
}

.mobile-version {
    display: none;
}

.web-version {
    display: block;
}

@media (max-width: 48rem) {
    .mobile-version {
        display: block;
    }
    .web-version {
        display: none;
    }
}`
}

const generateQuizCSS = () => {
  return `.preguntas_01 .ctItem {
    background: #fcfcfc;
    padding: 0.9375rem;
    border-radius: 0.625rem;
    margin-top: .5rem;
    max-width: 100%;
    box-shadow: 0 0 0.625rem #0000004d;
    text-align: left;
}

.opciones-pregunta .opcion-respuesta {
    background: #ebebeb;
    color: #8f8f8f;
    padding: 0.625rem 0.625rem 0.625rem 0.9375rem;
    border-radius: 0.3125rem;
    margin: 0.5rem 0;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.opciones-pregunta .opcion-respuesta:hover {
    background: #d0d0d0;
}

.opciones-pregunta .opcion-respuesta.act {
    background: #08244c;
    color: #fff;
    transform: scale(1.01);
    border: 0.125rem solid #08244c;
}

.opciones-pregunta .opcion-respuesta.true {
    background: #4caf50;
    color: #fff;
}

.opciones-pregunta .opcion-respuesta.false {
    background: #f44336;
    color: #fff;
}

.multi-select-feedback-success {
    background: #32a852;
    color: #fff;
    border-radius: 0.7rem;
    padding: 1rem 1.5rem;
    font-weight: normal;
    font-size: 1.05rem;
    display: inline-block;
}

.multi-select-feedback-error {
    background: #e63946;
    color: #fff;
    border-radius: 0.7rem;
    padding: 1rem 1.5rem;
    font-weight: normal;
    font-size: 1.05rem;
    display: inline-block;
}

.multi-select-feedback-warning {
    background: #ff8c00;
    color: #fff;
    border-radius: 0.7rem;
    padding: 1rem 1.5rem;
    font-weight: normal;
    font-size: 1.05rem;
    display: inline-block;
}

.progress-bar-container {
    width: 100%;
    height: 0.75rem;
    background: #e0e0e0;
    border-radius: 0.5625rem;
    overflow: hidden;
    margin-bottom: 0.75rem;
}

.progress-bar-fill {
    height: 100%;
    width: 0%;
    background: #08244c;
    border-radius: 0.5625rem;
    transition: width 0.3s;
}`
}

const generateDragClasificarCSS = () => {
  return `.w-80 { width: 80%; }

.draggable-item {
    cursor: grab;
    user-select: none;
    transition: all 0.3s ease;
    max-width: 37.5rem;
    margin: 0 auto;
    border: 0.1875rem solid #007bff;
    background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
    box-shadow: 0 0.375rem 1.25rem rgba(0, 123, 255, 0.25);
}

.draggable-item:hover {
    border-color: #007bff;
    background-color: #e3f2fd;
    transform: translateY(-0.125rem);
}

.draggable-item:active {
    cursor: grabbing;
    background-color: #007bff;
    color: white;
    transform: scale(0.98);
}

.draggable-item.dragging {
    opacity: 0.8;
    background-color: #007bff;
    color: white;
    transform: rotate(2deg);
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.button-group .btn {
    min-width: 7.5rem;
    font-weight: 500;
}

.drop-area {
    min-height: 7.5rem;
    transition: all 0.3s ease;
    border: 0.1875rem dashed #6c757d !important;
    background-color: #f8f9fa;
}

.drop-area:hover {
    border-color: #495057 !important;
}

.drop-area.drag-over {
    background-color: #e3f2fd;
    border-color: #007bff !important;
    transform: scale(1.02);
}

.drop-header {
    font-weight: 600;
    font-size: 0.95rem;
}

.dropped-items {
    min-height: 3.125rem;
}

.dropped-item {
    font-size: 0.9em;
    border: 0.0625rem solid rgba(255, 255, 255, 0.2);
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(-0.625rem); }
    to { opacity: 1; transform: translateY(0); }
}`
}

const generateSelectImagenCSS = () => {
  return `.quiz-container {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    font-family: "Montserrat", sans-serif;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    width: 100%;
    justify-items: center;
}

.item-box {
    background: white;
    border-radius: 0.5rem;
    padding: 0.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 15.625rem;
    transition: transform 0.3s ease;
}

.item-box.selected {
    background-color: #6e3cd2;
    color: white;
}

.item-box.selected .item-description {
    color: white;
}

.item-box.correct {
    background-color: #4caf50;
}

.item-box.incorrect {
    background-color: #f44336;
}

.image-container {
    position: relative;
    width: 7.5rem;
    height: 7.5rem;
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.item-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 0.375rem;
}

.feedback-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4rem;
    height: 4rem;
}

.item-description {
    text-align: left;
    margin-bottom: 0.25rem;
    flex-grow: 1;
    font-size: 1rem;
    line-height: 1.4;
}

.item-select {
    width: 100%;
    padding: 0.5rem;
    border: 0.0625rem solid #e2e8f0;
    border-radius: 0.375rem;
    background-color: white;
    color: #8f8f8f;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.item-select.selected {
    background-color: #8d5dee;
    color: white;
}

.item-select:hover:not(:disabled) {
    border-color: #7c3aed;
}

.feedback-text {
    margin-top: 0.75rem;
    font-weight: bold;
    color: white;
    text-align: center;
    font-size: 0.9rem;
}

.button-container {
    margin-top: 0;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
}

@media (max-width: 30rem) {
    .items-grid {
        grid-template-columns: 1fr;
    }
    .item-box {
        max-width: 100%;
    }
    .image-container {
        width: 6.25rem;
        height: 6.25rem;
    }
}`
}

const generateSelectImagenJS = (activityData: any, currentMomentId: string) => {
  const items = activityData.items || []
  const opciones = activityData.opciones || []
  
  const itemsDataStr = items.map((item: any, i: number) => {
    const imgPath = item.imagen ? `./${currentMomentId}/img/${item.imagen}` : ''
    return `{
    image: "${imgPath}",
    description: ${JSON.stringify(item.descripcion)},
    correctAnswer: "${item.correcta}",
    selectedAnswer: "",
    isCorrect: false
  }`
  }).join(',\n  ')
  
  return `  const itemsData = [\n  ${itemsDataStr}\n  ];

  const availableOptions = ${JSON.stringify(opciones.map((opc: string, i: number) => ({ value: String(i), label: opc })))};

  let isVerified = false;
  let correctCount = 0;
  let percentage = 0;

  const itemsGrid = document.getElementById('items-grid');
  const errorMessage = document.getElementById('error-message');
  const scoreText = document.getElementById('score-text');
  const validateBtn = document.getElementById('validate-btn');
  const resetBtn = document.getElementById('reset-btn');

  function renderItems() {
      itemsGrid.innerHTML = '';

      itemsData.forEach((item, index) => {
          const itemElement = document.createElement('div');
          itemElement.className = \`item-box \${item.selectedAnswer !== '' && !isVerified ? 'selected' : ''} \${isVerified ? (item.isCorrect ? 'correct' : 'incorrect') : ''}\`;

          const filteredOptions = availableOptions.filter(option => {
              return !itemsData.some((itemData, i) => i !== index && itemData.selectedAnswer === option.value);
          });

          const optionsHTML = filteredOptions.map(option =>
              \`<option value="\${option.value}" \${item.selectedAnswer === option.value ? 'selected' : ''}>\${option.label}</option>\`
          ).join('');

          itemElement.innerHTML = \`
          <div class="image-container">
            <img src="\${item.image}" alt="Item \${index + 1}" class="item-image" />
            \${isVerified ? \`<img src="\${item.isCorrect ? 'assets/img/checkAct.png' : 'assets/img/xmarkAct.png'}" class="feedback-icon" />\` : ''}
          </div>
          <p class="item-description \${isVerified ? 'text-white' : ''}">\${item.description}</p>
          <select class="item-select \${item.selectedAnswer !== '' && !isVerified ? 'selected' : ''}" 
                  data-index="\${index}" \${isVerified ? 'disabled' : ''}>
            <option value="" disabled \${!item.selectedAnswer ? 'selected' : ''}>Seleccione...</option>
            \${optionsHTML}
          </select>
          \${isVerified ? \`<p class="feedback-text">\${item.isCorrect ? '¡Correcto!' : '¡Incorrecto!'}</p>\` : ''}
        \`;

          itemsGrid.appendChild(itemElement);
      });

      updateResetButton();
  }

  function handleSelect(index, value) {
      itemsData[index].selectedAnswer = value;
      renderItems();
  }

  function handleValidate() {
      if (itemsData.some(item => item.selectedAnswer === '')) {
          errorMessage.textContent = 'Debe seleccionar todas las opciones antes de validar.';
          errorMessage.style.display = 'block';
          return;
      }

      errorMessage.style.display = 'none';

      correctCount = 0;
      itemsData.forEach(item => {
          item.isCorrect = item.selectedAnswer === item.correctAnswer;
          if (item.isCorrect) correctCount++;
      });

      percentage = Math.round((correctCount / itemsData.length) * 100);
      isVerified = true;

      scoreText.textContent = \`\${correctCount} de \${itemsData.length} respuestas correctas (\${percentage}%)\`;
      scoreText.style.display = 'block';

      renderItems();
  }

  function handleReset() {
      itemsData.forEach(item => {
          item.selectedAnswer = '';
          item.isCorrect = false;
      });

      isVerified = false;
      correctCount = 0;
      percentage = 0;

      errorMessage.style.display = 'none';
      scoreText.style.display = 'none';

      renderItems();
  }

  function updateResetButton() {
      const anySelected = itemsData.some(item => item.selectedAnswer !== '');
      resetBtn.disabled = !anySelected;
  }

  itemsGrid.addEventListener('change', function (e) {
      if (e.target.classList.contains('item-select')) {
          const index = parseInt(e.target.dataset.index);
          const value = e.target.value;
          handleSelect(index, value);
      }
  });

  validateBtn.addEventListener('click', handleValidate);
  resetBtn.addEventListener('click', handleReset);

  renderItems();`
}

const generateDragClasificarJS = (activityData: any) => {
  const items = activityData.items || []
  const categorias = activityData.categorias || []
  
  return `  const items = ${JSON.stringify(items)};
  const categorias = ${JSON.stringify(categorias)};
  let currentIndex = 0;
  let correctAnswers = 0;
  const draggableText = document.getElementById('draggableText');
  const feedback = document.getElementById('feedback');
  const progress = document.getElementById('progress');
  const correctCount = document.getElementById('correctCount');
  const resetBtn = document.getElementById('resetBtn');

  function showNextText() {
      if (currentIndex < items.length) {
          const current = items[currentIndex];
          draggableText.innerHTML = current.texto;
          draggableText.style.display = 'block';
          document.querySelectorAll('.category-btn').forEach(btn => btn.disabled = false);
      } else {
          draggableText.style.display = 'none';
          document.querySelectorAll('.category-btn').forEach(btn => btn.disabled = true);
          showFinalMessage();
      }
      updateProgress();
  }

  function updateProgress() {
      if (currentIndex < items.length) {
          progress.textContent = \`\${currentIndex + 1}/\${items.length}\`;
      } else {
          progress.textContent = \`\${items.length}/\${items.length}\`;
      }
      correctCount.textContent = correctAnswers;
  }

  function showFeedback(isCorrect) {
      feedback.className = \`alert \${isCorrect ? 'alert-success' : 'alert-danger'} mb-3\`;
      feedback.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto.';
      feedback.classList.remove('d-none');
      setTimeout(() => feedback.classList.add('d-none'), 2000);
  }

  function showFinalMessage() {
      feedback.className = 'alert alert-info mb-3';
      feedback.textContent = \`Actividad completada. Resultado: \${correctAnswers}/\${items.length} correctas\`;
      feedback.classList.remove('d-none');
  }

  function addToDroppedItems(item, category, isCorrect) {
      const container = document.getElementById(\`\${category}-items\`);
      const itemDiv = document.createElement('div');
      itemDiv.className = \`dropped-item p-2 mb-2 rounded \${isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}\`;
      itemDiv.textContent = item.texto;
      container.appendChild(itemDiv);
  }

  function handleAnswer(selectedCategory) {
      const currentItem = items[currentIndex];
      const isCorrect = selectedCategory === currentItem.categoria;

      if (isCorrect) correctAnswers++;

      showFeedback(isCorrect);
      addToDroppedItems(currentItem, selectedCategory, isCorrect);

      document.querySelectorAll('.category-btn').forEach(btn => btn.disabled = true);

      currentIndex++;
      setTimeout(() => showNextText(), 500);
  }

  function resetActivity() {
      currentIndex = 0;
      correctAnswers = 0;
      feedback.classList.add('d-none');
      categorias.forEach(cat => {
          document.getElementById(\`\${cat}-items\`).innerHTML = '';
      });
      showNextText();
  }

  draggableText.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', currentIndex);
      draggableText.classList.add('dragging');
  });

  draggableText.addEventListener('dragend', () => {
      draggableText.classList.remove('dragging');
      document.querySelectorAll('.drop-area').forEach(area => area.classList.remove('drag-over'));
  });

  document.querySelectorAll('.drop-zone').forEach(zone => {
      const category = zone.getAttribute('data-category');
      const dropArea = zone.querySelector('.drop-area');

      zone.addEventListener('dragover', (e) => {
          e.preventDefault();
          document.querySelectorAll('.drop-area').forEach(area => area.classList.remove('drag-over'));
          dropArea.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', (e) => {
          if (!zone.contains(e.relatedTarget)) {
              dropArea.classList.remove('drag-over');
          }
      });

      zone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropArea.classList.remove('drag-over');
          const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
          if (draggedIndex === currentIndex) {
              handleAnswer(category);
          }
      });
  });

  document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
          const category = btn.getAttribute('data-category');
          handleAnswer(category);
      });
  });

  resetBtn.addEventListener('click', resetActivity);
  showNextText();`
}

const generateVerdaderoFalsoJS = (activityData: any) => {
  const preguntas = activityData.preguntas || []
  const respuestasCorrectas = preguntas.reduce((acc: any, p: any, i: number) => {
    acc[i + 1] = p.correcta
    return acc
  }, {})
  
  return `  let preguntaActual = 1;
  let respuestasUsuario = {};
  let resultados = {};
  let quizCompletado = false;
  let preguntaActualNav = 1;
  const totalPreguntas = ${preguntas.length};
  let preguntasValidadas = 0;
  const respuestasCorrectas = ${JSON.stringify(respuestasCorrectas)};

  function actualizarProgresoPreguntas() {
      const progressText = document.getElementById('progress-text');
      if (progressText) progressText.textContent = \`\${preguntasValidadas} de \${totalPreguntas} preguntas validadas\`;
      const barra = document.getElementById('progress-bar-fill');
      if (barra) barra.style.width = ((preguntasValidadas / totalPreguntas) * 100) + '%';
  }

  function validarPregunta(numeroPregunta) {
      const preguntaElement = document.querySelector(\`[data-pregunta="\${numeroPregunta}"]\`);
      const opcionSeleccionada = preguntaElement.querySelector('.opcion-respuesta.seleccionada_alertas');
      const mensajeError = document.getElementById(\`mensaje_error_\${numeroPregunta}\`);
      const resultadoAlertas = document.getElementById(\`resultado_alertas_\${numeroPregunta}\`);
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
          if (esCorrecta) {
              resultadoAlertas.innerHTML = '<div class="alert multi-select-feedback-success"><i class="fas fa-check-circle me-2"></i>¡Correcto! Tu respuesta es acertada.</div>';
          } else {
              resultadoAlertas.innerHTML = '<div class="alert multi-select-feedback-error"><i class="fas fa-times-circle me-2"></i>Incorrecto. La opción seleccionada no es la correcta.</div>';
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
      const preguntaElement = document.querySelector(\`[data-pregunta="\${numeroPregunta}"]\`);
      if (preguntaElement) {
          preguntaElement.classList.remove('d-none');
          if (!quizCompletado) {
              preguntaElement.querySelectorAll('.opcion-respuesta').forEach((opcion) => {
                  opcion.classList.remove('seleccionada_alertas', 'act', 'true', 'false');
                  opcion.style.pointerEvents = 'auto';
              });
              const mensajeError = document.getElementById(\`mensaje_error_\${numeroPregunta}\`);
              const resultadoAlertas = document.getElementById(\`resultado_alertas_\${numeroPregunta}\`);
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
          const text = ok ? 'Has contestado correctamente' : 'Has contestado incorrectamente';
          items.push(\`<li class="mb-1" style="color:#fff">Pregunta \${i}: \${text} \${icon}</li>\`);
      }

      const feedbackExterno = document.getElementById('feedback-final-externo');
      if (feedbackExterno) {
          feedbackExterno.innerHTML = \`<div class="resumen-final"><div class="text-center \${feedbackClass}"><div style="color:#fff"><strong>Resumen:</strong> Tus respuestas correctas fueron \${respuestasCorrectas_count} de \${totalPreguntas} (\${porcentaje}%)</div><ul class="mt-2 list-unstyled" style="color:#fff">\${items.join('')}</ul></div></div>\`;
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
  actualizarProgresoPreguntas();`
}

const generateQuizJS = (activityData: any) => {
  const preguntas = activityData.preguntas || []
  const respuestasCorrectas = preguntas.reduce((acc: any, p: any, i: number) => {
    acc[i + 1] = String.fromCharCode(97 + p.correcta)
    return acc
  }, {})
  
  return `  let preguntaActual = 1;
  let respuestasUsuario = {};
  let resultados = {};
  let quizCompletado = false;
  let preguntaActualNav = 1;
  const totalPreguntas = ${preguntas.length};
  let preguntasValidadas = 0;
  const respuestasCorrectas = ${JSON.stringify(respuestasCorrectas)};

  function actualizarProgresoPreguntas() {
      const progressText = document.getElementById('progress-text');
      if (progressText) progressText.textContent = \`\${preguntasValidadas} de \${totalPreguntas} preguntas validadas\`;
      const barra = document.getElementById('progress-bar-fill');
      if (barra) barra.style.width = ((preguntasValidadas / totalPreguntas) * 100) + '%';
  }

  function validarPregunta(numeroPregunta) {
      const preguntaElement = document.querySelector(\`[data-pregunta="\${numeroPregunta}"]\`);
      const opcionSeleccionada = preguntaElement.querySelector('.opcion-respuesta.seleccionada_alertas');
      const mensajeError = document.getElementById(\`mensaje_error_\${numeroPregunta}\`);
      const resultadoAlertas = document.getElementById(\`resultado_alertas_\${numeroPregunta}\`);
      const btnValidar = preguntaElement.querySelector('.btn-validar');
      const btnSiguienteContainer = preguntaElement.querySelector('.btn-siguiente-container');

      if (!opcionSeleccionada) {
          mensajeError.classList.remove('d-none');
          mensajeError.innerHTML = '<div class="alert multi-select-feedback-warning"><i class="fas fa-info-circle me-2"></i>Debes seleccionar una opción antes de validar.</div>';
          resultadoAlertas.classList.add('d-none');
          return;
      }

      mensajeError.classList.add('d-none');
      const respuestaUsuario = opcionSeleccionada.getAttribute('data-letra');
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
          if (esCorrecta) {
              resultadoAlertas.innerHTML = '<div class="alert multi-select-feedback-success"><i class="fas fa-check-circle me-2"></i>¡Correcto! Tu respuesta es acertada.</div>';
          } else {
              resultadoAlertas.innerHTML = '<div class="alert multi-select-feedback-error"><i class="fas fa-times-circle me-2"></i>Incorrecto. La opción seleccionada no es la correcta.</div>';
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
      const preguntaElement = document.querySelector(\`[data-pregunta="\${numeroPregunta}"]\`);
      if (preguntaElement) {
          preguntaElement.classList.remove('d-none');
          if (!quizCompletado) {
              preguntaElement.querySelectorAll('.opcion-respuesta').forEach((opcion) => {
                  opcion.classList.remove('seleccionada_alertas', 'act', 'true', 'false');
                  opcion.style.pointerEvents = 'auto';
              });
              const mensajeError = document.getElementById(\`mensaje_error_\${numeroPregunta}\`);
              const resultadoAlertas = document.getElementById(\`resultado_alertas_\${numeroPregunta}\`);
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
          const text = ok ? 'Has contestado correctamente' : 'Has contestado incorrectamente';
          items.push(\`<li class="mb-1" style="color:#fff">Pregunta \${i}: \${text} \${icon}</li>\`);
      }

      const feedbackExterno = document.getElementById('feedback-final-externo');
      if (feedbackExterno) {
          feedbackExterno.innerHTML = \`<div class="resumen-final"><div class="text-center \${feedbackClass}"><div style="color:#fff"><strong>Resumen:</strong> Tus respuestas correctas fueron \${respuestasCorrectas_count} de \${totalPreguntas} (\${porcentaje}%)</div><ul class="mt-2 list-unstyled" style="color:#fff">\${items.join('')}</ul></div></div>\`;
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
  actualizarProgresoPreguntas();`
}

const generateOrdenarPasosJS = (activityData: any) => {
  const pasos = activityData.pasos || []
  return `  const pasosCorrectos = ${JSON.stringify(pasos)};
  const contenedorActividad = document.getElementById('ordenar-pasos-actividad');
  const esMovil = window.innerWidth <= 768;

  if (esMovil) {
      renderizarVersionMobile(contenedorActividad);
  } else {
      renderizarVersionWeb(contenedorActividad);
  }

  window.addEventListener('resize', function () {
      const nuevaEsMovil = window.innerWidth <= 768;
      if (nuevaEsMovil !== esMovil) {
          location.reload();
      }
  });

  function renderizarVersionWeb(contenedor) {
      function generarPasosDesordenados() {
          return pasosCorrectos.map((texto, i) => ({ numero: i + 1, texto })).sort(() => Math.random() - 0.5);
      }
      
      let pasos = generarPasosDesordenados();
      let resultado = "";

      const webVersion = document.createElement('div');
      webVersion.className = 'web-version';
      const contenedorPasos = document.createElement('div');
      contenedorPasos.className = 'contenedor-pasosWEB';
      const resultadoContenedor = document.createElement('div');
      resultadoContenedor.className = 'resultado-contenedor';
      resultadoContenedor.style.display = 'none';
      const botonesContainer = document.createElement('div');
      botonesContainer.className = 'botones-containerOP';
      const btnValidar = document.createElement('button');
      btnValidar.className = 'sf-btn sf-btn-purple btn-validar';
      btnValidar.disabled = true;
      btnValidar.innerHTML = '<i class="fa fa-check-circle"></i> Validar';
      const btnReiniciar = document.createElement('button');
      btnReiniciar.className = 'sf-btn sf-btn-purple btn-reiniciar';
      btnReiniciar.innerHTML = '<i class="fas fa-repeat"></i> Reiniciar';

      function crearTarjetaPasoWeb(paso, index) {
          const esCorrecto = resultado && paso.texto === pasosCorrectos[index];
          const tarjeta = document.createElement('div');
          tarjeta.className = \`tarjeta-paso1 \${resultado ? (esCorrecto ? 'correcto' : 'incorrecto') : ''}\`;
          tarjeta.draggable = true;
          tarjeta.innerHTML = \`<div class="contenido-tarjeta"><span>\${paso.numero}. \${paso.texto}</span></div>\`;
          tarjeta.addEventListener('dragstart', (e) => { e.dataTransfer.setData("index", index); btnValidar.disabled = false; });
          tarjeta.addEventListener('dragover', (e) => e.preventDefault());
          tarjeta.addEventListener('drop', (e) => {
              const draggedIndex = e.dataTransfer.getData("index");
              const temp = pasos[draggedIndex];
              pasos[draggedIndex] = pasos[index];
              pasos[index] = temp;
              actualizarTarjetasWeb();
          });
          return tarjeta;
      }

      function actualizarTarjetasWeb() {
          contenedorPasos.innerHTML = '';
          pasos.forEach((paso, index) => contenedorPasos.appendChild(crearTarjetaPasoWeb(paso, index)));
      }

      pasos.forEach((paso, index) => contenedorPasos.appendChild(crearTarjetaPasoWeb(paso, index)));
      botonesContainer.appendChild(btnValidar);
      botonesContainer.appendChild(btnReiniciar);
      webVersion.appendChild(contenedorPasos);
      webVersion.appendChild(resultadoContenedor);
      webVersion.appendChild(botonesContainer);
      contenedor.appendChild(webVersion);

      btnValidar.addEventListener('click', function () {
          const correctCount = pasos.filter((paso, index) => paso.texto === pasosCorrectos[index]).length;
          const porcentaje = Math.round((correctCount / pasosCorrectos.length) * 100);
          resultado = correctCount === pasosCorrectos.length ? "correcto" : "incorrecto";
          resultadoContenedor.style.display = 'block';
          resultadoContenedor.innerHTML = \`<p class="text-md mt-4 font-bold text-center">\${correctCount} de \${pasosCorrectos.length} respuestas correctas \${porcentaje}%</p><p class="resultadoOP \${resultado}">\${resultado === "correcto" ? "¡Excelente trabajo! Has ordenado todo correctamente." : "Sigue practicando, ¡puedes hacerlo mejor!"}</p>\`;
          btnValidar.disabled = true;
          actualizarTarjetasWeb();
      });

      btnReiniciar.addEventListener('click', function () {
          pasos = generarPasosDesordenados();
          resultado = "";
          resultadoContenedor.style.display = 'none';
          btnValidar.disabled = true;
          actualizarTarjetasWeb();
      });
  }

  function renderizarVersionMobile(contenedor) {
      let respuestas = Array(pasosCorrectos.length).fill("");
      let colores = Array(pasosCorrectos.length).fill("");
      let mostrarResultado = false;
      const opciones = pasosCorrectos.map((_, i) => \`Paso \${i + 1}\`);

      const mobileVersion = document.createElement('div');
      mobileVersion.className = 'mobile-version';
      const contenedorPasos = document.createElement('div');
      contenedorPasos.className = 'contenedor-pasosMOBILE';
      const resultadoContenedor = document.createElement('div');
      resultadoContenedor.style.display = 'none';
      const botonesContainer = document.createElement('div');
      botonesContainer.className = 'botones-container';
      const btnValidar = document.createElement('button');
      btnValidar.className = 'sf-btn sf-btn-purple btn-validar';
      btnValidar.disabled = true;
      btnValidar.innerHTML = '<i class="fas fa-check"></i> Validar';
      const btnReiniciar = document.createElement('button');
      btnReiniciar.className = 'sf-btn sf-btn-purple btn-reiniciar';
      btnReiniciar.innerHTML = '<i class="fas fa-repeat"></i> Reiniciar';

      function crearTarjetaPasoMobile(paso, index) {
          const tarjeta = document.createElement('div');
          tarjeta.className = \`tarjeta-paso-mobile \${colores[index]} \${respuestas[index] !== "" && !mostrarResultado ? 'seleccionado' : ''}\`;
          const texto = document.createElement('p');
          texto.textContent = paso;
          const select = document.createElement('select');
          select.className = \`respuesta-select \${colores[index]} \${respuestas[index] !== "" && !mostrarResultado ? 'seleccionado' : ''}\`;
          select.disabled = mostrarResultado;
          select.innerHTML = '<option value="">Seleccione...</option>' + opciones.map(o => \`<option value="\${o}">\${o}</option>\`).join('');
          select.value = respuestas[index];
          select.addEventListener('change', (e) => {
              respuestas[index] = e.target.value;
              btnValidar.disabled = !respuestas.every(r => r !== "");
              actualizarTarjetasMobile();
          });
          tarjeta.appendChild(texto);
          tarjeta.appendChild(select);
          return tarjeta;
      }

      function actualizarTarjetasMobile() {
          contenedorPasos.innerHTML = '';
          pasosCorrectos.forEach((paso, index) => contenedorPasos.appendChild(crearTarjetaPasoMobile(paso, index)));
      }

      pasosCorrectos.forEach((paso, index) => contenedorPasos.appendChild(crearTarjetaPasoMobile(paso, index)));
      botonesContainer.appendChild(btnValidar);
      botonesContainer.appendChild(btnReiniciar);
      mobileVersion.appendChild(contenedorPasos);
      mobileVersion.appendChild(resultadoContenedor);
      mobileVersion.appendChild(botonesContainer);
      contenedor.appendChild(mobileVersion);

      btnValidar.addEventListener('click', function () {
          colores = respuestas.map((r, i) => r === \`Paso \${i + 1}\` ? "correcto" : "incorrecto");
          const correctCount = colores.filter(c => c === "correcto").length;
          const porcentaje = Math.round((correctCount / pasosCorrectos.length) * 100);
          mostrarResultado = true;
          resultadoContenedor.style.display = 'block';
          resultadoContenedor.innerHTML = \`<p class="text-md mt-4 font-bold text-center">Respuestas correctas: \${correctCount} de \${pasosCorrectos.length} (\${porcentaje}%)</p><p class="text-md mt-2 text-center \${correctCount === pasosCorrectos.length ? 'texto-verde' : 'texto-rojo'}">\${correctCount === pasosCorrectos.length ? "¡Excelente trabajo!" : "Sigue practicando!"}</p>\`;
          btnValidar.disabled = true;
          actualizarTarjetasMobile();
      });

      btnReiniciar.addEventListener('click', function () {
          respuestas = Array(pasosCorrectos.length).fill("");
          colores = Array(pasosCorrectos.length).fill("");
          mostrarResultado = false;
          resultadoContenedor.style.display = 'none';
          btnValidar.disabled = true;
          actualizarTarjetasMobile();
      });
  }`
}

const generateSelectActivityJS = (activityData: any) => {
  const correctAnswers = activityData.selects.map((s: any) => String(s.correct + 1))
  
  return `  const correctAnswers = ${JSON.stringify(correctAnswers)};
  let selectedValues = {};

  const selects = document.querySelectorAll('.select');
  const validateBtn = document.querySelector('.select-validate');
  const resetBtn = document.querySelector('.select-reset');
  const feedbackDiv = document.querySelector('.select-feedback');
  const errorContainer = document.querySelector('.select-error-container');

  selects.forEach(select => {
    selectedValues[select.dataset.index] = "0";
  });

  function updateSelectOptions() {
    selects.forEach(select => {
      Array.from(select.options).forEach(option => {
        if (option.value !== "0") option.hidden = false;
      });
    });

    selects.forEach(currentSelect => {
      const currentValue = currentSelect.value;
      if (currentValue !== "0") {
        selects.forEach(otherSelect => {
          if (otherSelect !== currentSelect) {
            const optionToHide = otherSelect.querySelector(\`option[value="\${currentValue}"]\`);
            if (optionToHide) optionToHide.hidden = true;
          }
        });
      }
    });

    selects.forEach(select => {
      if (select.value !== "0") {
        select.classList.add('select-selected');
      } else {
        select.classList.remove('select-selected');
      }
    });
  }

  selects.forEach(select => {
    select.addEventListener('change', function () {
      selectedValues[select.dataset.index] = select.value;
      updateSelectOptions();
    });
  });

  validateBtn.addEventListener('click', function () {
    let allSelected = true;
    selects.forEach(select => {
      if (select.value === "0") allSelected = false;
    });

    if (!allSelected) {
      errorContainer.innerHTML = '<div class="select-error">Debe seleccionar todas las opciones antes de validar.</div>';
      return;
    }

    errorContainer.innerHTML = '';

    let correctCount = 0;
    selects.forEach((select, index) => {
      if (select.value === correctAnswers[index]) {
        select.classList.add('select-correct-answer');
        select.classList.remove('select-incorrect-answer');
        correctCount++;
      } else {
        select.classList.add('select-incorrect-answer');
        select.classList.remove('select-correct-answer');
      }
      select.classList.remove('select-selected');
    });

    const percentage = Math.round((correctCount / correctAnswers.length) * 100);
    if (correctCount === correctAnswers.length) {
      feedbackDiv.textContent = '¡Muy bien! Has completado correctamente la actividad.';
      feedbackDiv.classList.remove('hidden', 'select-incorrect');
      feedbackDiv.classList.add('select-correct');
    } else {
      feedbackDiv.textContent = '¡Piénsalo bien! Algunas respuestas no son correctas.';
      feedbackDiv.classList.remove('hidden', 'select-correct');
      feedbackDiv.classList.add('select-incorrect');
    }

    feedbackDiv.insertAdjacentHTML('beforeend', \`<div class="select-results">Tus respuestas correctas son: \${correctCount} de \${correctAnswers.length} (\${percentage}%)</div>\`);

    resetBtn.classList.remove('hidden');
    resetBtn.disabled = false;

    selects.forEach(select => {
      select.disabled = true;
    });

    validateBtn.disabled = true;
  });

  resetBtn.addEventListener('click', function () {
    selects.forEach(select => {
      select.value = "0";
      select.classList.remove('select-correct-answer', 'select-incorrect-answer', 'select-selected');
      select.disabled = false;
      Array.from(select.options).forEach(option => {
        option.hidden = false;
      });
    });

    selects.forEach(select => {
      selectedValues[select.dataset.index] = "0";
    });

    feedbackDiv.innerHTML = '';
    feedbackDiv.classList.add('hidden');
    feedbackDiv.classList.remove('select-correct', 'select-incorrect');

    resetBtn.classList.add('hidden');
    resetBtn.disabled = true;
    validateBtn.disabled = false;

    errorContainer.innerHTML = '';
  });

  updateSelectOptions();`
}

export function DragDropBuilder({ 
  layout, 
  initialLeftContent = [], 
  initialRightContent = [], 
  onContentChange,
  showComponentsPanel = false,
  onLayoutChange,
  momentId,
  lessonName,
  projectId
}: DragDropBuilderProps) {
  // Detectar número de lección desde momentId
  const lessonNumber = momentId ? parseInt(momentId.split('_')[0].replace('momento', '')) : 1
  const [leftContent, setLeftContent] = useState<any[]>(initialLeftContent)
  const [rightContent, setRightContent] = useState<any[]>(initialRightContent)
  const [editingComponent, setEditingComponent] = useState<any>(null)
  
  // Actualizar contenido cuando cambien los props iniciales
  useEffect(() => {
    setLeftContent(initialLeftContent)
    setRightContent(initialRightContent)
  }, [])
  
  // Generar HTML de forma estable
  const generateHTMLStable = () => {
    // Layout especial "momento"
    if (layout === "momento") {
      const sectionClass = `dividerImgSeccion${lessonNumber}`
      const cleanLessonName = lessonName ? lessonName.replace(/^\d+°?\s*/, '') : 'Lección'
      
      return `<section class="container dividerImg ${sectionClass} miga_titulo_curso">
  <div class="sf-min-h-vh80 sf-min-h-xl-0 d-flex align-items-center ">
    <div class="sf-mx-p10-p10">
      <div class="col-lg-8 col-md-12 sf-text-white">
        <h1 class="animate__animated animate__rotateInDownLeft sf-txt-3xl-lg sf-lh-tight mb-2">${lessonNumber}-${cleanLessonName}
          <span class="sf-text-purple"></span>
        </h1>
        <hr class="hr-50">
        <h1 class="sf-txt-md sf-txt-xl-lg sf-txt-300 sf-text-white">
          <span class="animate__animated animate__rotateInDownLeft animate__delay-1s"><i
              class=" fa-regular fa-circle-check sf-text-purple"></i> Marco legal y antecedentes <br></span>
          <span class="animate__animated animate__rotateInDownLeft animate__delay-2s"><i
              class="fa-regular fa-circle-check sf-text-purple"></i> Definiciones de acoso laboral y violencia en el trabajo <br></span>
          <span class="animate__animated animate__rotateInDownLeft animate__delay-3s"><i
              class="fa-regular fa-circle-check sf-text-purple"></i> Obligaciones del empleador y derechos del trabajador
            <br></span>
          <span class="animate__animated animate__rotateInDownLeft animate__delay-4s"><i
              class="fa-regular fa-circle-check sf-text-purple"></i> Tipos de conductas prohibidas y sus consecuencias</span>
        </h1>
      </div>
    </div>
  </div>
</section>`
    }
    
    const cols = getLayoutColumns()
    let html = `<section class="row h-100">\n`
    
    if (layout === "12-12") {
      // Layout 12-12: dos divs separados de col-12
      html += `  <div class="animate__animated animate__fadeInLeftBig col-12 sf-bg-dark sf-ct-col">\n`
      leftContent.forEach(comp => {
        html += `    ${generateComponent(comp)}\n`
      })
      html += `    \n  </div>\n\n`
      
      html += `  <div\n    class="animate__animated animate__fadeInRightBig col-md-12 px-5 pt-4 px-0 pb-1 pb-mt-0 d-flex justify-content-center align-items-center">\n`
      html += `    <div class="my-4 my-lg-0 text-center">\n`
      rightContent.forEach(comp => {
        html += `      ${generateComponent(comp)}\n`
      })
      html += `    </div>\n  </div>\n`
    } else {
      // Otros layouts (6-6, 5-7, 7-5)
      html += `  <!-- Columna izquierda -->\n`
      html += `  <div class="animate__animated animate__fadeInLeftBig ${cols.left} sf-bg-dark sf-cl-row text-white">\n`
      leftContent.forEach(comp => {
        html += `    ${generateComponent(comp)}\n`
      })
      html += `  </div>\n\n`
      
      // Columna derecha (si existe)
      if (cols.right) {
        html += `  <!-- Columna derecha con actividad -->\n`
        html += `  <div class="animate__animated animate__fadeInRightBig ${cols.right} sf-cr-row">\n`
        rightContent.forEach(comp => {
          html += `    ${generateComponent(comp)}\n`
        })
        html += `  </div>\n`
      }
    }
    
    html += `</section>`
    return html
  }

  // Sincronizar cambios automáticamente
  useEffect(() => {
    const htmlContent = generateHTMLStable()
    const videos = [...leftContent, ...rightContent].filter(c => c.type === 'video')
    const images = [...leftContent, ...rightContent].filter(c => c.type === 'image' && c.imageFile)
    const audios = [...leftContent, ...rightContent].filter(c => c.type === 'audio' && c.audioFile)
    
    // Agregar imágenes de actividad select-imagen
    const selectImagenActivity = [...leftContent, ...rightContent].find(c => c.type === 'activity' && c.activityType === 'select-imagen')
    if (selectImagenActivity?.activityData?.items) {
      selectImagenActivity.activityData.items.forEach((item: any) => {
        if (item.imageFile) {
          images.push({ imageFile: item.imageFile, src: item.imagen })
        }
      })
    }
    
    // Generar CSS y JS para actividades
    let cssContent = ''
    let jsContent = ''
    
    const selectActivities = [...leftContent, ...rightContent].filter(c => c.type === 'activity' && c.activityType === 'select-text' && c.activityData?.text)
    const ordenarPasosActivities = [...leftContent, ...rightContent].filter(c => c.type === 'activity' && c.activityType === 'ordenar-pasos' && c.activityData?.pasos?.length > 0)
    const selectImagenActivities = [...leftContent, ...rightContent].filter(c => c.type === 'activity' && c.activityType === 'select-imagen' && c.activityData?.items?.length > 0)
    const dragClasificarActivities = [...leftContent, ...rightContent].filter(c => c.type === 'activity' && c.activityType === 'drag-clasificar' && c.activityData?.items?.length > 0)
    const verdaderoFalsoActivities = [...leftContent, ...rightContent].filter(c => c.type === 'activity' && c.activityType === 'verdadero-falso' && c.activityData?.preguntas?.length > 0)
    const quizActivities = [...leftContent, ...rightContent].filter(c => c.type === 'activity' && c.activityType === 'quiz' && c.activityData?.preguntas?.length > 0)
    
    if (selectActivities.length > 0) {
      cssContent = generateSelectActivityCSS()
      jsContent = generateSelectActivityJS(selectActivities[0].activityData)
    } else if (ordenarPasosActivities.length > 0) {
      cssContent = generateOrdenarPasosCSS()
      jsContent = generateOrdenarPasosJS(ordenarPasosActivities[0].activityData)
    } else if (selectImagenActivities.length > 0) {
      cssContent = generateSelectImagenCSS()
      jsContent = generateSelectImagenJS(selectImagenActivities[0].activityData, momentId || '')
    } else if (dragClasificarActivities.length > 0) {
      cssContent = generateDragClasificarCSS()
      jsContent = generateDragClasificarJS(dragClasificarActivities[0].activityData)
    } else if (verdaderoFalsoActivities.length > 0) {
      cssContent = generateQuizCSS()
      jsContent = generateVerdaderoFalsoJS(verdaderoFalsoActivities[0].activityData)
    } else if (quizActivities.length > 0) {
      cssContent = generateQuizCSS()
      jsContent = generateQuizJS(quizActivities[0].activityData)
    }
    // Si no hay actividades, enviar strings vacíos para limpiar
    
    onContentChange(leftContent, rightContent, htmlContent, videos, images, audios, cssContent, jsContent)
  }, [leftContent, rightContent])

  const components = [
    { id: "titulo", name: "Título", icon: <Type className="w-4 h-4" />, type: "titulo" },
    { id: "texto", name: "Texto (p)", icon: <Type className="w-4 h-4" />, type: "texto" },
    { id: "instruccion", name: "Instrucción", icon: <Type className="w-4 h-4" />, type: "instruccion" },
    { id: "image", name: "Imagen", icon: <Image className="w-4 h-4" />, type: "image" },
    { id: "audio", name: "Audio", icon: <Video className="w-4 h-4" />, type: "audio" },
    { id: "button", name: "Botón", icon: <MousePointer className="w-4 h-4" />, type: "button" },
    { id: "table", name: "Tabla", icon: <Table className="w-4 h-4" />, type: "table" },
    { id: "video", name: "Video", icon: <Video className="w-4 h-4" />, type: "video" },
    { id: "activity", name: "Actividad", icon: <Puzzle className="w-4 h-4" />, type: "activity" }
  ]

  const getLayoutColumns = () => {
    switch (layout) {
      case "momento": return { left: "col-12", right: null }
      case "6-6": return { left: "col-12 col-lg-6", right: "col-12 col-lg-6" }
      case "5-7": return { left: "col-12 col-lg-5", right: "col-12 col-lg-7" }
      case "7-5": return { left: "col-12 col-lg-7", right: "col-12 col-lg-5" }
      case "12-12": return { left: "col-12", right: "col-12" }
      default: return { left: "col-12 col-lg-6", right: "col-12 col-lg-6" }
    }
  }

  const generateComponent = (comp: any, forPreview = false) => {
    const text = comp.text || '';
    switch (comp.type) {
      case "titulo":
        return `<h1 class="sf-text-white text-center">${text || 'Título aquí'} <br>
        <span class="sf-text-purple">${comp.subtitle || ''}
        </span>
      </h1>`
      case "texto":
        const textClass = comp.theme === 'light' ? 'text-justify' : 'sf-text-white text-justify'
        return `<p class="${textClass}">
        <span class="sf-txt-800">${comp.highlight || ''}</span> ${text || 'Texto de contenido aquí...'}
      </p>`
      case "instruccion":
        return `<i class="hipt hipt-light mb-3">
        ${text || 'Haz clic en cada botón según la caja de cambios para conocer los compromisos en Seguridad Vial con los vehículos'}
        <i class="icon-inline icon-inline--start fa-solid fa-arrow-turn-down"></i>
      </i>`
      case "image":
        if (forPreview) {
          return `<div style="background: #f1f5f9; border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; border: 2px dashed #cbd5e1;">
  <svg style="width: 48px; height: 48px; color: #94a3b8; margin-bottom: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
  <div style="color: #64748b; font-weight: 600; font-size: 13px;">🖼️ Imagen</div>
</div>`
        }
        const imgSrc = comp.imageFile ? `./${momentId}/img/${comp.src}` : (comp.src || '/placeholder.svg')
        return `<img src="${imgSrc}" alt="avatar" class="sf-img-80 sf-img-sm-60 sf-img-md-50 sf-img-lg-80 sf-img-xl-40 mx-auto mb-2">`
      case "audio":
        if (forPreview) {
          return `<div style="background: #e0f2fe; border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; border: 2px dashed #7dd3fc;">
  <svg style="width: 48px; height: 48px; color: #0284c7; margin-bottom: 0.5rem;" fill="currentColor" viewBox="0 0 20 20">
    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
  </svg>
  <div style="color: #0369a1; font-weight: 600; font-size: 13px;">🎧 Audio</div>
</div>`
        }
        const audioSrc = comp.audioFile ? `./${momentId}/audio/${comp.src}` : (comp.src || '')
        const transcription = comp.transcription || '[]'
        return `<div class="audio-center py-2">
        <audio class="audio-con-transcripcion" controls data-transcripcion='${transcription}'>
          <source src="${audioSrc}" type="audio/mp3">
        </audio>
        <i class="transcription-toggle fas fa-closed-captioning audio-estilos"></i>
      </div>`
      case "button":
        return `<button class="sf-btn sf-btn-purple ms-1" data-bs-toggle="modal" data-bs-target="#modal"><i class="fas fa-tasks me-2"></i> ${text || 'Actividad'}</button>`
      case "table":
        return `<div class="table-container">
<table class="responsive-table">
  <tr><th>Pasos</th><th>Peligro</th><th>Riesgo</th></tr>
  <tr><td>Peligro 1</td><td>Equipo defectuoso</td><td>Caídas desde alturas</td></tr>
</table>
</div>`
      case "video":
        const videoId = comp.videoId || 'Slide-Video'
        if (forPreview) {
          return `<div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; padding: 3rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; border: 2px solid #475569;">
  <svg style="width: 64px; height: 64px; color: #94a3b8; margin-bottom: 1rem;" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
  </svg>
  <div style="color: #cbd5e1; font-weight: 600; font-size: 14px; text-align: center;">📹 Video: ${videoId}</div>
</div>`
        }
        return `<!-- Aquí va el video -->
<div class="iframe-container mostrar-web d-flex justify-content-center align-items-center" id="${videoId}Web">
  <div class="loader spinner-pulse"></div>
</div>`
      case "activity":
        if (forPreview) {
          const activityTypeNames = {
            'select-text': 'Selección de Texto',
            'select-imagen': 'Selección de Imágenes',
            'ordenar-pasos': 'Ordenar Pasos',
            'drag-clasificar': 'Arrastrar y Clasificar',
            'verdadero-falso': 'Verdadero/Falso',
            'quiz': 'Quiz Opción Múltiple'
          }
          const activityName = activityTypeNames[comp.activityType as keyof typeof activityTypeNames] || 'Actividad'
          return `<div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border-radius: 12px; padding: 3rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; border: 2px solid #6d28d9;">
  <svg style="width: 64px; height: 64px; color: #e9d5ff; margin-bottom: 1rem;" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
  </svg>
  <div style="color: #f3e8ff; font-weight: 600; font-size: 16px; text-align: center; margin-bottom: 0.5rem;">🎯 ${activityName}</div>
  <div style="color: #e9d5ff; font-size: 13px; text-align: center;">Actividad configurada</div>
</div>`
        }
        if (comp.activityType === 'select-imagen' && comp.activityData?.items?.length > 0) {
          return `<div class="quiz-container">
        <div class="items-grid" id="items-grid">
            <!-- Los elementos se generarán dinámicamente con JS -->
        </div>

        <div class="mt-4">
            <p id="error-message" class="text-secondary-color text-center text-md font-bold" style="display: none;"></p>
            <p id="score-text" class="text-md font-bold text-paragraph-light-color text-center" style="display: none;"></p>
            <div class="button-container">
                <button id="validate-btn" class="sf-btn sf-btn-purple">
                    <i class="fa fa-check-circle"></i> Validar
                </button>
                <button id="reset-btn" class="sf-btn sf-btn-secondary" disabled>
                    <i class="fa-solid fa-repeat"></i> Reiniciar
                </button>
            </div>
        </div>
    </div>`
        }
        if (comp.activityType === 'drag-clasificar' && comp.activityData?.items?.length > 0) {
          const { categorias, items } = comp.activityData
          const colClass = categorias.length === 2 ? 'col-md-6' : categorias.length === 3 ? 'col-md-4' : 'col-md-3'
          
          const categoriasHTML = categorias.map((cat: string) => `<div class="${colClass}">
                <div class="drop-zone" data-category="${cat}">
                    <div class="drop-area p-4 border-2 border-primary rounded text-center">
                        <div class="drop-header bg-primary text-white p-2 rounded mb-2">
                            <i class="fas fa-folder me-2"></i>${cat}
                        </div>
                        <p class="text-muted mb-0 d-none d-md-block">Suelta aquí</p>
                    </div>
                    <div id="${cat}-items" class="dropped-items mt-2"></div>
                </div>
            </div>`).join('\n            ')
          
          const botonesMovilHTML = categorias.map((cat: string, i: number) => 
            `<button class="btn btn-outline-primary category-btn" data-category="${cat}">${cat}</button>`
          ).join('\n                ')
          
          return `<div class="w-80 mx-auto">
        <div class="text-center mb-3">
            <div class="progress-info p-2 bg-light rounded">
                <span class="fw-bold">Pregunta <span id="progress">1/${items.length}</span></span>
            </div>
        </div>

        <div class="text-center mb-3">
            <i class="hipt hipt-light">
                Arrastra a cada caja la opción correcta
                <i class="fas fa-arrow-down"></i>
            </i>
        </div>

        <div class="text-center mb-3">
            <div id="draggableText" class="draggable-item p-3 bg-light border rounded shadow-sm" draggable="true">
            </div>
        </div>

        <div class="text-center mb-4 d-md-none">
            <div class="button-group">
                ${botonesMovilHTML}
            </div>
        </div>

        <div class="row g-3 mb-3">
            ${categoriasHTML}
        </div>

        <div class="text-center">
            <div id="feedback" class="mb-3 d-none"></div>
            <div class="mb-3">
                <span class="badge bg-success fs-6">Correctas: <span id="correctCount">0</span></span>
            </div>
            <button id="resetBtn" class="sf-btn sf-btn-blue"><i class="fas fa-repeat"></i> Reiniciar</button>
        </div>
    </div>`
        }
        if (comp.activityType === 'verdadero-falso' && comp.activityData?.preguntas?.length > 0) {
          const { preguntas } = comp.activityData
          const preguntasHTML = preguntas.map((p: any, i: number) => {
            const esUltima = i === preguntas.length - 1
            const siguienteBtn = esUltima ? '' :
              `<button class="sf-btn sf-btn-purple d-none" data-siguiente="${i + 2}"><i class="fa-solid fa-circle-arrow-right"></i> Continuar</button>`
            
            return `<div class="preguntas_01 ${i > 0 ? 'd-none' : ''}" data-pregunta="${i + 1}">
            <div class="ctItem fixed-size-question-box">
                <p class="text-paragraph-light-color text-p-size text-left" style="font-family: Montserrat, sans-serif;">
                    <strong>Pregunta ${i + 1}: </strong>${p.texto || ''}
                </p>
                <div class="opciones-pregunta">
                    <p class="opcion-respuesta" data-valor="true">A. Verdadero</p>
                    <p class="opcion-respuesta" data-valor="false">B. Falso</p>
                </div>
                <div class="d-flex justify-center">
                    <button class="sf-btn sf-btn-purple btn-validar" data-pregunta="${i + 1}">
                        <i class="fas fa-check-circle"></i> Validar
                    </button>
                </div>
                <div class="d-flex justify-center d-none btn-siguiente-container">
                    ${siguienteBtn}
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <div id="mensaje_error_${i + 1}" class="mt-3 d-none"></div>
                <div id="resultado_alertas_${i + 1}" class="mt-3 d-none"></div>
            </div>
        </div>`
          }).join('\n\n        ')
          
          return `<div class="mx-lg-0" id="preguntas-container">
        <div>
            <div id="contador-preguntas" class="text-center">
                <p id="progress-text">0 de ${preguntas.length} preguntas validadas</p>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" id="progress-bar-fill"></div>
            </div>
        </div>

        ${preguntasHTML}

        <div id="navegacion-resumen" class="d-none">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <button id="btnAnteriorNav" class="sf-btn sf-btn-outline-purple">
                    <i class="fa-solid fa-chevron-left"></i> Anterior
                </button>
                <span class="quiz-counter">
                    <span id="preguntaActualNav">1</span> de <span id="totalPreguntasNav">${preguntas.length}</span>
                </span>
                <button id="btnSiguienteNav" class="sf-btn sf-btn-outline-purple">
                    Siguiente <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            <div class="text-center">
                <button class="btn sf-btn sf-btn-purple btn-reiniciar">
                    <i class="fas fa-redo me-2"></i>Reiniciar
                </button>
            </div>
        </div>

        <div id="feedback-final-externo" class="d-none"></div>
        <div id="resultado_final" class="d-none"></div>
    </div>`
        }
        if (comp.activityType === 'quiz' && comp.activityData?.preguntas?.length > 0) {
          const { preguntas } = comp.activityData
          const preguntasHTML = preguntas.map((p: any, i: number) => {
            const opciones = (p.opciones || ['', '', '']).map((opt: string, optIndex: number) => 
              `<p class="opcion-respuesta" data-letra="${String.fromCharCode(97 + optIndex)}">${String.fromCharCode(65 + optIndex)}. ${opt}</p>`
            ).join('\n                    ')
            
            const esUltima = i === preguntas.length - 1
            const siguienteBtn = esUltima ? 
              `<button class="sf-btn sf-btn-purple d-none sf-btn-success btn-finalizar"><i class="fas fa-check-double"></i> Finalizar</button>` :
              `<button class="sf-btn sf-btn-purple d-none" data-siguiente="${i + 2}"><i class="fa-solid fa-circle-arrow-right"></i> Continuar</button>`
            
            return `<div class="preguntas_01 ${i > 0 ? 'd-none' : ''}" data-pregunta="${i + 1}">
            <div class="ctItem fixed-size-question-box">
                <p class="text-paragraph-light-color text-p-size text-left" style="font-family: Montserrat, sans-serif;">
                    <strong>Pregunta ${i + 1}: </strong>${p.texto || ''}
                </p>
                <div class="opciones-pregunta">
                    ${opciones}
                </div>
                <div class="d-flex justify-center">
                    <button class="sf-btn sf-btn-purple btn-validar" data-pregunta="${i + 1}">
                        <i class="fas fa-check-circle"></i> Validar
                    </button>
                </div>
                <div class="d-flex justify-center d-none btn-siguiente-container">
                    ${siguienteBtn}
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <div id="mensaje_error_${i + 1}" class="mt-3 d-none"></div>
                <div id="resultado_alertas_${i + 1}" class="mt-3 d-none"></div>
            </div>
        </div>`
          }).join('\n\n        ')
          
          return `<div class="mx-lg-0" id="preguntas-container">
        <div>
            <div id="contador-preguntas" class="mb-2 text-center">
                <p id="progress-text">0 de ${preguntas.length} preguntas validadas</p>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" id="progress-bar-fill"></div>
            </div>
        </div>

        ${preguntasHTML}

        <div id="navegacion-resumen" class="d-none">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <button id="btnAnteriorNav" class="sf-btn sf-btn-outline-purple">
                    <i class="fa-solid fa-chevron-left"></i> Anterior
                </button>
                <span class="quiz-counter">
                    <span id="preguntaActualNav">1</span> de <span id="totalPreguntasNav">${preguntas.length}</span>
                </span>
                <button id="btnSiguienteNav" class="sf-btn sf-btn-outline-purple">
                    Siguiente <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            <div class="text-center">
                <button class="btn sf-btn sf-btn-purple btn-reiniciar">
                    <i class="fas fa-redo me-2"></i>Reiniciar
                </button>
            </div>
        </div>

        <div id="feedback-final-externo" class="d-none"></div>
    </div>`
        }
        if (comp.activityType === 'ordenar-pasos' && comp.activityData?.pasos?.length > 0) {
          const { pasos } = comp.activityData
          return `<div id="ordenar-pasos-actividad" class="ordenar-pasos-container">
        <!-- Contenido generado por JavaScript -->
    </div>`
        }
        if (comp.activityType === 'select-text' && comp.activityData?.text) {
          const { text, selects, theme, globalOptions } = comp.activityData
          const textColorClass = theme === 'light' ? '' : 'sf-text-white'
          let selectIndex = 0
          
          // Dividir en párrafos primero
          const paragraphs = text.split('\n').filter(p => p.trim()).map(paragraph => {
            // Reemplazar {{}} con los selects en cada párrafo
            const processedParagraph = paragraph.replace(/\{\{\}\}/g, () => {
              const select = selects[selectIndex]
              if (!select) return '{{}}'
              
              const optionsHtml = (globalOptions || []).map((opt: string, i: number) => 
                `<option value="${i + 1}">${opt}</option>`
              ).join('')
              
              const selectHtml = `<select class="select" data-index="${selectIndex}"><option value="0">Seleccione...</option>${optionsHtml}</select>`
              
              selectIndex++
              return selectHtml
            })
            
            return `<div class="select-item">
                <p class="select-text${textColorClass ? ' ' + textColorClass : ''}">${processedParagraph}</p>
            </div>`
          }).join('\n\n            ')
          
          return `<div class="select-container pcambio-4 rounded-lg w-full max-w-2xl mx-auto">
        <div class="select-activity space-y-4 text-justify">
            ${paragraphs}
        </div>
        <div class="select-error-container mb-3"></div>
        <div class="select-feedback mt-4 hidden"></div>
        <div class="select-actions justify-center mt-6">
            <button class="select-validate sf-btn sf-btn-purple">
                <i class="fa fa-check-circle"></i> Validar
            </button>
            <button class="select-reset sf-btn sf-btn-purple sf-btn-gray hidden" disabled>
                <i class="fa fa-repeat"></i> Reiniciar
            </button>
        </div>
    </div>`
        }
        return `<div class="activity-container-img">
  <!-- Contenido de actividad -->
</div>`
      default:
        return `<div>Componente ${comp.type}</div>`
    }
  }

  const generateHTML = () => {
    const cols = getLayoutColumns()
    let html = `<section class="row  h-100">\n`
    
    if (layout === "12-12") {
      // Layout 12-12: dos divs separados de col-12
      html += `  <div class="animate__animated animate__fadeInLeftBig col-12 sf-bg-dark sf-ct-col">\n`
      leftContent.forEach(comp => {
        html += `    ${generateComponent(comp)}\n`
      })
      html += `    \n  </div>\n\n`
      
      html += `  <div\n    class="animate__animated animate__fadeInRightBig col-md-12 px-5 pt-4 px-0 pb-1 pb-mt-0 d-flex justify-content-center align-items-center">\n`
      html += `    <div class="my-4 my-lg-0 text-center">\n`
      rightContent.forEach(comp => {
        html += `      ${generateComponent(comp)}\n`
      })
      html += `    </div>\n  </div>\n`
    } else {
      // Otros layouts
      html += `  <div class="animate__animated animate__fadeInLeftBig ${cols.left} sf-bg-dark sf-cl-row">\n`
      html += `    <div class="ms-xl-4 mx-xl-0">\n`
      leftContent.forEach(comp => {
        html += `      ${generateComponent(comp)}\n`
      })
      html += `    </div>\n  </div>\n`
      
      // Columna derecha (si existe)
      if (cols.right) {
        html += `  <div class="animate__animated animate__fadeInRightBig ${cols.right} p-0 d-flex justify-content-center">\n`
        rightContent.forEach(comp => {
          html += `    ${generateComponent(comp)}\n`
        })
        html += `  </div>\n`
      }
    }
    
    html += `</section>`
    return html
  }

  const addToColumn = (component: any, column: 'left' | 'right') => {
    const newComp = { ...component, id: Date.now() }
    if (column === 'left') {
      setLeftContent(prev => [...prev, newComp])
    } else {
      setRightContent(prev => [...prev, newComp])
    }
  }

  const removeComponent = (id: number, column: 'left' | 'right') => {
    if (column === 'left') {
      setLeftContent(prev => prev.filter(c => c.id !== id))
    } else {
      setRightContent(prev => prev.filter(c => c.id !== id))
    }
  }

  const cols = getLayoutColumns()

  // Si es layout "momento", mostrar vista especial
  if (layout === "momento") {
    return (
      <div className="h-full flex">
        <div className="flex-1 p-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">Layout Momento - Portada de Lección {lessonNumber}</h3>
              {onLayoutChange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLayoutChange(layout)}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-500"
                  title="Volver al selector de layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Cambiar Layout
                </Button>
              )}
            </div>
            <div className="text-sm text-green-600">
              ✓ Layout especial aplicado
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-gradient-to-br from-blue-900 to-purple-900 text-white" style={{ minHeight: 'calc(100vh - 300px)' }}>
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold mb-4">
                {lessonNumber}-{lessonName ? lessonName.replace(/^\d+°?\s*/, '') : 'Lección'}
              </h1>
              <hr className="w-1/2 border-t-2 border-purple-400 mb-6" />
              <div className="space-y-3 text-lg">
                <p className="animate-fade-in">
                  <i className="fa-regular fa-circle-check text-purple-400 mr-2"></i>
                  Marco legal y antecedentes
                </p>
                <p className="animate-fade-in" style={{animationDelay: '0.5s'}}>
                  <i className="fa-regular fa-circle-check text-purple-400 mr-2"></i>
                  Definiciones de acoso laboral y violencia en el trabajo
                </p>
                <p className="animate-fade-in" style={{animationDelay: '1s'}}>
                  <i className="fa-regular fa-circle-check text-purple-400 mr-2"></i>
                  Obligaciones del empleador y derechos del trabajador
                </p>
                <p className="animate-fade-in" style={{animationDelay: '1.5s'}}>
                  <i className="fa-regular fa-circle-check text-purple-400 mr-2"></i>
                  Tipos de conductas prohibidas y sus consecuencias
                </p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-800/30 rounded-lg">
              <p className="text-sm text-blue-200">
                💡 Este es un layout especial de portada que se genera automáticamente.
                El nombre de la lección se inserta dinámicamente.
                Solo puede usarse una vez por lección.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Builder Area */}
      <div className="flex-1 p-4">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">Constructor Visual - Layout {layout}</h3>
            {onLayoutChange && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLayoutChange(layout)}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-500"
                title="Volver al selector de layout"
              >
                <LayoutGrid className="w-4 h-4" />
                Cambiar Layout
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {(initialLeftContent.length > 0 || initialRightContent.length > 0) && (
              <div className="text-sm text-blue-600">
                Contenido cargado desde archivo guardado
              </div>
            )}
            <div className="text-sm text-green-600">
              ✓ Sincronizado automáticamente
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-white" style={{ minHeight: 'calc(100vh - 300px)' }}>
          <style>{`
            /* Estilos de la plantilla base */
            .sf-bg-dark { background: linear-gradient(135deg, #1e3a8a, #3730a3); }
            .sf-cl-row { color: white; padding: 2rem; }
            .sf-cr-row { background: #f8fafc; padding: 2rem; }
            .sf-cb-row { background: white; padding: 2rem; }
            .sf-ct-col { background: linear-gradient(135deg, #1e3a8a, #3730a3); color: white; padding: 2rem; text-align: center; }
            .sf-text-white { color: white !important; }
            .sf-text-purple { color: #7c3aed !important; }
            .sf-txt-800 { font-weight: 800; }
            /* Override para visualización en columna derecha */
            .sf-cr-row .sf-text-white { color: #1e293b !important; }
            .sf-cr-row h1, .sf-cr-row p { color: #1e293b !important; }
            .sf-btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
            .sf-btn-purple { background: #7c3aed; color: white; }
            .sf-btn-purple:hover { background: #6d28d9; }
            .sf-img-80 { width: 80px; height: 80px; border-radius: 50%; }
            .responsive-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            .responsive-table th, .responsive-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .responsive-table th { background-color: #f2f2f2; }
            .activity-container-img { background: #f8f9fa; padding: 2rem; border-radius: 12px; }
            .animate__animated { animation-duration: 1s; }
            .animate__fadeInLeftBig { animation-name: fadeInLeft; }
            .animate__fadeInRightBig { animation-name: fadeInRight; }
            @keyframes fadeInLeft { from { opacity: 0; transform: translate3d(-100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
            @keyframes fadeInRight { from { opacity: 0; transform: translate3d(100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
          `}</style>
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Columna Izquierda */}
            <div 
              className={`${cols.left.includes('lg-5') ? 'col-span-5' : cols.left.includes('lg-7') ? 'col-span-7' : cols.left.includes('lg-6') ? 'col-span-6' : 'col-span-12'} sf-bg-dark sf-cl-row border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400`}
              style={{ minHeight: '400px' }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const compData = e.dataTransfer.getData('component')
                if (compData) {
                  const comp = JSON.parse(compData)
                  addToColumn(comp, 'left')
                }
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDragEnter={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/10')
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/10')
              }}
            >
              <div className="text-sm text-white/70 mb-2">Columna Izquierda - Arrastra componentes aquí</div>
              <div className="space-y-2">
                {leftContent.map((comp, index) => (
                  <div key={comp.id} className="p-2 bg-white/10 rounded text-sm relative group">
                    <div dangerouslySetInnerHTML={{ __html: generateComponent(comp, true) }} />
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button 
                        onClick={() => setEditingComponent(comp)}
                        className="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                        title="Editar"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => removeComponent(comp.id, 'left')}
                        className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                        title="Eliminar"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Derecha */}
            {cols.right && (
              <div 
                className={`${cols.right.includes('lg-5') ? 'col-span-5' : cols.right.includes('lg-7') ? 'col-span-7' : layout === '12-12' ? 'col-span-12' : 'col-span-6'} sf-cr-row border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400`}
                style={{ minHeight: '400px' }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const compData = e.dataTransfer.getData('component')
                  if (compData) {
                    const comp = JSON.parse(compData)
                    addToColumn(comp, 'right')
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDragEnter={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/10')
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/10')
                }}
              >
                <div className="text-sm text-gray-600 mb-2">Columna Derecha - Arrastra componentes aquí</div>
                <div className="space-y-2">
                  {rightContent.map((comp, index) => (
                    <div key={comp.id} className="p-2 bg-white rounded shadow-sm text-sm relative group">
                      <div dangerouslySetInnerHTML={{ __html: generateComponent(comp, true) }} />
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                        <button 
                          onClick={() => setEditingComponent(comp)}
                          className="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                          title="Editar"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => removeComponent(comp.id, 'right')}
                          className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {editingComponent && (
        <ComponentEditor
          component={editingComponent}
          onUpdate={(updated) => {
            setLeftContent(leftContent.map(c => c.id === updated.id ? updated : c))
            setRightContent(rightContent.map(c => c.id === updated.id ? updated : c))
          }}
          onClose={() => setEditingComponent(null)}
          projectId={projectId}
          momentId={momentId}
        />
      )}
    </div>
  )
}
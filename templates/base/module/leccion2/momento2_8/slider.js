export function init() {

    // Actividad Select
    const items = [{ "texto": "Asignación de tareas sin sentido: Obligar al trabajador a realizar tareas absurdas, degradantes o que están muy por debajo de sus capacidades, con el objetivo de humillarlo.", "categoria": "SI" }, { "texto": "Evaluación de desempeño objetiva: Dar feedback constructivo y respetuoso sobre el bajo desempeño o los errores de un trabajador, siempre en privado.", "categoria": "NO" }, { "texto": "Aislamiento y exclusión social: Prohibir o desalentar a otros compañeros a hablar con la víctima o excluirla intencionalmente de reuniones de trabajo importantes.", "categoria": "SI" }, { "texto": "Críticas destructivas y ofensivas: Juzgar o criticar el desempeño del trabajador con gritos, insultos o comentarios despectivos en público o privado.", "categoria": "SI" }, { "texto": "Aplicación de sanciones justificadas: Imponer una amonestación o sanción disciplinaria, con el debido proceso y base legal, por incumplimiento de funciones.", "categoria": "NO" }, { "texto": "Amenazas a la permanencia: Amenazar constantemente al trabajador con el despido o con sanciones sin fundamento justificado, con el fin de intimidarlo.", "categoria": "SI" }, { "texto": "Cambio de funciones por reestructuración: Modificar el puesto o las tareas del trabajador, si la decisión obedece a necesidades técnicas u organizacionales reales y se respeta el contrato.", "categoria": "NO" }, { "texto": "Sobrecarga intencional: Asignar una cantidad de trabajo o establecer plazos de entrega que se sabe son imposibles de cumplir, con el objetivo de provocar el fracaso.", "categoria": "SI" }, { "texto": "Exigencia de cumplimiento de metas: Requerir que el trabajador cumpla con los objetivos y plazos establecidos que son exigibles en su rol y que son equitativos para el equipo.", "categoria": "NO" }, { "texto": "Diferencia de opiniones o discusión puntual: Tener una discusión tensa o un desacuerdo sobre un tema de trabajo específico, que no involucre agresión personal ni se repita de forma sistemática.", "categoria": "NO" }, { "texto": "Cuestionamiento infundado: Desacreditar o anular injustificadamente las decisiones, ideas o el trabajo de un profesional frente a terceros, con ánimo de menoscabo.", "categoria": "SI" }, { "texto": "Denegación de permisos justificadas: Rechazar una solicitud de vacaciones o un permiso si existen razones operacionales o de servicio fundadas, sin discriminar al trabajador.", "categoria": "NO" }];
    const categorias = ["SI", "NO"];
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
            progress.textContent = `${currentIndex + 1}/${items.length}`;
        } else {
            progress.textContent = `${items.length}/${items.length}`;
        }
        correctCount.textContent = correctAnswers;
    }

    function showFeedback(isCorrect) {
        feedback.className = `alert ${isCorrect ? 'alert-success' : 'alert-danger'} mb-3`;
        feedback.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto.';
        feedback.classList.remove('d-none');
        setTimeout(() => feedback.classList.add('d-none'), 2000);
    }

    function showFinalMessage() {
        feedback.className = 'alert alert-info mb-3';
        feedback.textContent = `Actividad completada. Resultado: ${correctAnswers}/${items.length} correctas`;
        feedback.classList.remove('d-none');
    }

    function addToDroppedItems(item, category, isCorrect) {
        const container = document.getElementById(`${category}-items`);
        const itemDiv = document.createElement('div');
        itemDiv.className = `dropped-item p-2 mb-2 rounded ${isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}`;
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
            document.getElementById(`${cat}-items`).innerHTML = '';
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
    showNextText();
}
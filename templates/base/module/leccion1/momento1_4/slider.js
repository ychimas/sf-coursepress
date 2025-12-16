let currentUnlockedStep = 1;
let completedSteps = new Set();

export function init() {
  const stepCards = document.querySelectorAll('.step-card-mom1_4');
  
  // Inicializar el estado de las cards
  initializeCards();

  stepCards.forEach(card => {
    card.addEventListener('click', function () {
      const stepNumber = parseInt(this.dataset.step);
      
      // Verificar si la card está bloqueada
      if (this.classList.contains('locked-mom1_4')) {
        showRestrictionModal(stepNumber);
        return;
      }
      
      // Si la card está desbloqueada, activarla
      if (this.classList.contains('unlocked-mom1_4')) {
        activateCard(this, stepNumber);
      }
    });
  });
  
  // Agregar evento para cerrar modal al hacer clic fuera
  document.getElementById('restrictionModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeRestrictionModal();
    }
  });
}

function initializeCards() {
  const stepCards = document.querySelectorAll('.step-card-mom1_4');
  
  stepCards.forEach((card, index) => {
    const stepNumber = index + 1;
    
    // Todas las cards inician contraídas
    card.classList.remove('expanded-mom1_4');
    
    if (stepNumber === 1) {
      // La primera card está desbloqueada pero contraída
      card.classList.add('unlocked-mom1_4');
      card.classList.remove('locked-mom1_4');
      const lockIcon = card.querySelector('.lock-icon');
      if (lockIcon) lockIcon.remove();
    } else {
      // Las demás cards están bloqueadas inicialmente
      card.classList.add('locked-mom1_4');
      card.classList.remove('unlocked-mom1_4');
    }
  });
}

function activateCard(card, stepNumber) {
  const stepCards = document.querySelectorAll('.step-card-mom1_4');
  
  // Pausar todos los audios antes de cambiar de card
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  
  // Remover active y expanded de todas las cards
  stepCards.forEach(c => {
    c.classList.remove('active-mom1_4', 'expanded-mom1_4');
  });
  
  // Activar y expandir la card seleccionada
  card.classList.add('active-mom1_4', 'expanded-mom1_4');
  
  // Marcar como completada
  completedSteps.add(stepNumber);
  card.classList.add('completed-mom1_4');
  
  // Desbloquear la siguiente card si existe
  const nextStep = stepNumber + 1;
  const nextCard = document.querySelector(`[data-step="${nextStep}"]`);
  
  if (nextCard && nextCard.classList.contains('locked-mom1_4')) {
    unlockCard(nextCard, nextStep);
  }
}

function unlockCard(card, stepNumber) {
  card.classList.remove('locked-mom1_4');
  card.classList.add('unlocked-mom1_4');
  
  // Remover el icono de candado con animación
  const lockIcon = card.querySelector('.lock-icon');
  if (lockIcon) {
    lockIcon.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
      lockIcon.remove();
    }, 300);
  }
  
  // Actualizar el step desbloqueado actual
  currentUnlockedStep = Math.max(currentUnlockedStep, stepNumber);
  
  // Animación de desbloqueo
  card.style.transform = 'scale(1.05)';
  setTimeout(() => {
    card.style.transform = '';
  }, 200);
}

function showRestrictionModal(attemptedStep) {
  const modal = document.getElementById('restrictionModal');
  const message = modal.querySelector('.modal-message');
  
  // Personalizar el mensaje según el step
  const previousStep = attemptedStep - 1;
  message.textContent = `Debes completar el objetivo ${previousStep} antes de acceder al objetivo ${attemptedStep}. ¡Sigue el orden para una mejor comprensión!`;
  
  modal.classList.remove('hidden');
  modal.classList.add('show');
  
  // Auto-cerrar después de 3 segundos
  setTimeout(() => {
    closeRestrictionModal();
  }, 3000);
}

function closeRestrictionModal() {
  const modal = document.getElementById('restrictionModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}

// Hacer la función global para el botón del modal
window.closeRestrictionModal = closeRestrictionModal;
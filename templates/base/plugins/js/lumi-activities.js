// Plugin para actividades Lumi
class LumiActivities {
    constructor() {
        this.activities = {};
        this.currentActivity = null;
    }

    // Configurar actividades
    setActivities(activities) {
        this.activities = activities;
    }

    // Inicializar actividad específica
    initActivity(activityId, config) {
        if (!config) {
            console.error(`❌ Configuración no encontrada para actividad: ${activityId}`);
            return;
        }

        this.currentActivity = {
            id: activityId,
            ...config
        };

        // Crear el contenido del modal
        this.createModalContent(activityId, config);
    }

    // Crear contenido del modal
    createModalContent(activityId, config) {
        const modalBody = document.querySelector(`#${activityId} .modal-body`);
        if (!modalBody) {
            console.error(`❌ Modal body no encontrado para: ${activityId}`);
            return;
        }

        // Limpiar contenido previo
        modalBody.innerHTML = '';

        // Crear contenedor para la actividad
        const activityContainer = document.createElement('div');
        activityContainer.id = `lumi-container-${activityId}`;
        activityContainer.className = 'lumi-activity-container';

        // Detectar si es móvil
        const isMobile = window.innerWidth <= 768;
        const height = isMobile ? config.mobileHeight : config.desktopHeight;

        // Crear iframe
        const iframe = document.createElement('iframe');
        iframe.src = config.src;
        iframe.style.width = '100%';
        iframe.style.height = height;
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'autoplay; fullscreen');

        activityContainer.appendChild(iframe);
        modalBody.appendChild(activityContainer);

        console.log(`✅ Actividad Lumi cargada: ${config.title}`);
    }

    // Método para inicializar desde archivos individuales
    static init(activityId, config) {
        if (!window.lumiActivities) {
            window.lumiActivities = new LumiActivities();
        }
        window.lumiActivities.initActivity(activityId, config);
    }
}

// Inicializar plugin globalmente
window.LumiActivities = LumiActivities;
window.lumiActivities = new LumiActivities();

console.log('✅ Plugin Lumi Activities cargado');
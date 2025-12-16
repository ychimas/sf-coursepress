export function init() {
    // Configurar actividades Lumi
    const activities = {
        'modalquiz1': {
            title: 'Estrategias de implementación de entornos saludables',
            src: 'https://app.lumi.education/api/v1/run/oUOFfC/embed',
            mobileHeight: '75vh',
            desktopHeight: '70vh'
        },
        'modalquiz2': {
            title: 'Prevención del acoso laboral',
            src: 'https://app.lumi.education/api/v1/run/sANjpR/embed',
            mobileHeight: '75vh',
            desktopHeight: '70vh'
        }
    };

    // Inicializar actividades cuando se abran los modales
    document.getElementById('modalquiz1')?.addEventListener('shown.bs.modal', function () {
        LumiActivities.init('modalquiz1', activities.modalquiz1);
    });

    document.getElementById('modalquiz2')?.addEventListener('shown.bs.modal', function () {
        LumiActivities.init('modalquiz2', activities.modalquiz2);
    });
}
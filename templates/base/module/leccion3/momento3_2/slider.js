export function init() {
    let currentPage = 0;
    const totalPages = 4;



    function createIndicators() {
        const slider = document.querySelector('.mom3_2-infografia-slider');
        const indicators = document.createElement('div');
        indicators.className = 'mom3_2-slider-indicators';
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'mom3_2-indicator';
            indicator.onclick = () => goToPage(i);
            indicators.appendChild(indicator);
        }
        
        slider.appendChild(indicators);
    }

    function updateSlider() {
        const container = document.querySelector('.mom3_2-slider-container');
        const indicators = document.querySelectorAll('.mom3_2-indicator');
        
        container.style.transform = `translateX(-${currentPage * 100}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPage);
        });
    }

    function nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateSlider();
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
            updateSlider();
        }
    }

    function goToPage(page) {
        currentPage = page;
        updateSlider();
    }

    createIndicators();
    updateSlider();
}
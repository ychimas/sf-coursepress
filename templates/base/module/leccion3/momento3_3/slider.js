export function init() {
    loadIframe({
        id: 'Slide3_3Web',
        src: 'https://iframe.mediadelivery.net/embed/516177/eca7121c-c345-4e6d-975a-755ad7a7a8ec?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-vertical-web',
        style: 'width: 20vw; height: 80vh; min-height: 300px;',
    });

    loadIframe({
        id: 'Slide3_3Mobile',
        src: 'https://iframe.mediadelivery.net/embed/516177/eca7121c-c345-4e6d-975a-755ad7a7a8ec?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-vertical-mobile',
        style: 'width: 20vw; height: 80vh; min-height: 300px;',
    });
}

import Experience from './Experience/Experience.js'

// Check for mobile devices
const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|BlackBerry|Mobile/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches

if (isMobile) {
    const banner = document.getElementById('mobile-banner')
    banner.style.display = 'flex'
} else {
    const experience = new Experience(document.querySelector('canvas.webgl'))
}

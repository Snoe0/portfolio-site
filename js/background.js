const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x33debf,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 2;

// Scroll tracking
let lastScrollY = window.scrollY;
let scrollSpeed = 0;
let scrollDirection = 1; // 1 for down, -1 for up
let baseRotationSpeed = 0.0001;
let maxRotationSpeed = 0.001;
let currentRotationSpeed = baseRotationSpeed;

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    // Calculate target speed based on scroll
    const targetSpeed = Math.min(maxRotationSpeed, baseRotationSpeed + (Math.abs(scrollSpeed) * 0.00001));
    
    // Smoothly adjust current speed towards target
    currentRotationSpeed += (targetSpeed - currentRotationSpeed) * 0.1;
    
    // Apply rotation with direction
    particlesMesh.rotation.x += currentRotationSpeed * scrollDirection;
    particlesMesh.rotation.y += currentRotationSpeed * scrollDirection;
    
    // Gradually slow down when not scrolling
    if (scrollSpeed === 0) {
        currentRotationSpeed *= 0.95;
        if (currentRotationSpeed < baseRotationSpeed) {
            currentRotationSpeed = baseRotationSpeed;
        }
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Track scroll speed and direction
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollSpeed = currentScrollY - lastScrollY;
    scrollDirection = Math.sign(scrollSpeed);
    lastScrollY = currentScrollY;
});

animate(); 
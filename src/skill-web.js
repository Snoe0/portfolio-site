/**
 * Skill Web 3D - Interactive 3D skill constellation using Three.js
 *
 * Features:
 * - 3D pannable/rotatable canvas
 * - Skill icons as billboard planes
 * - Connection lines between related skills
 * - Hover and click interactions
 * - Subtle ambient rotation
 */

// ============================================
// SKILL DATA - Edit this to add/remove skills
// ============================================
const skillsData = [
    // Development - Front cluster
    { id: 'javascript', name: 'JavaScript', category: 'Development', icon: '../media/skills-svgs/javascript.svg', x: 0, y: 0, z: 0, color: '#F7DF1E', description: 'Core language for web development', projects: ['Trading Journal', 'Portfolio Site'] },
    { id: 'typescript', name: 'TypeScript', category: 'Development', icon: '../media/skills-svgs/typescript.svg', x: 1.5, y: 0.8, z: -0.5, color: '#3178C6', description: 'Type-safe JavaScript development', projects: ['Algorithmic Trading System'] },
    { id: 'python', name: 'Python', category: 'Development', icon: '../media/skills-svgs/python.svg', x: -1.8, y: -0.5, z: 0.8, color: '#3776AB', description: 'Data analysis and automation', projects: ['Data Analysis Intern'] },
    { id: 'csharp', name: 'C#', category: 'Development', icon: '../media/skills-svgs/c-sharp.svg', x: 2.2, y: -1, z: 1, color: '#239120', description: 'Unity game development', projects: ['RAMPAGE!'] },
    { id: 'html', name: 'HTML5', category: 'Development', icon: '../media/skills-svgs/html5.svg', x: -0.8, y: 1.5, z: -0.3, color: '#E34F26', description: 'Semantic markup and structure', projects: ['Portfolio Site'] },
    { id: 'css', name: 'CSS3', category: 'Development', icon: '../media/skills-svgs/css.svg', x: 0.5, y: 1.8, z: 0.2, color: '#1572B6', description: 'Styling and animations', projects: ['Portfolio Site'] },

    // Frameworks - Middle cluster
    { id: 'react', name: 'React.js', category: 'Frameworks', icon: '../media/skills-svgs/reactjs.svg', x: -2, y: 0.3, z: -0.8, color: '#61DAFB', description: 'Component-based UI development', projects: ['Trading Journal'] },
    { id: 'nodejs', name: 'Node.js', category: 'Frameworks', icon: '../media/skills-svgs/nodejs.svg', x: 1.8, y: 1.2, z: -1, color: '#339933', description: 'Server-side JavaScript runtime', projects: ['Trading Journal'] },
    { id: 'unity', name: 'Unity', category: 'Frameworks', icon: '../media/skills-svgs/unity.svg', x: 2.8, y: -0.2, z: 0.5, color: '#FFFFFF', description: 'Game engine for interactive experiences', projects: ['RAMPAGE!'] },

    // Tools - Back cluster
    { id: 'git', name: 'Git', category: 'Tools', icon: '../media/skills-svgs/git.svg', x: -2.5, y: -1.2, z: 1.2, color: '#F05032', description: 'Version control and collaboration', projects: ['All Projects'] },
    { id: 'mongodb', name: 'MongoDB', category: 'Databases', icon: '../media/skills-svgs/mongodb.svg', x: -1.5, y: -1.5, z: -0.5, color: '#47A248', description: 'NoSQL database for flexible data', projects: ['Trading Journal'] },
    { id: 'mysql', name: 'MySQL', category: 'Databases', icon: '../media/skills-svgs/mysql.svg', x: 0, y: -1.8, z: 0.6, color: '#4479A1', description: 'Relational database queries', projects: ['Data Analysis'] },
    { id: 'figma', name: 'Figma', category: 'Design', icon: '../media/skills-svgs/figma.svg', x: 1, y: -1.5, z: -1.2, color: '#F24E1E', description: 'UI/UX design and prototyping', projects: ['Portfolio Site'] },
    { id: 'arduino', name: 'Arduino', category: 'Hardware', icon: '../media/skills-svgs/arduino.svg', x: 2.5, y: -1.5, z: 0.8, color: '#00979D', description: 'Physical computing and sensors', projects: ['RAMPAGE!'] },
    { id: 'adobe', name: 'Adobe', category: 'Tools', icon: '../media/skills-svgs/adobe.svg', x: 1.1, y: -1.1, z: 1.2, color: '#fc9f8e', description: 'Design', projects: ['RAMPAGE!'] },
];

// Connection pairs
const connectionPairs = [
    ['javascript', 'typescript'],
    ['javascript', 'react'],
    ['javascript', 'nodejs'],
    ['html', 'css'],
    ['html', 'javascript'],
    ['csharp', 'unity'],
    ['unity', 'arduino'],
    ['react', 'nodejs'],
    ['nodejs', 'mongodb'],
    ['python', 'sql'],
    ['mongodb', 'sql'],
    ['figma', 'css'],
    ['figma', 'adobe'],
    ['adobe', 'unity']
];

// ============================================
// CONFIGURATION
// ============================================
const config = {
    // Camera
    cameraDistance: 8,
    cameraFov: 50,

    // Motion
    autoRotateSpeed: 0.001,
    dragSensitivity: 0.005,

    // Visuals
    nodeSize: 0.5,
    lineOpacity: 0.15,
    lineColor: 0x666666,
    hoverScale: 1.3,

    // Spacing multiplier for node positions
    positionScale: 1.2,
};

// ============================================
// THREE.JS SKILL WEB
// ============================================
class SkillWeb3D {
    constructor(container) {
        this.container = container;
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        // Three.js objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.nodes = [];
        this.lines = [];
        this.group = null;

        // Interaction state
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.currentRotationX = 0;
        this.currentRotationY = 0;

        // Raycaster for interactions
        this.raycaster = null;
        this.mouse = null;
        this.hoveredNode = null;
        this.activeNode = null;

        // UI elements
        this.tooltip = null;
        this.detailPanel = null;

        // Animation
        this.clock = null;
        this.animationId = null;

        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    async init() {
        // Dynamically import Three.js
        try {
            const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
            this.THREE = THREE;

            this.setup();
            this.createNodes();
            this.createConnections();
            this.createUI();
            this.bindEvents();
            this.animate();
        } catch (error) {
            console.error('Failed to load Three.js:', error);
            this.showFallback();
        }
    }

    setup() {
        const { THREE } = this;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            config.cameraFov,
            this.width / this.height,
            0.1,
            1000
        );
        this.camera.position.z = config.cameraDistance;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Group for all objects (for rotation)
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // Raycaster
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Clock
        this.clock = new THREE.Clock();
    }

    createNodes() {
        const { THREE } = this;
        const textureLoader = new THREE.TextureLoader();

        skillsData.forEach(skill => {
            // Create plane geometry
            const geometry = new THREE.PlaneGeometry(config.nodeSize, config.nodeSize);

            // Check if icon is a file path (SVG or image)
            const isImagePath = skill.icon && (skill.icon.endsWith('.svg') || skill.icon.endsWith('.png'));

            let material;

            if (isImagePath) {
                // Load SVG/image as texture
                const texture = textureLoader.load(skill.icon, (tex) => {
                    tex.needsUpdate = true;
                });
                texture.colorSpace = THREE.SRGBColorSpace;

                material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                });
            } else {
                // Create placeholder canvas texture
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                const ctx = canvas.getContext('2d');

                // Draw circular background
                ctx.beginPath();
                ctx.arc(64, 64, 60, 0, Math.PI * 2);
                ctx.fillStyle = '#1a1a1a';
                ctx.fill();
                ctx.strokeStyle = skill.color;
                ctx.lineWidth = 4;
                ctx.stroke();

                // Draw icon text placeholder
                ctx.fillStyle = skill.color;
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const initials = skill.name.substring(0, 2).toUpperCase();
                ctx.fillText(initials, 64, 64);

                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;

                material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                });
            }

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                skill.x * config.positionScale,
                skill.y * config.positionScale,
                skill.z * config.positionScale
            );

            // Store skill data on mesh
            mesh.userData = {
                skill: skill,
                originalScale: config.nodeSize,
            };

            this.group.add(mesh);
            this.nodes.push(mesh);
        });
    }

    createConnections() {
        const { THREE } = this;

        // Offset to keep lines from overlapping icons
        const lineOffset = config.nodeSize * 0.6;

        const lineMaterial = new THREE.LineBasicMaterial({
            color: config.lineColor,
            transparent: true,
            opacity: config.lineOpacity,
        });

        connectionPairs.forEach(([id1, id2]) => {
            const node1 = this.nodes.find(n => n.userData.skill.id === id1);
            const node2 = this.nodes.find(n => n.userData.skill.id === id2);

            if (node1 && node2) {
                // Calculate direction and shorten line at both ends
                const start = node1.position.clone();
                const end = node2.position.clone();
                const direction = new THREE.Vector3().subVectors(end, start).normalize();

                // Offset start and end points inward
                start.add(direction.clone().multiplyScalar(lineOffset));
                end.sub(direction.clone().multiplyScalar(lineOffset));

                const points = [start, end];

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial.clone());

                line.userData = { node1, node2 };

                this.group.add(line);
                this.lines.push(line);
            }
        });
    }

    createUI() {
        // Tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'skill-web-tooltip';
        this.container.appendChild(this.tooltip);

        // Detail panel
        this.detailPanel = document.createElement('div');
        this.detailPanel.className = 'skill-web-detail';
        this.detailPanel.setAttribute('aria-hidden', 'true');
        this.container.appendChild(this.detailPanel);

        // Pan hint
        const hint = document.createElement('div');
        hint.className = 'skill-web-hint';
        hint.innerHTML = '<span>Drag to rotate</span>';
        this.container.appendChild(hint);

        // Hide hint after interaction
        const hideHint = () => {
            hint.classList.add('hidden');
        };
        this.container.addEventListener('mousedown', hideHint, { once: true });
        this.container.addEventListener('touchstart', hideHint, { once: true });
    }

    bindEvents() {
        const canvas = this.renderer.domElement;

        // Mouse events
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Touch events
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Click
        canvas.addEventListener('click', this.onClick.bind(this));

        // Resize
        window.addEventListener('resize', this.onResize.bind(this));

        // Close detail panel on outside click
        document.addEventListener('click', (e) => {
            if (!this.detailPanel.contains(e.target) && !this.container.contains(e.target)) {
                this.closeDetail();
            }
        });
    }

    // ============================================
    // INTERACTION HANDLERS
    // ============================================

    onMouseDown(e) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
        this.renderer.domElement.style.cursor = 'grabbing';
    }

    onMouseMove(e) {
        // Update mouse for raycasting
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / this.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / this.height) * 2 + 1;

        if (this.isDragging) {
            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;

            this.targetRotationY += deltaX * config.dragSensitivity;
            this.targetRotationX += deltaY * config.dragSensitivity;

            // Clamp vertical rotation
            this.targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetRotationX));

            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        } else {
            this.checkHover();
        }
    }

    onMouseUp() {
        this.isDragging = false;
        this.renderer.domElement.style.cursor = 'grab';
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
            e.preventDefault();
        }
    }

    onTouchMove(e) {
        if (this.isDragging && e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
            const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

            this.targetRotationY += deltaX * config.dragSensitivity;
            this.targetRotationX += deltaY * config.dragSensitivity;

            this.targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetRotationX));

            this.previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };

            e.preventDefault();
        }
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    onClick(e) {
        if (this.hoveredNode) {
            if (this.activeNode === this.hoveredNode) {
                this.closeDetail();
            } else {
                this.showDetail(this.hoveredNode);
            }
        } else {
            this.closeDetail();
        }
    }

    onResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    // ============================================
    // HOVER & DETAIL
    // ============================================

    checkHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);

        // Reset previous hover
        if (this.hoveredNode && (!intersects.length || intersects[0].object !== this.hoveredNode)) {
            this.onNodeLeave(this.hoveredNode);
            this.hoveredNode = null;
        }

        if (intersects.length > 0) {
            const node = intersects[0].object;
            if (node !== this.hoveredNode) {
                this.hoveredNode = node;
                this.onNodeHover(node);
            }
            this.updateTooltipPosition(intersects[0].point);
        }
    }

    onNodeHover(node) {
        // Scale up
        node.scale.setScalar(config.hoverScale);

        // Show tooltip
        this.tooltip.textContent = node.userData.skill.name;
        this.tooltip.classList.add('visible');

        // Highlight connections
        this.lines.forEach(line => {
            if (line.userData.node1 === node || line.userData.node2 === node) {
                line.material.opacity = 0.5;
            }
        });

        this.renderer.domElement.style.cursor = 'pointer';
    }

    onNodeLeave(node) {
        // Reset scale
        node.scale.setScalar(1);

        // Hide tooltip
        this.tooltip.classList.remove('visible');

        // Reset connections
        this.lines.forEach(line => {
            line.material.opacity = config.lineOpacity;
        });

        this.renderer.domElement.style.cursor = 'grab';
    }

    updateTooltipPosition(worldPosition) {
        const { THREE } = this;

        // Project 3D position to 2D screen
        const vector = worldPosition.clone();
        vector.project(this.camera);

        const x = (vector.x * 0.5 + 0.5) * this.width;
        const y = (-vector.y * 0.5 + 0.5) * this.height;

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y - 50}px`;
    }

    showDetail(node) {
        this.activeNode = node;
        const skill = node.userData.skill;

        this.detailPanel.innerHTML = `
            <button class="skill-web-detail-close" aria-label="Close">&times;</button>
            <h3>${skill.name}</h3>
            <span class="skill-web-detail-category">${skill.category}</span>
            <p>${skill.description}</p>
            ${skill.projects ? `
                <div class="skill-web-detail-projects">
                    <strong>Used in:</strong>
                    <span>${skill.projects.join(', ')}</span>
                </div>
            ` : ''}
        `;

        this.detailPanel.classList.add('visible');
        this.detailPanel.setAttribute('aria-hidden', 'false');

        this.detailPanel.querySelector('.skill-web-detail-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeDetail();
        });
    }

    closeDetail() {
        this.activeNode = null;
        this.detailPanel.classList.remove('visible');
        this.detailPanel.setAttribute('aria-hidden', 'true');
    }

    // ============================================
    // ANIMATION LOOP
    // ============================================

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();

        // Auto-rotate when not dragging
        if (!this.isDragging && !this.prefersReducedMotion) {
            this.targetRotationY += config.autoRotateSpeed;
        }

        // Smooth rotation interpolation
        this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.05;
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.05;

        this.group.rotation.x = this.currentRotationX;
        this.group.rotation.y = this.currentRotationY;

        // Billboard effect - make nodes face camera
        this.nodes.forEach(node => {
            node.lookAt(this.camera.position);
        });

        // Check hover during animation if not dragging
        if (!this.isDragging) {
            this.checkHover();
        }

        this.renderer.render(this.scene, this.camera);
    }

    showFallback() {
        const fallback = this.container.querySelector('.skill-web-fallback');
        if (fallback) {
            fallback.classList.remove('sr-only');
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================
function initSkillWeb() {
    const container = document.getElementById('skill-web-container');
    if (!container) return;

    // Check for reduced motion - show fallback instead
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const fallback = container.querySelector('.skill-web-fallback');
        if (fallback) {
            fallback.classList.remove('sr-only');
        }
        return;
    }

    new SkillWeb3D(container);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillWeb);
} else {
    initSkillWeb();
}

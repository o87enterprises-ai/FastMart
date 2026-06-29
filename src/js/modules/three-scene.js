/* ============================================ */
/* THREE.JS 3D HERO SCENE */
/* ============================================ */
/* A procedurally-built craft beer bottle with carbonation particles */
/* and warm amber lighting. Built entirely from native Three.js        */
/* geometries + canvas textures, so there are no external 3D assets to */
/* load. Requires the global THREE (loaded via CDN in index.html).     */

let scene, camera, renderer, bottleGroup, particles, pointLight;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

function initThreeJS() {
    const canvas = document.getElementById('three-canvas');

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0D0A07, 0.035);

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    // Renderer - limit pixel ratio to 1.5 for mobile performance
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0D0A07, 1);

    // ============================================
    // BUILD PREMIUM CRAFT BEER BOTTLE
    // ============================================
    bottleGroup = new THREE.Group();

    // Bottle body (main cylinder)
    const bodyGeo = new THREE.CylinderGeometry(0.7, 0.75, 2.8, 32);
    const bottleMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a3a1a,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.3,
        thickness: 0.5,
        transparent: true,
        opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeo, bottleMat);
    body.position.y = -0.2;
    bottleGroup.add(body);

    // Bottle shoulder (tapered cylinder)
    const shoulderGeo = new THREE.CylinderGeometry(0.35, 0.7, 0.6, 32);
    const shoulder = new THREE.Mesh(shoulderGeo, bottleMat);
    shoulder.position.y = 1.5;
    bottleGroup.add(shoulder);

    // Bottle neck
    const neckGeo = new THREE.CylinderGeometry(0.32, 0.35, 1.0, 32);
    const neck = new THREE.Mesh(neckGeo, bottleMat);
    neck.position.y = 2.3;
    bottleGroup.add(neck);

    // Bottle lip
    const lipGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.15, 32);
    const lip = new THREE.Mesh(lipGeo, bottleMat);
    lip.position.y = 2.85;
    bottleGroup.add(lip);

    // Custom Label Texture via Canvas API — keeps the brand visible
    // without external image assets, and renders instantly.
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const ctx = labelCanvas.getContext('2d');

    // Label background
    ctx.fillStyle = '#0D0A07';
    ctx.fillRect(0, 0, 512, 256);

    // Gold border
    ctx.strokeStyle = '#C8A26E';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 240);

    // Inner border
    ctx.strokeStyle = '#E8C99B';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 472, 216);

    // Brand text
    ctx.fillStyle = '#C8A26E';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('FAST MART', 256, 90);

    // Subtitle
    ctx.fillStyle = '#E8C99B';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('Premium Craft Selection', 256, 130);

    // Location
    ctx.fillStyle = '#B8A99A';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('Creswell, Oregon', 256, 170);

    // Decorative line
    ctx.strokeStyle = '#C8A26E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 190);
    ctx.lineTo(332, 190);
    ctx.stroke();

    // Est. date
    ctx.fillStyle = '#7A6E63';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('Est. 1987', 256, 220);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelGeo = new THREE.CylinderGeometry(0.72, 0.77, 1.6, 32, 1, true);
    const labelMat = new THREE.MeshStandardMaterial({
        map: labelTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = -0.2;
    label.rotation.y = Math.PI; // Face camera
    bottleGroup.add(label);

    // Gold foil neck label
    const neckLabelCanvas = document.createElement('canvas');
    neckLabelCanvas.width = 256;
    neckLabelCanvas.height = 128;
    const nCtx = neckLabelCanvas.getContext('2d');
    nCtx.fillStyle = '#C8A26E';
    nCtx.fillRect(0, 0, 256, 128);
    nCtx.fillStyle = '#0D0A07';
    nCtx.font = 'bold 20px Arial';
    nCtx.textAlign = 'center';
    nCtx.fillText('FAST MART', 128, 50);
    nCtx.font = '14px Arial';
    nCtx.fillText('OREGON CRAFT', 128, 80);

    const neckLabelTexture = new THREE.CanvasTexture(neckLabelCanvas);
    const neckLabelGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.5, 32, 1, true);
    const neckLabelMat = new THREE.MeshStandardMaterial({
        map: neckLabelTexture,
        metalness: 0.6,
        roughness: 0.3
    });
    const neckLabel = new THREE.Mesh(neckLabelGeo, neckLabelMat);
    neckLabel.position.y = 2.0;
    bottleGroup.add(neckLabel);

    // Cap
    const capGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 32);
    const capMat = new THREE.MeshStandardMaterial({
        color: 0xC8A26E,
        metalness: 0.8,
        roughness: 0.2
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 2.95;
    bottleGroup.add(cap);

    scene.add(bottleGroup);

    // ============================================
    // PARTICLE SYSTEM: Carbonation Bubbles & Gold Dust
    // ============================================
    const particleCount = 150;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

        velocities[i * 3] = (Math.random() - 0.5) * 0.005;
        velocities[i * 3 + 1] = Math.random() * 0.01 + 0.002;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;

        sizes[i] = Math.random() * 3 + 1;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
        color: 0xC8A26E,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(particleGeo, particleMat);
    particles.userData = { velocities: velocities };
    scene.add(particles);

    // ============================================
    // LIGHTING: Warm Amber Glow
    // ============================================
    const ambientLight = new THREE.AmbientLight(0x1a1510, 0.5);
    scene.add(ambientLight);

    // Rotating point light for dynamic amber glow
    pointLight = new THREE.PointLight(0xC8A26E, 2, 20);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xE8C99B, 1, 15);
    pointLight2.position.set(-3, -2, 4);
    scene.add(pointLight2);

    const rimLight = new THREE.DirectionalLight(0xC8A26E, 0.8);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // ============================================
    // MOUSE PARALLAX
    // ============================================
    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ============================================
    // RESIZE HANDLER
    // ============================================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ============================================
    // ANIMATION LOOP
    // ============================================
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse parallax
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Rotate bottle
        bottleGroup.rotation.y += 0.003;
        bottleGroup.rotation.x = mouseY * 0.1;
        bottleGroup.rotation.z = mouseX * 0.05;

        // Float animation
        bottleGroup.position.y = Math.sin(time * 0.5) * 0.15;

        // Rotate point light
        pointLight.position.x = Math.cos(time * 0.3) * 4;
        pointLight.position.z = Math.sin(time * 0.3) * 4;

        // Animate particles
        const posArray = particles.geometry.attributes.position.array;
        const velArray = particles.userData.velocities;

        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += velArray[i * 3] + mouseX * 0.001;
            posArray[i * 3 + 1] += velArray[i * 3 + 1];
            posArray[i * 3 + 2] += velArray[i * 3 + 2] + mouseY * 0.001;

            // Reset particles that float too high
            if (posArray[i * 3 + 1] > 6) {
                posArray[i * 3 + 1] = -6;
                posArray[i * 3] = (Math.random() - 0.5) * 12;
                posArray[i * 3 + 2] = (Math.random() - 0.5) * 8;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Subtle camera movement based on scroll
        const scrollY = window.scrollY;
        camera.position.z = 8 + scrollY * 0.002;
        camera.position.y = scrollY * 0.001;

        renderer.render(scene, camera);
    }

    animate();
}

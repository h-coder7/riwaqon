let scene, camera, renderer, particleSystem, raycaster, mouse;
let mouseX = 0, mouseY = 0;
let time = 0;
let originalPositions = [];
let targetPositions = [];

const PARTICLE_COUNT = 800;
const SPHERE_RADIUS = 8;

function init() {
  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const globeContainer = document.querySelector('.globe-dots');
    globeContainer.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = []; // ✅ تأكدنا إن في ألوان لكل نقطة

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = 2.399963229728653 * i;

      const x = Math.cos(theta) * radius * SPHERE_RADIUS;
      const z = Math.sin(theta) * radius * SPHERE_RADIUS;
      const yPos = y * SPHERE_RADIUS;

      positions.push(x, yPos, z);
      originalPositions.push(x, yPos, z);
      targetPositions.push(x, yPos, z);

      // ✅ أسود غامق: #000000 → (0, 0, 0)
      colors.push(0, 0, 0);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); // ✅ مهم جدًا

    // Line texture (Small mini-line instead of a dot)
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 64, 64);

    // Draw a small elongated line
    const gradient = ctx.createLinearGradient(16, 32, 48, 32);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.2, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(0.5, 'rgba(20, 20, 20, 1)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    // Draw a rounded line/capsule
    ctx.beginPath();
    ctx.roundRect(16, 28, 32, 8, 4); 
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.4,
      map: texture,
      vertexColors: true, // ✅ ضروري علشان السكريبت الخارجي يشتغل
      transparent: true,
      opacity: 1.0,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
      depthTest: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    camera.position.z = 20;

    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    const countElement = document.getElementById('count');
    if (countElement) countElement.textContent = PARTICLE_COUNT;

    console.log('✅ Three.js scene initialized');
  } catch (error) {
    console.error('Error initializing Three.js:', error);
    document.body.innerHTML = '<div style="color: red; padding: 20px;">Error loading Three.js. Please refresh the page.</div>';
  }
}

function onMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) / 200;
  mouseY = (event.clientY - window.innerHeight / 2) / 200;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
  if (!particleSystem || !renderer || !scene || !camera) return;
  requestAnimationFrame(animate);
  time += 0.01;

  try {
    const mouseInfluence = 2.5;
    const globalInfluence = 0.8;

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const sphereDistance = 20;
    const mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(sphereDistance));

    const positions = particleSystem.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const originalWorldPos = new THREE.Vector3(
        originalPositions[i3],
        originalPositions[i3 + 1],
        originalPositions[i3 + 2]
      ).applyMatrix4(particleSystem.matrixWorld);

      const distanceToMouse = originalWorldPos.distanceTo(mouseWorldPos);
      const maxDistance = SPHERE_RADIUS * 3;
      const normalizedDistance = Math.min(distanceToMouse / maxDistance, 1);
      const influence = Math.pow(1 - normalizedDistance, 2) * globalInfluence;

      const moveDir = new THREE.Vector3().subVectors(mouseWorldPos, originalWorldPos).normalize();
      const localDir = moveDir.transformDirection(particleSystem.matrixWorld.clone().invert());

      const moveAmount = influence * mouseInfluence;
      targetPositions[i3] = originalPositions[i3] + localDir.x * moveAmount;
      targetPositions[i3 + 1] = originalPositions[i3 + 1] + localDir.y * moveAmount;
      targetPositions[i3 + 2] = originalPositions[i3 + 2] + localDir.z * moveAmount;

      const velocityEffect = 0.3;
      targetPositions[i3] += mouseX * velocityEffect * influence;
      targetPositions[i3 + 1] += mouseY * velocityEffect * influence;
    }

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      positions[i] += (targetPositions[i] - positions[i]) * 0.25;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;

    particleSystem.rotation.x += 0.001 + mouseY * 0.001;
    particleSystem.rotation.y += 0.002 + mouseX * 0.001;

    const baseSize = 0.16;
    const shineVariation = 0.04 + Math.sin(time * 3) * 0.024;
    particleSystem.material.size = baseSize + shineVariation;

    camera.position.x = Math.sin(time * 0.3) * 2;
    camera.position.y = Math.cos(time * 0.2) * 1.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  } catch (error) {
    console.error('Animation error:', error);
  }
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function checkThreeJS() {
  if (typeof THREE !== 'undefined') {
    init();
    animate();
  } else {
    console.log('Waiting for Three.js to load...');
    setTimeout(checkThreeJS, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkThreeJS);
} else {
  checkThreeJS();
}

// bubbles.js
class BubbleSystem {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        // Give container necessary styles to sit fixed in the background
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100vw';
        this.container.style.height = '100vh';
        this.container.style.zIndex = '-1';
        this.container.style.pointerEvents = 'none';
        this.container.style.overflow = 'hidden';

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.z = 10;

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.bubbles = [];
        this.clock = new THREE.Clock();

        this.createBubbles();

        // Handle resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation loop
        this.animate();
    }

    createBubbles() {
        // Vertex Shader for wobble, creating organic soap-bubble-like deformation
        const vertexShader = `
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec2 vUv;
            varying float vNoise;

            // Simple 3D Cellular noise or sinusoidal noise for the wobble
            float wobbleNoise(vec3 position, float time) {
                return sin(position.x * 2.0 + time) * sin(position.y * 2.0 + time) * sin(position.z * 2.0 + time) * 0.1;
            }

            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                
                // Calculate wobble
                float noise = wobbleNoise(position, time * 1.5);
                vNoise = noise;
                
                // Displace the vertex position
                vec3 newPosition = position + normal * noise;
                
                vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        // Fragment Shader for Soap Bubble Iridescence
        const fragmentShader = `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec2 vUv;
            varying float vNoise;
            
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                
                // Fresnel term: pushes opacity to edges
                float fresnel = dot(viewDir, normal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                float fresnelEdge = pow(fresnel, 2.5);
                
                // Animate iridescence hue over time and wobble
                float hue = fract(time * 0.1 + vUv.x + vUv.y + vNoise * 2.0);
                
                // Make colors a bit dreamy and pastel
                vec3 iColor = hsv2rgb(vec3(hue, 0.6, 1.0));
                
                // Base colors mixed together
                vec3 baseColor = mix(color1, color2, smoothstep(0.0, 0.5, fresnel));
                baseColor = mix(baseColor, color3, smoothstep(0.5, 1.0, fresnel));
                
                // Mix base color with the iridescent color at edges
                vec3 finalColor = mix(baseColor, iColor, fresnelEdge * 0.8);
                
                // Add fake gloss highlight
                vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                vec3 halfVector = normalize(lightDir + viewDir);
                float NdotH = max(0.0, dot(normal, halfVector));
                float specular = pow(NdotH, 64.0) * 0.8;
                finalColor += vec3(specular);
                
                // Make edges opaque and center transparent
                float alpha = fresnelEdge * 0.85 + 0.1;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `;

        const geometry = new THREE.SphereGeometry(1, 64, 64);

        // Generate a random number of bubbles, e.g., 20
        const numBubbles = 20;

        for (let i = 0; i < numBubbles; i++) {
            // Pick some vibrant random colors for this bubble
            let h1 = Math.random();
            let c1 = new THREE.Color().setHSL(h1, 0.8, 0.6);
            let c2 = new THREE.Color().setHSL((h1 + 0.2) % 1.0, 0.8, 0.6);
            let c3 = new THREE.Color().setHSL((h1 + 0.4) % 1.0, 0.8, 0.7);

            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    time: { value: 0 },
                    color1: { value: c1 },
                    color2: { value: c2 },
                    color3: { value: c3 },
                },
                transparent: true,
                depthWrite: false, // so they blend nicely behind one another
                side: THREE.FrontSide
            });

            const mesh = new THREE.Mesh(geometry, material);

            // Random sizes
            const scale = Math.random() * 1.5 + 0.5;
            mesh.scale.set(scale, scale, scale);

            // Random starting positions spread out over a range
            mesh.position.x = (Math.random() - 0.5) * 30;
            mesh.position.y = (Math.random() - 0.5) * 20 - 10;
            mesh.position.z = (Math.random() - 0.5) * 15 - 5;

            // Speed and rotation offsets
            mesh.userData = {
                speedY: Math.random() * 0.02 + 0.01,
                speedX: (Math.random() - 0.5) * 0.01,
                wobbleSpeed: Math.random() * 2 + 0.5,
                rotX: (Math.random() - 0.5) * 0.01,
                rotY: (Math.random() - 0.5) * 0.01,
                timeOffset: Math.random() * 100
            };

            this.bubbles.push(mesh);
            this.scene.add(mesh);
        }
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();

        this.bubbles.forEach(bubble => {
            // update time uniform
            bubble.material.uniforms.time.value = (elapsedTime + bubble.userData.timeOffset) * bubble.userData.wobbleSpeed;

            // Float upwards softly
            bubble.position.y += bubble.userData.speedY;
            bubble.position.x += bubble.userData.speedX;

            // Soft rotation
            bubble.rotation.y += bubble.userData.rotY;
            bubble.rotation.x += bubble.userData.rotX;

            // Reset bubble to the bottom if it drifts out of view
            if (bubble.position.y > 15) {
                bubble.position.y = -15;
                bubble.position.x = (Math.random() - 0.5) * 30;
                bubble.position.z = (Math.random() - 0.5) * 15 - 5;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new BubbleSystem('.bubles');
});

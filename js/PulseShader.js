export const PulseShader = {
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      speed: { value: 1 },
      intensity: { value: 1 },
    },
  
    vertexShader: `
      varying vec2 vUv;
  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float speed;
      uniform float intensity;
  
      varying vec2 vUv;
  
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float pulse = sin(time * speed);
        gl_FragColor = mix(color, vec4(1.0), pulse * intensity);
      }
    `,
  };
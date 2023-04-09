export const GlowShader = {
    uniforms: {
      tDiffuse: { value: null },
      glowColor: { value: new THREE.Color(0xffffff) },
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
      uniform vec3 glowColor;
      uniform float intensity;
  
      varying vec2 vUv;
  
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float alpha = max(color.r, max(color.g, color.b));
        gl_FragColor = vec4(glowColor, alpha * intensity);
      }
    `,
  };
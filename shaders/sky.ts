/**
 * Dawn sky gradient for The Rooftop.
 *
 * Three bands — deep zenith, horizon, and a warm sun glow low on one side —
 * blended by world-space height. `uProgress` drives the sunrise across the
 * rooftop section: the glow lifts and warms, and the horizon band brightens.
 *
 * GLSL lives in .ts template literals rather than .glsl files so it needs no
 * bundler loader and stays type-checked at the import site.
 */

export const skyVertex = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const skyFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform float uProgress;

  varying vec3 vWorldPosition;

  void main() {
    vec3 direction = normalize(vWorldPosition);

    // 0 at the horizon, 1 overhead.
    float height = clamp(direction.y * 0.5 + 0.5, 0.0, 1.0);

    // Pull the gradient toward the horizon as dawn advances, so the light band
    // grows rather than the whole dome simply getting lighter.
    float bandwidth = mix(2.6, 1.5, uProgress);
    float t = pow(height, bandwidth);
    vec3 color = mix(uHorizon, uTop, t);

    // Sun glow, low and off to one side. Rises a little across the section.
    vec3 sunDirection = normalize(vec3(-0.55, mix(-0.06, 0.10, uProgress), -0.82));
    float sun = max(dot(direction, sunDirection), 0.0);
    float bloom = pow(sun, mix(14.0, 7.0, uProgress));
    float halo  = pow(sun, 2.2) * 0.28;

    color += uGlow * (bloom * mix(0.3, 0.72, uProgress) + halo * uProgress * 0.5);

    // Keep a touch of night at the top even at full dawn — a fully lit sky
    // loses the contrast the city lights depend on.
    color = mix(color, color * 0.72, (1.0 - uProgress) * 0.5);

    // Hold the whole dome well below white. The contact form sits in front of
    // this; a sky that reaches 1.0 makes off-white text unreadable and flattens
    // the city lights into it.
    color *= 0.62;

    gl_FragColor = vec4(color, 1.0);
  }
`;

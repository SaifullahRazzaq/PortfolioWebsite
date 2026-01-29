const body = document.body;
const toggleButton = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const heroCanvas = document.getElementById("hero-canvas");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light");
}

toggleButton?.addEventListener("click", () => {
  body.classList.toggle("light");
  const isLight = body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThreeColors();
});

navToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".section, .card, .timeline-item").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

const tabs = document.querySelectorAll(".portfolio-tabs .tab");
const projects = document.querySelectorAll(".project");

function filterProjects(filter) {
  projects.forEach((project) => {
    const category = project.getAttribute("data-category");
    const shouldShow = filter === "all" || category === filter;
    project.style.display = shouldShow ? "block" : "none";
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((btn) => btn.classList.remove("active"));
    tab.classList.add("active");
    const filter = tab.getAttribute("data-filter");
    filterProjects(filter);
  });
});

let threeState = null;
let targetRotation = { x: 0, y: 0 };
let baseRotation = { x: 0, y: 0 };

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function getThemeColors() {
  const styles = getComputedStyle(document.body);
  return {
    primary: styles.getPropertyValue("--primary").trim() || "#6e7dff",
    accent: styles.getPropertyValue("--accent").trim() || "#35d8ff",
  };
}

function updateThreeColors() {
  if (!threeState) return;
  const { material } = threeState;
  const { primary, accent } = getThemeColors();
  material.color = new THREE.Color(primary);
  material.needsUpdate = true;
  threeState.material2.color = new THREE.Color(accent);
  threeState.material2.needsUpdate = true;
  renderThree();
}

function initThree() {
  if (!heroCanvas || !window.THREE) return;
  const { primary, accent } = getThemeColors();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 500);
  camera.position.z = 70;

  const renderer = new THREE.WebGLRenderer({
    canvas: heroCanvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry = new THREE.BufferGeometry();
  const geometry2 = new THREE.BufferGeometry();
  const count = 240;
  const positions = new Float32Array(count * 3);
  const positions2 = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    positions2[i * 3] = (Math.random() - 0.5) * 120;
    positions2[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions2[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry2.setAttribute("position", new THREE.BufferAttribute(positions2, 3));

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(primary),
    size: 1.8,
    transparent: true,
    opacity: 0.8,
  });
  const material2 = new THREE.PointsMaterial({
    color: new THREE.Color(accent),
    size: 1.2,
    transparent: true,
    opacity: 0.6,
  });

  const points = new THREE.Points(geometry, material);
  const points2 = new THREE.Points(geometry2, material2);
  scene.add(points);
  scene.add(points2);

  threeState = { scene, camera, renderer, points, points2, material, material2 };
  handleResize();
  renderThree();

  if (!prefersReducedMotion) {
    animateThree();
  }
}

function handleResize() {
  if (!threeState || !heroCanvas) return;
  const { camera, renderer } = threeState;
  const rect = heroCanvas.parentElement.getBoundingClientRect();
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, rect.height);
}

function renderThree() {
  if (!threeState) return;
  threeState.renderer.render(threeState.scene, threeState.camera);
}

function animateThree() {
  if (!threeState) return;
  const { points, points2 } = threeState;
  baseRotation.y += 0.0012;
  baseRotation.x += 0.0006;
  points.rotation.y +=
    (baseRotation.y + targetRotation.y - points.rotation.y) * 0.06;
  points.rotation.x +=
    (baseRotation.x + targetRotation.x - points.rotation.x) * 0.06;
  points2.rotation.y +=
    (baseRotation.y * -0.8 + targetRotation.y * -0.9 - points2.rotation.y) *
    0.06;
  points2.rotation.x +=
    (baseRotation.x * -0.8 + targetRotation.x * -0.9 - points2.rotation.x) *
    0.06;
  renderThree();
  requestAnimationFrame(animateThree);
}

window.addEventListener("resize", () => {
  handleResize();
  renderThree();
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  targetRotation = {
    x: progress * 0.6,
    y: progress * 1.2,
  };
  if (prefersReducedMotion) {
    renderThree();
  }
});

initThree();

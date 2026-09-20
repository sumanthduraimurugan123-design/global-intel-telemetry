import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Flame, 
  Eye, 
  Sparkles, 
  Radio, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Compass,
  Zap,
  Cable,
  Volume2
} from 'lucide-react';
import { HOTSPOT_PERSONAL_IMPACTS } from '../services/impactEngine';
import { playEarcon, speakInLanguage } from '../services/voiceService';

// Smart Hotspot Sensor Nodes with rich personal impact intelligence
const GLOBAL_HOTSPOTS = [
  { 
    id: 'taiwan', 
    name: 'Taiwan Strait', 
    lat: 25.0330, 
    lng: 121.5654, 
    threat: 'HIGH', 
    color: 0xa855f7, 
    colorHex: '#a855f7', 
    pulseSpeed: 2.7, 
    maxScale: 4.2,
    personalVector: 'Originates 85% of advanced computing chips. Disruption risks smartphone/laptop price surges.',
    primarySector: 'Semiconductors & Electronics'
  },
  { 
    id: 'ukraine', 
    name: 'Ukraine & Black Sea', 
    lat: 50.4501, 
    lng: 30.5234, 
    threat: 'CRITICAL', 
    color: 0xff0055, 
    colorHex: '#ff0055', 
    pulseSpeed: 3.0, 
    maxScale: 4.5,
    personalVector: 'Key wheat & neon gas corridor. Tensions spark bakery, grocery, and industrial supply spikes.',
    primarySector: 'Food & Raw Materials'
  },
  { 
    id: 'israel', 
    name: 'Levant & Red Sea', 
    lat: 31.7683, 
    lng: 35.2137, 
    threat: 'CRITICAL', 
    color: 0xff0055, 
    colorHex: '#ff0055', 
    pulseSpeed: 3.0, 
    maxScale: 4.2,
    personalVector: 'Red Sea shipping route. Diversions add 10-14 days to imported electronics and raise freight costs.',
    primarySector: 'Maritime Supply Chain'
  },
  { 
    id: 'iran', 
    name: 'Strait of Hormuz', 
    lat: 27.1832, 
    lng: 56.4583, 
    threat: 'HIGH', 
    color: 0xff5500, 
    colorHex: '#ff5500', 
    pulseSpeed: 2.5, 
    maxScale: 4.0,
    personalVector: '20% of world petroleum passes here. Direct risk to domestic petrol, diesel, and cooking gas tariffs.',
    primarySector: 'Energy & Fuel'
  },
  { 
    id: 'russia', 
    name: 'Russia', 
    lat: 55.7558, 
    lng: 37.6173, 
    threat: 'HIGH', 
    color: 0xff5500, 
    colorHex: '#ff5500', 
    pulseSpeed: 2.5, 
    maxScale: 4.0,
    personalVector: 'Global fertilizer & crude supplier. Instability impacts grocery staple prices and energy bills.',
    primarySector: 'Fertilizers & Gas'
  },
  { 
    id: 'south korea', 
    name: 'Korean Semiconductor Hub', 
    lat: 37.5665, 
    lng: 126.9780, 
    threat: 'ELEVATED', 
    color: 0x38bdf8, 
    colorHex: '#38bdf8', 
    pulseSpeed: 2.0, 
    maxScale: 3.4,
    personalVector: 'Produces over 50% of smartphone memory chips (DRAM/NAND). Delays gadget upgrades.',
    primarySector: 'Memory Tech'
  },
  { 
    id: 'china', 
    name: 'China Manufacturing Hub', 
    lat: 39.9042, 
    lng: 116.4074, 
    threat: 'ELEVATED', 
    color: 0xffb800, 
    colorHex: '#ffb800', 
    pulseSpeed: 2.0, 
    maxScale: 3.5,
    personalVector: 'Supplies 60%+ of consumer hardware. Export limits lead to immediate retail hardware shortages.',
    primarySector: 'Consumer Hardware'
  },
  { 
    id: 'india', 
    name: 'India (Domestic)', 
    lat: 28.6139, 
    lng: 77.2090, 
    threat: 'MONITORED', 
    color: 0x00ff9d, 
    colorHex: '#00ff9d', 
    pulseSpeed: 1.6, 
    maxScale: 3.0,
    personalVector: 'Domestic transit, monsoon weather, food supply, and local IT cyber readiness.',
    primarySector: 'Civic & Tech Hub'
  },
  { 
    id: 'us', 
    name: 'United States', 
    lat: 38.8951, 
    lng: -77.0364, 
    threat: 'ELEVATED', 
    color: 0x00f3ff, 
    colorHex: '#00f3ff', 
    pulseSpeed: 1.8, 
    maxScale: 3.2,
    personalVector: 'Hosts prime cloud compute and software engines (AWS/GCP/MSFT) governing digital services.',
    primarySector: 'Cloud & Finance'
  },
  { 
    id: 'uk', 
    name: 'United Kingdom', 
    lat: 51.5074, 
    lng: -0.1278, 
    threat: 'MONITORED', 
    color: 0x00ff9d, 
    colorHex: '#00ff9d', 
    pulseSpeed: 1.4, 
    maxScale: 2.8,
    personalVector: 'North Atlantic financial & reinsurance hub governing cross-border freight insurance.',
    primarySector: 'Financial Corridors'
  },
  { 
    id: 'japan', 
    name: 'Japan', 
    lat: 35.6762, 
    lng: 139.6503, 
    threat: 'MONITORED', 
    color: 0x00f3ff, 
    colorHex: '#00f3ff', 
    pulseSpeed: 1.5, 
    maxScale: 2.8,
    personalVector: 'Precision silicon equipment and photoresists essential for fabrication of computer chips.',
    primarySector: 'Precision Chemistry'
  },
  { 
    id: 'sudan', 
    name: 'Sudan & Red Sea Rim', 
    lat: 15.5007, 
    lng: 32.5599, 
    threat: 'HIGH', 
    color: 0xff5500, 
    colorHex: '#ff5500', 
    pulseSpeed: 2.4, 
    maxScale: 3.6,
    personalVector: 'Nile shipping and gum arabic supply affecting food additives and pharma binders.',
    primarySector: 'Regional Security'
  }
];

// High-Tech Supply Chain & Chip Corridors
const SUPPLY_CORRIDORS = [
  { from: 'taiwan', to: 'us', label: 'Advanced TSMC Semiconductor Flow', type: 'chips' },
  { from: 'taiwan', to: 'india', label: 'Electronics & Component Assembly Corridor', type: 'chips' },
  { from: 'south korea', to: 'us', label: 'Memory & NAND Storage Supply Flow', type: 'chips' },
  { from: 'iran', to: 'india', label: 'Crude Petroleum Energy Line', type: 'energy' },
  { from: 'israel', to: 'uk', label: 'Red Sea Maritime Container Route', type: 'freight' },
  { from: 'china', to: 'us', label: 'Trans-Pacific Consumer Goods Flow', type: 'freight' },
  { from: 'japan', to: 'taiwan', label: 'Silicon Wafer & Photolithography Flow', type: 'chips' }
];

// Trans-Oceanic Undersea Cyber Fiber Cables
const UNDERSEA_CABLES = [
  { from: 'us', to: 'uk', label: 'Trans-Atlantic Fiber Optic Backbone', type: 'cyber' },
  { from: 'uk', to: 'india', label: 'Europe-Asia Submarine Fiber Corridor', type: 'cyber' },
  { from: 'india', to: 'japan', label: 'Bay of Bengal to Indo-Pacific Cyber Link', type: 'cyber' },
  { from: 'us', to: 'japan', label: 'Trans-Pacific Cloud Bridge (FASTER/JUPITER)', type: 'cyber' }
];

// Convert latitude and longitude to 3D Cartesian Vector
function latLngToVector3(lat, lng, radius, altitude = 0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const r = radius + altitude;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// Convert 3D Cartesian vector back to Lat/Lng
function vector3ToLatLng(vector, radius) {
  const norm = vector.clone().normalize();
  const phi = Math.acos(norm.y);
  const theta = Math.atan2(norm.z, -norm.x);
  const lat = 90 - (phi * 180 / Math.PI);
  let lng = (theta * 180 / Math.PI) - 180;
  if (lng < -180) lng += 360;
  if (lng > 180) lng -= 360;
  return { lat, lng };
}

// Fallback procedural canvas texture to guarantee globe is never blank
function createProceduralEarthTexture(isNight = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  if (isNight) {
    oceanGrad.addColorStop(0, '#020612');
    oceanGrad.addColorStop(0.5, '#040b1e');
    oceanGrad.addColorStop(1, '#02050f');
  } else {
    oceanGrad.addColorStop(0, '#0c2444');
    oceanGrad.addColorStop(0.5, '#0d3268');
    oceanGrad.addColorStop(1, '#081f3d');
  }
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lat/Lng Grid
  ctx.strokeStyle = isNight ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Continental landmass blobs
  ctx.fillStyle = isNight ? '#091c38' : '#1e4b38';
  ctx.strokeStyle = isNight ? '#00f3ff' : '#4ade80';
  ctx.lineWidth = 1.5;

  const drawLandBlob = (x, y, w, h) => {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };

  drawLandBlob(250, 180, 80, 50); // North America
  drawLandBlob(320, 340, 50, 80); // South America
  drawLandBlob(540, 160, 120, 60); // Europe & Russia
  drawLandBlob(520, 280, 70, 90);  // Africa
  drawLandBlob(720, 200, 110, 70); // Asia
  drawLandBlob(820, 360, 50, 40);  // Australia

  if (isNight) {
    ctx.fillStyle = '#ffea79';
    for (let i = 0; i < 220; i++) {
      const rx = (Math.random() * 0.7 + 0.15) * canvas.width;
      const ry = (Math.random() * 0.6 + 0.2) * canvas.height;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function Globe3D({ 
  selectedCountry = 'global', 
  onSelectCountry,
  onOpenImpactModal 
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const globeMeshRef = useRef(null);
  const heatRingsRef = useRef([]);
  const beaconMeshesRef = useRef([]);
  const supplyPulsesRef = useRef([]);
  const targetCamPos = useRef(null);
  const customPinRef = useRef(null);

  // Smart Interactive Globe Modes & Layers
  const [globeMode, setGlobeMode] = useState('space'); // 'space' (Daylight Earth) or 'cyber' (Night Lights)
  const [showSupplyArcs, setShowSupplyArcs] = useState(true); // Flowing semiconductor/supply corridors
  const [showCyberCables, setShowCyberCables] = useState(true); // Undersea internet cables
  const [showHeatmaps, setShowHeatmaps] = useState(true); // Dynamic threat & impact rings
  const [autoRotate, setAutoRotate] = useState(true);

  // Smart HUD State
  const [smartTarget, setSmartTarget] = useState(null); // Node or geo-coordinate targeted
  const [smartHudPos, setSmartHudPos] = useState(null); // Screen coordinates for floating HUD
  const [customPinCoord, setCustomPinCoord] = useState(null);

  const GLOBE_RADIUS = 100;

  // Initialize Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 35, 290);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 120;
    controls.maxDistance = 500;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.55;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x445577, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.3);
    sunLight.position.set(300, 150, 200);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00f3ff, 1.1);
    rimLight.position.set(-200, -100, -200);
    scene.add(rimLight);

    // 6. Starfield (2,200 stars)
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 2200;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      const radius = 600 + Math.random() * 450;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0.85 });
    scene.add(new THREE.Points(starsGeo, starsMat));

    // 7. Earth Sphere
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const initialTexture = createProceduralEarthTexture(globeMode === 'cyber');
    const earthMat = new THREE.MeshStandardMaterial({
      map: initialTexture,
      roughness: 0.5,
      metalness: 0.1
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);
    globeMeshRef.current = earthMesh;

    // Load High-Res NASA Texture asynchronously
    const textureLoader = new THREE.TextureLoader();
    const targetUrl = globeMode === 'space'
      ? 'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg'
      : 'https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg';

    textureLoader.load(
      targetUrl,
      (loadedTex) => {
        loadedTex.wrapS = THREE.RepeatWrapping;
        loadedTex.wrapT = THREE.ClampToEdgeWrapping;
        earthMat.map = loadedTex;
        earthMat.needsUpdate = true;
      },
      undefined,
      (err) => console.log('Using procedural Earth texture:', err)
    );

    // 8. Atmospheric Luminous Halo
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.04, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 color;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(color, 1.0) * intensity;
        }
      `,
      uniforms: {
        color: { value: new THREE.Color(globeMode === 'space' ? 0x38bdf8 : 0x00f3ff) }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    scene.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

    // 9. Hotspot Glowing Beacons & Rings
    const ringsList = [];
    const beaconsList = [];

    GLOBAL_HOTSPOTS.forEach(h => {
      const pos = latLngToVector3(h.lat, h.lng, GLOBE_RADIUS);
      const normal = pos.clone().normalize();

      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(pos);
      beaconGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Vertical Laser Beam
      const beamGeo = new THREE.CylinderGeometry(0.35, 0.35, 9, 8);
      beamGeo.translate(0, 4.5, 0);
      const beamMat = new THREE.MeshBasicMaterial({ color: h.color, transparent: true, opacity: 0.85 });
      beaconGroup.add(new THREE.Mesh(beamGeo, beamMat));

      // Glowing Sphere Node
      const sphereGeo = new THREE.SphereGeometry(2.0, 16, 16);
      sphereGeo.translate(0, 9, 0);
      const sphereMat = new THREE.MeshBasicMaterial({ color: h.color });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.userData = h;
      beaconGroup.add(sphereMesh);
      beaconsList.push(sphereMesh);

      scene.add(beaconGroup);

      // Shockwave Concentric Rings
      const ringCount = h.threat === 'CRITICAL' ? 3 : 2;
      for (let r = 0; r < ringCount; r++) {
        const ringGeo = new THREE.RingGeometry(1.5, 3.5, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: h.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.4)));
        ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        
        ringMesh.userData = {
          baseScale: 1.0,
          scale: 1.0 + (r * 0.8),
          speed: h.pulseSpeed * 0.012,
          maxScale: h.maxScale,
          initialOpacity: 0.85
        };

        scene.add(ringMesh);
        ringsList.push(ringMesh);
      }
    });

    heatRingsRef.current = ringsList;
    beaconMeshesRef.current = beaconsList;

    // 10. Supply Chain Arcs & Moving Photon Pulses
    const pulseObjects = [];
    if (showSupplyArcs) {
      SUPPLY_CORRIDORS.forEach(conn => {
        const fromNode = GLOBAL_HOTSPOTS.find(h => h.id === conn.from);
        const toNode = GLOBAL_HOTSPOTS.find(h => h.id === conn.to);
        if (!fromNode || !toNode) return;

        const p1 = latLngToVector3(fromNode.lat, fromNode.lng, GLOBE_RADIUS);
        const p2 = latLngToVector3(toNode.lat, toNode.lng, GLOBE_RADIUS);

        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const dist = p1.distanceTo(p2);
        const arcAltitude = Math.min(65, dist * 0.38);
        mid.normalize().multiplyScalar(GLOBE_RADIUS + arcAltitude);

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(45);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        const arcMat = new THREE.LineBasicMaterial({
          color: conn.type === 'chips' ? 0xa855f7 : 0xffb800,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        });
        scene.add(new THREE.Line(arcGeo, arcMat));

        // Moving Photon Pulse Sphere
        const pulseGeo = new THREE.SphereGeometry(1.2, 8, 8);
        const pulseMat = new THREE.MeshBasicMaterial({ 
          color: conn.type === 'chips' ? 0xd8b4fe : 0xfef08a,
          blending: THREE.AdditiveBlending
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        scene.add(pulseMesh);

        pulseObjects.push({
          mesh: pulseMesh,
          curve,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.003
        });
      });
    }

    // 11. Undersea Cyber Cables
    if (showCyberCables) {
      UNDERSEA_CABLES.forEach(cable => {
        const fromNode = GLOBAL_HOTSPOTS.find(h => h.id === cable.from);
        const toNode = GLOBAL_HOTSPOTS.find(h => h.id === cable.to);
        if (!fromNode || !toNode) return;

        const p1 = latLngToVector3(fromNode.lat, fromNode.lng, GLOBE_RADIUS, 0.5);
        const p2 = latLngToVector3(toNode.lat, toNode.lng, GLOBE_RADIUS, 0.5);

        // Skim closer to ocean surface
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const dist = p1.distanceTo(p2);
        const arcAltitude = Math.min(18, dist * 0.12);
        mid.normalize().multiplyScalar(GLOBE_RADIUS + arcAltitude);

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(40);
        const cableGeo = new THREE.BufferGeometry().setFromPoints(points);
        const cableMat = new THREE.LineBasicMaterial({
          color: 0x00f3ff,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending
        });
        scene.add(new THREE.Line(cableGeo, cableMat));
      });
    }

    supplyPulsesRef.current = pulseObjects;

    // 12. Smart Raycasting (Nodes & Click-Anywhere Surface)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // 1. Check if clicked a hotspot beacon
      const beaconHits = raycaster.intersectObjects(beaconMeshesRef.current);
      if (beaconHits.length > 0) {
        const clickedHotspot = beaconHits[0].object.userData;
        if (clickedHotspot && clickedHotspot.id) {
          playEarcon('click');
          setSmartTarget(clickedHotspot);
          setSmartHudPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
          onSelectCountry(clickedHotspot.id);
          return;
        }
      }

      // 2. Click-Anywhere Earth Raycast
      if (earthMesh) {
        const earthHits = raycaster.intersectObject(earthMesh);
        if (earthHits.length > 0) {
          playEarcon('click');
          const hitPoint = earthHits[0].point;
          const { lat, lng } = vector3ToLatLng(hitPoint, GLOBE_RADIUS);

          // Find nearest hotspot within proximity
          let nearest = null;
          let minDist = Infinity;
          for (const h of GLOBAL_HOTSPOTS) {
            const hVec = latLngToVector3(h.lat, h.lng, GLOBE_RADIUS);
            const d = hitPoint.distanceTo(hVec);
            if (d < minDist) {
              minDist = d;
              nearest = h;
            }
          }

          // Target reticle coordinate
          const customTarget = {
            id: nearest && minDist < 45 ? nearest.id : 'custom',
            name: nearest && minDist < 45 ? `${nearest.name} Sector` : `Coordinates [${lat.toFixed(1)}°, ${lng.toFixed(1)}°]`,
            lat,
            lng,
            threat: nearest && minDist < 45 ? nearest.threat : 'MONITORED',
            colorHex: nearest && minDist < 45 ? nearest.colorHex : '#00f3ff',
            personalVector: nearest && minDist < 45 
              ? nearest.personalVector 
              : `Geographical telemetry coordinate at Lat: ${lat.toFixed(2)}°, Lng: ${lng.toFixed(2)}°. Nearest corridor: ${nearest ? nearest.name : 'Oceanic basin'}.`,
            primarySector: nearest && minDist < 45 ? nearest.primarySector : 'Planetary Grid'
          };

          setSmartTarget(customTarget);
          setSmartHudPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });

          // Spawn glowing target reticle pin
          if (customPinRef.current) scene.remove(customPinRef.current);
          const pinGroup = new THREE.Group();
          pinGroup.position.copy(hitPoint);
          pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), hitPoint.clone().normalize());

          const reticleGeo = new THREE.RingGeometry(1.5, 2.5, 16);
          const reticleMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, side: THREE.DoubleSide });
          pinGroup.add(new THREE.Mesh(reticleGeo, reticleMat));
          scene.add(pinGroup);
          customPinRef.current = pinGroup;

          if (nearest && minDist < 45) {
            onSelectCountry(nearest.id);
          }
        }
      }
    };

    // Hover inspection
    const handleCanvasMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const beaconHits = raycaster.intersectObjects(beaconMeshesRef.current);
      if (beaconHits.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        const hovered = beaconHits[0].object.userData;
        if (hovered && (!smartTarget || smartTarget.id !== hovered.id)) {
          setSmartTarget(hovered);
          setSmartHudPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }
      } else {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);
    renderer.domElement.addEventListener('mousemove', handleCanvasMouseMove);

    // 13. Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 700;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 14. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Camera lerp
      if (targetCamPos.current) {
        camera.position.lerp(targetCamPos.current, 0.055);
        if (camera.position.distanceTo(targetCamPos.current) < 2) {
          targetCamPos.current = null;
        }
      }

      controls.update();

      // Pulsate heatwave rings
      if (showHeatmaps) {
        heatRingsRef.current.forEach(ring => {
          ring.userData.scale += ring.userData.speed;
          if (ring.userData.scale > ring.userData.maxScale) {
            ring.userData.scale = 1.0;
          }
          ring.scale.set(ring.userData.scale, ring.userData.scale, 1.0);
          const progress = (ring.userData.scale - 1.0) / (ring.userData.maxScale - 1.0);
          ring.material.opacity = (1.0 - progress) * 0.85;
        });
      }

      // Animate flowing photon pulses along supply arcs
      supplyPulsesRef.current.forEach(item => {
        item.progress += item.speed;
        if (item.progress > 1.0) item.progress = 0;
        const point = item.curve.getPoint(item.progress);
        item.mesh.position.copy(point);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.domElement.removeEventListener('mousemove', handleCanvasMouseMove);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [globeMode, showSupplyArcs, showCyberCables, showHeatmaps]);

  // Handle selectedCountry change to trigger camera flight
  useEffect(() => {
    if (!selectedCountry) return;
    const target = GLOBAL_HOTSPOTS.find(h => h.id === selectedCountry.toLowerCase());
    if (target && cameraRef.current) {
      const pos = latLngToVector3(target.lat, target.lng, GLOBE_RADIUS, 140);
      targetCamPos.current = pos;
      setSmartTarget(target);
    } else if (selectedCountry === 'global' && cameraRef.current) {
      targetCamPos.current = new THREE.Vector3(0, 35, 290);
    }
  }, [selectedCountry]);

  // Toggle Auto-rotation
  const toggleAutoRotate = () => {
    const next = !autoRotate;
    if (controlsRef.current) controlsRef.current.autoRotate = next;
    setAutoRotate(next);
  };

  // Zoom controls
  const handleZoom = (direction) => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.8 : 1.25;
    cameraRef.current.position.multiplyScalar(factor);
    if (cameraRef.current.position.length() < 120) cameraRef.current.position.setLength(120);
    if (cameraRef.current.position.length() > 500) cameraRef.current.position.setLength(500);
  };

  const handleResetView = () => {
    targetCamPos.current = new THREE.Vector3(0, 35, 290);
    setSmartTarget(null);
    onSelectCountry('global');
  };

  return (
    <div className="relative w-full h-[480px] lg:h-[530px] overflow-hidden border border-wire-border flex flex-col bg-[#080B11] select-none">
      
      {/* Top Left HUD — Mode and Layer Controls */}
      <div className="absolute top-2.5 left-3 z-10 flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-2 bg-wire-base/90 backdrop-blur-md px-2.5 py-1.5 border border-wire-border shadow-lg">
          <Crosshair className="w-3.5 h-3.5 text-wire-amber animate-spin-slow" />
          <span className="font-mono text-[10px] text-wire-fg tracking-widest font-semibold">
            SMART ORBITAL GLOBE
          </span>
          <span className="font-mono text-[9px] text-wire-subtle border border-wire-border px-1.5 py-0.2">
            WebGL 3D
          </span>
        </div>

        {/* View Mode Toggle: Day / Night */}
        <div className="flex items-center bg-wire-base/90 backdrop-blur-md border border-wire-border font-mono text-[10px]">
          <button
            onClick={() => setGlobeMode('space')}
            className={`px-2.5 py-1.5 flex items-center gap-1 transition-colors ${
              globeMode === 'space' ? 'bg-wire-raised text-wire-fg' : 'text-wire-subtle hover:text-wire-fg'
            }`}
            title="Photorealistic daylight Earth"
          >
            <Eye className="w-3 h-3" />
            <span>Day</span>
          </button>
          <button
            onClick={() => setGlobeMode('cyber')}
            className={`px-2.5 py-1.5 flex items-center gap-1 border-l border-wire-border transition-colors ${
              globeMode === 'cyber' ? 'bg-wire-raised text-wire-fg' : 'text-wire-subtle hover:text-wire-fg'
            }`}
            title="Night cyber city lights"
          >
            <Sparkles className="w-3 h-3" />
            <span>Night</span>
          </button>
        </div>

        {/* Smart Layer Toggles */}
        <div className="hidden sm:flex items-center bg-wire-base/90 backdrop-blur-md border border-wire-border font-mono text-[10px]">
          <button
            onClick={() => setShowSupplyArcs(!showSupplyArcs)}
            className={`px-2 py-1.5 flex items-center gap-1 transition-colors ${
              showSupplyArcs ? 'text-purple-400 bg-purple-950/30' : 'text-wire-subtle hover:text-wire-fg'
            }`}
            title="Toggle Semiconductor & Supply Corridors"
          >
            <Zap className="w-3 h-3" />
            <span>Chips/Supply</span>
          </button>
          <button
            onClick={() => setShowCyberCables(!showCyberCables)}
            className={`px-2 py-1.5 flex items-center gap-1 border-l border-wire-border transition-colors ${
              showCyberCables ? 'text-cyan-400 bg-cyan-950/30' : 'text-wire-subtle hover:text-wire-fg'
            }`}
            title="Toggle Submarine Fiber Optic Cables"
          >
            <Cable className="w-3 h-3" />
            <span>Cyber Cables</span>
          </button>
        </div>
      </div>

      {/* Top Right HUD — Camera & Rotation Controls */}
      <div className="absolute top-2.5 right-3 z-10 flex items-center gap-1 bg-wire-base/90 backdrop-blur-md p-1 border border-wire-border shadow-lg">
        <button
          onClick={() => setShowHeatmaps(!showHeatmaps)}
          className={`px-2 py-1 font-mono text-[10px] flex items-center gap-1 transition-colors ${
            showHeatmaps ? 'text-wire-amber' : 'text-wire-subtle hover:text-wire-fg'
          }`}
          title="Toggle threat heatmap shockwaves"
        >
          <Flame className="w-3 h-3" />
          <span className="hidden md:inline">Heatmap</span>
        </button>

        <button
          onClick={toggleAutoRotate}
          className={`p-1.5 transition-colors ${
            autoRotate ? 'text-wire-amber' : 'text-wire-subtle hover:text-wire-fg'
          }`}
          title={autoRotate ? 'Pause Earth orbit' : 'Resume Earth orbit'}
        >
          <Radio className={`w-3.5 h-3.5 ${autoRotate ? 'animate-pulse-slow' : ''}`} />
        </button>

        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 text-wire-subtle hover:text-wire-fg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 text-wire-subtle hover:text-wire-fg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetView}
          className="p-1.5 text-wire-subtle hover:text-wire-amber transition-colors"
          title="Reset Global Vantage"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SMART TELEMETRY INSPECTION HUD CARD (Floating over 3D Globe) */}
      {smartTarget && (
        <div 
          className="absolute top-14 left-3 sm:left-4 z-20 max-w-[340px] bg-wire-base/95 backdrop-blur-md border border-wire-border p-3.5 shadow-2xl animate-fade-in pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-wire-border/60 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                style={{ backgroundColor: smartTarget.colorHex || '#00f3ff' }} 
              />
              <span className="font-mono text-xs font-bold text-wire-fg tracking-wide">
                {smartTarget.name}
              </span>
            </div>
            <span className={`font-mono text-[9px] px-1.5 py-0.5 border ${
              smartTarget.threat === 'CRITICAL' ? 'border-red-500/40 text-red-400 bg-red-950/40' :
              smartTarget.threat === 'HIGH' ? 'border-orange-500/40 text-orange-400 bg-orange-950/40' :
              'border-cyan-500/40 text-cyan-400 bg-cyan-950/40'
            }`}>
              {smartTarget.threat || 'MONITORED'}
            </span>
          </div>

          {/* Coordinates & Sector */}
          <div className="flex items-center justify-between font-mono text-[10px] text-wire-subtle mb-2">
            <span>Lat: {smartTarget.lat.toFixed(1)}° · Lng: {smartTarget.lng.toFixed(1)}°</span>
            <span className="text-wire-fg">{smartTarget.primarySector || 'Planetary Grid'}</span>
          </div>

          {/* How This Affects You 1-Liner */}
          <div className="bg-wire-surface border border-wire-border p-2.5 mb-2.5">
            <div className="font-mono text-[9px] text-wire-amber tracking-widest uppercase flex items-center gap-1 mb-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>HOW THIS AFFECTS YOU:</span>
            </div>
            <p className="text-[11px] text-wire-fg leading-relaxed">
              {smartTarget.personalVector || 'Telemetry sector under routine orbital observation. Normal domestic operations.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playEarcon('click');
                onSelectCountry(smartTarget.id);
              }}
              className="flex-1 py-1.5 bg-wire-raised hover:bg-wire-hover border border-wire-border font-mono text-[10px] text-wire-fg transition-colors flex items-center justify-center gap-1"
            >
              <span>Focus Sector</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            
            {onOpenImpactModal && (
              <button
                onClick={() => {
                  playEarcon('click');
                  onOpenImpactModal();
                }}
                className="py-1.5 px-2.5 bg-wire-amber text-black hover:bg-amber-400 font-mono text-[10px] font-semibold transition-colors flex items-center gap-1"
                title="Deep dive personal impact breakdown"
              >
                <Sparkles className="w-3 h-3" />
                <span>Impact Breakdown</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Hotspot Quick Selector Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-1 bg-wire-base/90 backdrop-blur-md px-3 py-2 border-t border-wire-border overflow-x-auto no-scrollbar">
        <span className="font-mono text-[10px] text-wire-subtle mr-1 shrink-0">Smart Hubs:</span>
        {GLOBAL_HOTSPOTS.map(h => (
          <button
            key={h.id}
            onClick={() => {
              playEarcon('click');
              onSelectCountry(h.id);
              setSmartTarget(h);
            }}
            className={`font-mono text-[10px] px-2 py-0.5 border transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCountry.toLowerCase() === h.id
                ? 'bg-wire-raised text-wire-fg border-wire-amber shadow-sm'
                : 'text-wire-subtle border-wire-border hover:text-wire-fg hover:border-wire-muted'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: h.colorHex }} />
            <span>{h.name}</span>
          </button>
        ))}
      </div>

      {/* Three.js WebGL Canvas Mount */}
      <div 
        ref={mountRef} 
        className="flex-1 w-full h-full min-h-[480px] cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Eye, 
  MapPin, 
  Navigation, 
  Compass, 
  Sparkles,
  Maximize2,
  Globe2
} from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../services/explorerService';

const GLOBE_RADIUS = 100;

/**
 * Convert lat/lng to 3D vector coordinates on sphere
 */
export function latLngToVector3(lat, lng, radius = GLOBE_RADIUS, altitude = 0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const r = radius + altitude;

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Convert 3D vector coordinates back to lat/lng
 */
export function vector3ToLatLng(vector) {
  const norm = vector.clone().normalize();
  const lat = 90 - (Math.acos(norm.y) * 180) / Math.PI;
  const lng = ((270 + (Math.atan2(norm.x, norm.z) * 180) / Math.PI) % 360) - 180;
  return { lat, lng };
}

export default function WorldGlobe3D({
  places = [],
  selectedPlace = null,
  onSelectPlace,
  focusedCoordinates = null,
  activeCategory = 'all',
  selectedCountry = null,
  onCountryClick,
  zoomLevel = 4,
  className = ''
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const markersGroupRef = useRef(null);
  const bordersGroupRef = useRef(null);
  const activePulseMeshRef = useRef(null);
  const animFrameId = useRef(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const [globeTheme, setGlobeTheme] = useState('blue_marble'); // 'blue_marble' | 'cyber_night' | 'topographic'
  const [showBorders, setShowBorders] = useState(true);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Camera lerp animation target
  const targetCameraPos = useRef(null);
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2500);
    camera.position.set(0, 40, 280);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 112; // Allow close zooming
    controls.maxDistance = 600;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xa5b4fc, 2.0);
    dirLight1.position.set(300, 200, 300);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-300, -100, -200);
    scene.add(dirLight2);

    // 6. Globe Sphere
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);

    // Create high-tech Earth canvas procedural texture for crisp offline performance
    const globeCanvas = document.createElement('canvas');
    globeCanvas.width = 2048;
    globeCanvas.height = 1024;
    const ctx = globeCanvas.getContext('2d');

    // Ocean Gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#030712');
    oceanGrad.addColorStop(0.3, '#0b192c');
    oceanGrad.addColorStop(0.5, '#021526');
    oceanGrad.addColorStop(0.7, '#081c36');
    oceanGrad.addColorStop(1, '#020617');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Subtle Grid Lines (Lat/Long parallels)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = ((90 - lat) / 180) * 1024;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = ((lng + 180) / 360) * 2048;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }

    // Equator highlight
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 512);
    ctx.lineTo(2048, 512);
    ctx.stroke();

    const canvasTexture = new THREE.CanvasTexture(globeCanvas);
    canvasTexture.needsUpdate = true;

    // Globe Material
    const globeMat = new THREE.MeshStandardMaterial({
      map: canvasTexture,
      roughness: 0.5,
      metalness: 0.2,
      color: 0x0ea5e9
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);

    // Load Real NASA Satellite Earth Texture if online
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        globeMat.map = loadedTex;
        globeMat.color.setHex(0xffffff);
        globeMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback remains the procedural crisp canvas
      }
    );

    // 7. Outer Atmospheric Glow
    const glowGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0) * intensity * 0.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // 8. Markers Group for Places
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    scene.add(markersGroup);

    // 9. Country Borders Group
    const bordersGroup = new THREE.Group();
    bordersGroupRef.current = bordersGroup;
    scene.add(bordersGroup);

    // Load Real Country Boundaries GeoJSON
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(geoJson => {
        if (!geoJson || !geoJson.features) return;
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.45,
          linewidth: 1
        });

        geoJson.features.forEach(feature => {
          const { geometry } = feature;
          if (!geometry) return;

          const coordinates = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
          coordinates.forEach(poly => {
            poly.forEach(ring => {
              const points = [];
              ring.forEach(([lng, lat]) => {
                points.push(latLngToVector3(lat, lng, GLOBE_RADIUS * 1.002));
              });
              if (points.length > 2) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeo, lineMaterial);
                bordersGroup.add(line);
              }
            });
          });
        });
      })
      .catch(err => console.warn('[Country Borders Warning]:', err.message));

    // 10. Pulsing Beacon Ring at active coordinates
    const ringGeo = new THREE.RingGeometry(1.2, 2.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const pulseMesh = new THREE.Mesh(ringGeo, ringMat);
    pulseMesh.visible = false;
    activePulseMeshRef.current = pulseMesh;
    scene.add(pulseMesh);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Controls update
      controls.update();

      // Camera lerp movement
      if (targetCameraPos.current) {
        camera.position.lerp(targetCameraPos.current, 0.05);
        if (camera.position.distanceTo(targetCameraPos.current) < 1.0) {
          targetCameraPos.current = null;
        }
      }

      // Pulse beacon animation
      if (pulseMesh.visible) {
        const scale = 1.0 + Math.sin(time * 4) * 0.4;
        pulseMesh.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.place) {
          setHoveredPlace(hit.userData.place);
          setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top - 15 });
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredPlace(null);
      renderer.domElement.style.cursor = 'grab';
    };

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.place && onSelectPlace) {
          onSelectPlace(hit.userData.place);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointermove', onPointerMove);
    domEl.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('pointermove', onPointerMove);
      domEl.removeEventListener('click', onClick);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (renderer) renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update Borders Visibility
  useEffect(() => {
    if (bordersGroupRef.current) {
      bordersGroupRef.current.visible = showBorders;
    }
  }, [showBorders]);

  // Render Place Markers on Globe
  useEffect(() => {
    if (!markersGroupRef.current) return;
    const group = markersGroupRef.current;

    // Clear existing markers
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    if (!places || places.length === 0) return;

    // Add marker pins for each real place
    places.forEach((place) => {
      if (!place.lat || !place.lng) return;

      const isHospital = place.category === 'healthcare' || 
                         (place.name && place.name.toLowerCase().includes('hospital')) ||
                         (place.type && place.type.toLowerCase().includes('hospital'));

      const catDef = isHospital 
        ? CATEGORY_DEFINITIONS.healthcare 
        : (CATEGORY_DEFINITIONS[place.category] || CATEGORY_DEFINITIONS.education);

      const colorHex = isHospital 
        ? 0xef4444 
        : parseInt((catDef.markerColor || '#38bdf8').replace('#', '0x'), 16);

      const isSelected = selectedPlace && selectedPlace.id === place.id;
      const pinRadius = isSelected ? 3.0 : 2.2;

      const pos = latLngToVector3(place.lat, place.lng, GLOBE_RADIUS * 1.01);
      const normal = pos.clone().normalize();

      // Pin Head (Larger Sphere with vibrant emissive glow)
      const pinGeo = new THREE.SphereGeometry(pinRadius, 18, 18);
      const pinMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xffffff : colorHex,
        emissive: colorHex,
        emissiveIntensity: isSelected ? 1.4 : 0.85,
        roughness: 0.15,
        metalness: 0.3
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(2.0)));
      pinMesh.userData = { place };

      // Pin Stem
      const stemHeight = isSelected ? 3.8 : 3.0;
      const stemGeo = new THREE.CylinderGeometry(0.3, 0.5, stemHeight, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: isSelected ? 0xffffff : colorHex });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(stemHeight * 0.4)));
      stemMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      stemMesh.userData = { place };

      const markerBundle = new THREE.Group();
      markerBundle.add(pinMesh);
      markerBundle.add(stemMesh);

      // Add a base ring for high visibility
      const ringGeo = new THREE.RingGeometry(0.8, 1.8, 16);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: colorHex, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.8 
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.05)));
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      markerBundle.add(ringMesh);

      group.add(markerBundle);
    });
  }, [places]);

  // Fly Camera to Focused Coordinates or Selected Place
  useEffect(() => {
    const coord = focusedCoordinates || (selectedPlace ? { lat: selectedPlace.lat, lng: selectedPlace.lng } : null);
    if (!coord || !coord.lat || !coord.lng || !cameraRef.current) return;

    // Dynamic altitude based on zoom level (State/Region = 145, City = 125, Place = 115)
    let distance = 145;
    if (selectedPlace) {
      distance = 115;
    } else if (zoomLevel === 1) {
      distance = 275;
    } else if (zoomLevel === 2) {
      distance = 220;
    } else if (zoomLevel === 3) {
      distance = 180;
    } else if (zoomLevel === 4) {
      distance = 145;
    } else if (zoomLevel >= 5) {
      distance = 120;
    }

    const targetPos = latLngToVector3(coord.lat, coord.lng, distance);
    targetCameraPos.current = targetPos;

    // Move pulse ring
    if (activePulseMeshRef.current) {
      const surfacePos = latLngToVector3(coord.lat, coord.lng, GLOBE_RADIUS * 1.008);
      const normal = surfacePos.clone().normalize();
      activePulseMeshRef.current.position.copy(surfacePos);
      activePulseMeshRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      activePulseMeshRef.current.visible = true;
    }
  }, [focusedCoordinates, selectedPlace]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.multiplyScalar(0.8);
  };

  const handleZoomOut = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.multiplyScalar(1.2);
  };

  const handleResetView = () => {
    targetCameraPos.current = new THREE.Vector3(0, 40, 280);
    if (activePulseMeshRef.current) activePulseMeshRef.current.visible = false;
  };

  return (
    <div className={`relative w-full h-full min-h-[460px] bg-slate-950/90 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          title="Reset Planetary View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all shadow-lg active:scale-95 ${
            autoRotate
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
              : 'bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
          title="Toggle Auto Rotation"
        >
          <Compass className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={() => setShowBorders(!showBorders)}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all shadow-lg active:scale-95 ${
            showBorders
              ? 'bg-purple-500/20 text-purple-300 border-purple-400'
              : 'bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
          title="Toggle Country Boundaries"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredPlace && (
        <div
          className="pointer-events-none absolute z-30 px-3 py-2 rounded-xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl text-xs backdrop-blur-md max-w-xs transition-opacity duration-150"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: (CATEGORY_DEFINITIONS[hoveredPlace.category] || CATEGORY_DEFINITIONS.education).color }}
            />
            <span className="font-bold text-white truncate">{hoveredPlace.name}</span>
          </div>
          <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
            {hoveredPlace.categoryLabel} {hoveredPlace.distanceFormatted ? `· ${hoveredPlace.distanceFormatted}` : ''}
          </div>
          {hoveredPlace.address && (
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{hoveredPlace.address}</div>
          )}
        </div>
      )}

      {/* Bottom Globe Status Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-xs font-mono text-slate-300 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-slate-400">3D Globe Engine:</span>
        <span className="text-cyan-300 font-bold">Planetary Orbit</span>
        {places.length > 0 && (
          <>
            <span className="text-slate-600">|</span>
            <span className="text-purple-300 font-semibold">{places.length} OSM Markers</span>
          </>
        )}
      </div>
    </div>
  );
}

with open("c:/Users/Sumanth/OneDrive/Desktop/Global-Intel-Telemetry/frontend/src/components/WorldGlobe3D.jsx", "r", encoding="utf-8") as f:
    code = f.read()

# Update props to include zoomLevel
old_props = """export default function WorldGlobe3D({
  places = [],
  selectedPlace = null,
  onSelectPlace,
  focusedCoordinates = null,
  activeCategory = 'all',
  selectedCountry = null,
  onCountryClick,
  className = ''
}) {"""

new_props = """export default function WorldGlobe3D({
  places = [],
  selectedPlace = null,
  onSelectPlace,
  focusedCoordinates = null,
  activeCategory = 'all',
  selectedCountry = null,
  onCountryClick,
  zoomLevel = 4,
  className = ''
}) {"""

# Update marker generation
old_marker = """    // Add marker pins for each real place
    places.forEach((place) => {
      if (!place.lat || !place.lng) return;

      const catDef = CATEGORY_DEFINITIONS[place.category] || CATEGORY_DEFINITIONS.education;
      const colorHex = parseInt((catDef.markerColor || '#38bdf8').replace('#', '0x'), 16);

      const pos = latLngToVector3(place.lat, place.lng, GLOBE_RADIUS * 1.01);
      const normal = pos.clone().normalize();

      // Pin Head (Sphere)
      const pinGeo = new THREE.SphereGeometry(1.4, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(1.5)));
      pinMesh.userData = { place };

      // Pin Stem (Cylinder pointing outwards from globe center)
      const stemGeo = new THREE.CylinderGeometry(0.2, 0.4, 2.8, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.7)));
      stemMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      stemMesh.userData = { place };

      const markerBundle = new THREE.Group();
      markerBundle.add(pinMesh);
      markerBundle.add(stemMesh);

      group.add(markerBundle);
    });"""

new_marker = """    // Add marker pins for each real place
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
    });"""

# Update camera altitude handling
old_camera = """    // Altitude: 130 for street/place level zoom, 190 for general area
    const distance = selectedPlace ? 130 : 160;
    const targetPos = latLngToVector3(coord.lat, coord.lng, distance);
    targetCameraPos.current = targetPos;"""

new_camera = """    // Dynamic altitude based on zoom level (State/Region = 145, City = 125, Place = 115)
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
    targetCameraPos.current = targetPos;"""

code_updated = code.replace(old_props, new_props)
if code_updated == code:
    print("Warning: old_props not found, checking CRLF")
    code = code.replace("\r\n", "\n")
    code_updated = code.replace(old_props.replace("\r\n", "\n"), new_props.replace("\r\n", "\n"))

code_updated = code_updated.replace(old_marker.replace("\r\n", "\n"), new_marker.replace("\r\n", "\n"))
code_updated = code_updated.replace(old_camera.replace("\r\n", "\n"), new_camera.replace("\r\n", "\n"))

with open("c:/Users/Sumanth/OneDrive/Desktop/Global-Intel-Telemetry/frontend/src/components/WorldGlobe3D.jsx", "w", encoding="utf-8") as f:
    f.write(code_updated)

print("WorldGlobe3D.jsx updated successfully!")

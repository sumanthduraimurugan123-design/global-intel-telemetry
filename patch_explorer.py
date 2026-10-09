with open("c:/Users/Sumanth/OneDrive/Desktop/Global-Intel-Telemetry/frontend/src/pages/WorldExplorer.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add zoomLevel state
target_state = "  const [searchRadius, setSearchRadius] = useState(4000); // meters"
replacement_state = """  const [searchRadius, setSearchRadius] = useState(4000); // meters
  const [zoomLevel, setZoomLevel] = useState(4); // 1: world, 2: continent, 3: country, 4: state, 5: city"""

content = content.replace(target_state, replacement_state)

# Replace preset queries with global and hospital queries
target_presets = """  // Quick Preset Search Queries
  const PRESET_QUERIES = [
    { label: '🏥 Hospitals in Chennai', q: 'Hospitals in Chennai', category: 'healthcare' },
    { label: '🏛️ Govt offices in Velachery', q: 'Government offices in Velachery', category: 'government' },
    { label: '🏫 Schools near me', q: 'Schools near me', category: 'education' },
    { label: '🚏 Bus stops in Velachery', q: 'Bus stops in Velachery', category: 'transport' },
    { label: '🛍️ Malls in Chennai', q: 'Malls in Chennai', category: 'shopping' },
    { label: '💳 Banks in Chennai', q: 'Banks in Chennai', category: 'finance' },
    { label: '🌳 Parks near me', q: 'Parks near me', category: 'leisure' }
  ];"""

replacement_presets = """  // Quick Preset Search Queries (Worldwide & Local with red hospital markers)
  const PRESET_QUERIES = [
    { label: '🏥 Hospitals in Chennai', q: 'Hospitals in Chennai', category: 'healthcare' },
    { label: '🏥 Hospitals in New York', q: 'Hospitals in New York', category: 'healthcare' },
    { label: '🏥 Hospitals in London', q: 'Hospitals in London', category: 'healthcare' },
    { label: '🏫 Universities in Boston', q: 'Universities in Boston', category: 'education' },
    { label: '🏛️ Govt offices in Velachery', q: 'Government offices in Velachery', category: 'government' },
    { label: '🛍️ Shopping in Tokyo', q: 'Shopping in Tokyo', category: 'shopping' },
    { label: '🚏 Transit in Paris', q: 'Transit in Paris', category: 'transport' },
    { label: '💳 Banks in Singapore', q: 'Banks in Singapore', category: 'finance' },
    { label: '🌳 Parks in Sydney', q: 'Parks in Sydney', category: 'leisure' }
  ];"""

content = content.replace(target_presets, replacement_presets)

# Pass zoomLevel into WorldGlobe3D in 3d view mode
target_globe_1 = """            <WorldGlobe3D
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => {
                playUiSound('click');
                setSelectedPlace(place);
              }}
              focusedCoordinates={centerCoords}
              activeCategory={activeCategory}
              className="w-full h-full min-h-[540px]"
            />"""

replacement_globe_1 = """            <WorldGlobe3D
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => {
                playUiSound('click');
                setSelectedPlace(place);
              }}
              focusedCoordinates={centerCoords}
              activeCategory={activeCategory}
              zoomLevel={zoomLevel}
              className="w-full h-full min-h-[540px]"
            />"""

content = content.replace(target_globe_1, replacement_globe_1)

# Pass zoomLevel into WorldGlobe3D in split view mode
target_globe_2 = """              <WorldGlobe3D
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onSelectPlace={(place) => {
                  playUiSound('click');
                  setSelectedPlace(place);
                }}
                focusedCoordinates={centerCoords}
                activeCategory={activeCategory}
                className="w-full h-full min-h-[480px]"
              />"""

replacement_globe_2 = """              <WorldGlobe3D
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onSelectPlace={(place) => {
                  playUiSound('click');
                  setSelectedPlace(place);
                }}
                focusedCoordinates={centerCoords}
                activeCategory={activeCategory}
                zoomLevel={zoomLevel}
                className="w-full h-full min-h-[480px]"
              />"""

content = content.replace(target_globe_2, replacement_globe_2)

# In handleSearch, set zoomLevel to 4 or 5
target_search_res = "        if (data.center) {\n          setCenterCoords({\n            lat: data.center.lat,\n            lng: data.center.lng,\n            label: data.parsed?.location || q\n          });\n        }"
replacement_search_res = "        if (data.center) {\n          setCenterCoords({\n            lat: data.center.lat,\n            lng: data.center.lng,\n            label: data.parsed?.location || q\n          });\n          setZoomLevel(4);\n        }"

content = content.replace(target_search_res, replacement_search_res)

with open("c:/Users/Sumanth/OneDrive/Desktop/Global-Intel-Telemetry/frontend/src/pages/WorldExplorer.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("WorldExplorer.jsx patched successfully!")

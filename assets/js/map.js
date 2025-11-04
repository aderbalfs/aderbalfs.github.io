export const map = L.map("map", { fullscreenControl: true }).setView(
  [-9.649, -35.708],
  13
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

export const areasLayer = L.geoJSON(null, {
  style: { color: "#d32f2f", weight: 2, fillOpacity: 0.15 },
}).addTo(map);

export const microareasLayer = L.geoJSON(null, {
  style: { color: "#1976d2", weight: 2, fillOpacity: 0.15 },
}).addTo(map);

L.control
  .layers(
    {},
    {
      Área: areasLayer,
      "Microárea (ACS)": microareasLayer,
    },
    { collapsed: window.innerWidth < 900 }
  )
  .addTo(map);

export function renderLayers(geojson) {
  areasLayer.clearLayers();
  microareasLayer.clearLayers();

  L.geoJSON(geojson, {
    filter: (f) => f.properties?.nivel === "area",
    style: areasLayer.options.style,
    onEachFeature: (feat, layer) => {
      const p = feat.properties || {};
      layer.bindPopup(
        `<b>Área</b><br>Área: ${p.area ?? "-"}<br>Logradouro: ${
          p.logradouro ?? "-"
        }`
      );
      areasLayer.addLayer(layer);
    },
  });

  L.geoJSON(geojson, {
    filter: (f) => f.properties?.nivel === "microarea",
    style: microareasLayer.options.style,
    onEachFeature: (feat, layer) => {
      const p = feat.properties || {};
      layer.bindPopup(
        `<b>Microárea (ACS)</b><br>Área: ${p.area ?? "-"}<br>ACS: ${
          p.acs ?? "-"
        }<br>Logradouro: ${p.logradouro ?? "-"}`
      );
      microareasLayer.addLayer(layer);
    },
  });

  const group = L.featureGroup([areasLayer, microareasLayer]);
  const bounds = group.getBounds();
  if (bounds.isValid()) map.fitBounds(bounds.pad(0.1));
}

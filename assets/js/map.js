// ===============================
//  GEO PORTAL 3D MAPAS - MAP.JS
// ===============================

// === Inicialização do mapa ===
const map = L.map("map", { fullscreenControl: true }).setView(
  [-9.649, -35.708],
  13
);

// === Camada base (OpenStreetMap) ===
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

// === Camadas (Áreas e Microáreas) ===
const areasLayer = L.geoJSON(null, {
  style: { color: "#d32f2f", weight: 2, fillOpacity: 0.15 },
}).addTo(map);

const microareasLayer = L.geoJSON(null, {
  style: { color: "#1976d2", weight: 2, fillOpacity: 0.15 },
}).addTo(map);

// === Controle de camadas ===
const layerControl = L.control
  .layers(
    { "Base OSM": map }, // base
    { Áreas: areasLayer, Microáreas: microareasLayer },
    { collapsed: false }
  )
  .addTo(map);

// ============================
//  CARREGAMENTO DA CIDADE
// ============================

async function carregarCidade() {
  try {
    console.log("📂 Carregando camada da cidade...");
    const response = await fetch("assets/data/cidade.geojson", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Arquivo cidade.geojson não encontrado");

    const cidadeData = await response.json();

    const cidadeLayer = L.geoJSON(cidadeData, {
      style: (feature) => ({
        color: feature.properties.stroke || "#ff0000",
        weight: 2,
        fillOpacity: feature.properties["fill-opacity"] || 0.1,
        opacity: feature.properties["stroke-opacity"] || 1,
      }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(`
          <b>${p.name || "Área sem nome"}</b><br>
          IBGE: ${p.IBGE_GEOCO || "-"}<br>
          População: ${p.population || "-"}
        `);
      },
    });

    // Adiciona a camada ao mapa
    cidadeLayer.addTo(map);

    // Adiciona ao controle de camadas
    layerControl.addOverlay(cidadeLayer, "Cidade - Itabaiana");

    // Centraliza o mapa na cidade
    map.fitBounds(cidadeLayer.getBounds());

    console.log("✅ Camada da cidade carregada com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao carregar a cidade:", err);
  }
}

// Executa após o DOM e o mapa estarem prontos
document.addEventListener("DOMContentLoaded", carregarCidade);

// ============================
//  Funções de controle extra
// ============================

// (Exemplo: fullscreen manual, recarregar dados, etc.)
// Você pode adicionar aqui outras camadas e funções personalizadas

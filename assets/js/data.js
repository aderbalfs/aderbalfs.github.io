import { uniqueSorted } from "./utils.js";

export const DATA_URL = "./assets/data/dados.json";

export async function loadData() {
  try {
    console.log("🔄 Tentando carregar dados de", DATA_URL);
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("dados.json não encontrado, usando fallback.");
    const data = await res.json();
    console.log("✅ Dados carregados (dados.json):", data);
    return data;
  } catch (e) {
    console.warn("⚠️", e.message);
    try {
      const fallback = await fetch("./assets/data/fallback.json");
      const data = await fallback.json();
      console.log("✅ Dados carregados (fallback):", data);
      return data;
    } catch (err) {
      console.error("❌ Falha ao carregar fallback.json", err);
      return { type: "FeatureCollection", features: [] };
    }
  }
}

export function filterFeatures(geojson, filter) {
  const feats = geojson.features || [];
  return {
    type: "FeatureCollection",
    features: feats.filter((f) => {
      const p = f.properties || {};
      const okArea = !filter.area || p.area === filter.area;
      const okAcs = !filter.acs || p.acs === filter.acs;
      const okLog = !filter.logradouro || p.logradouro === filter.logradouro;
      return okArea && okAcs && okLog;
    }),
  };
}

export function extractLists(geojson) {
  if (!geojson || !geojson.features) return { areas: [], acs: [], logs: [] };
  const feats = geojson.features;
  return {
    areas: uniqueSorted(feats.map((f) => f.properties?.area)),
    acs: uniqueSorted(feats.map((f) => f.properties?.acs)),
    logs: uniqueSorted(feats.map((f) => f.properties?.logradouro)),
  };
}

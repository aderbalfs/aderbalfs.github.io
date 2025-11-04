import { loadData, filterFeatures, extractLists } from "./data.js";
import { setOptions } from "./utils.js";
import "./map.js";
import { setupUI } from "./ui.js";

let fullData = null;
let currentFilter = { area: "", acs: "", logradouro: "" };

(async function init() {
  fullData = await loadData();

  const { areas, acs, logs } = extractLists(fullData);
  const selArea = document.getElementById("selArea");
  const selACS = document.getElementById("selACS");
  const selLog = document.getElementById("selLog");
  const btnFiltrar = document.getElementById("btnFiltrar");
  const btnLimpar = document.getElementById("btnLimpar");
  const btnFull = document.getElementById("btnFull");

  setOptions(selArea, areas, "Todas");
  setOptions(selACS, acs, "Todas");
  setOptions(selLog, logs, "Todos");
  selACS.disabled = false;
  selLog.disabled = false;

  setupUI(
    { selArea, selACS, selLog, btnFiltrar, btnLimpar, btnFull },
    fullData,
    (filter) => {
      currentFilter = filter;
      const subset = filterFeatures(fullData, currentFilter);
      renderLayers(subset);
    }
  );

  renderLayers(fullData);
})();

import { setOptions } from "./utils.js";

export function setupUI(
  { selArea, selACS, selLog, btnFiltrar, btnLimpar, btnFull },
  fullData,
  onFilter
) {
  selArea.addEventListener("change", () => {
    const areaSel = selArea.value;
    const feats = fullData.features || [];
    const acs = [
      ...new Set(
        feats
          .filter((f) => !areaSel || f.properties?.area === areaSel)
          .map((f) => f.properties?.acs)
      ),
    ];
    const logs = [
      ...new Set(
        feats
          .filter((f) => !areaSel || f.properties?.area === areaSel)
          .map((f) => f.properties?.logradouro)
      ),
    ];
    setOptions(selACS, acs, "Todas");
    setOptions(selLog, logs, "Todos");
  });

  selACS.addEventListener("change", () => {
    const areaSel = selArea.value;
    const acsSel = selACS.value;
    const feats = fullData.features || [];
    const logs = [
      ...new Set(
        feats
          .filter(
            (f) =>
              (!areaSel || f.properties?.area === areaSel) &&
              (!acsSel || f.properties?.acs === acsSel)
          )
          .map((f) => f.properties?.logradouro)
      ),
    ];
    setOptions(selLog, logs, "Todos");
  });

  btnFiltrar.addEventListener("click", () => {
    onFilter({
      area: selArea.value || "",
      acs: selACS.value || "",
      logradouro: selLog.value || "",
    });
  });

  btnLimpar.addEventListener("click", () => {
    selArea.value = "";
    selACS.value = "";
    selLog.value = "";
    onFilter({ area: "", acs: "", logradouro: "" });
  });

  btnFull.addEventListener("click", () => map.toggleFullscreen());
}

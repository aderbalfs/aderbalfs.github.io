export function uniqueSorted(arr) {
  return [...new Set(arr.filter((v) => v))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}

export function setOptions(select, values, placeholder) {
  const prev = select.value;
  select.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = placeholder;
  select.appendChild(opt);

  values.forEach((v) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    select.appendChild(o);
  });

  if (values.includes(prev)) select.value = prev;
}

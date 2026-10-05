export const themeStorageKey = "jj-lowery-theme";

// Runs before paint. Only an explicit light choice overrides the dark default.
export const themeInitScript = `try{document.documentElement.dataset.theme=localStorage.getItem(${JSON.stringify(themeStorageKey)})==="light"?"light":"dark"}catch{}`;

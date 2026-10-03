export const themeStorageKey = "jj-lowery-theme";

// Runs before the page is painted; blocked storage still leaves the light default.
export const themeInitScript = `try{document.documentElement.dataset.theme=localStorage.getItem(${JSON.stringify(themeStorageKey)})==="dark"?"dark":"light"}catch{}`;

export const themeStorageKey = "jj-lowery-theme";

// Runs before the page is painted; blocked storage still leaves the dark default.
export const themeInitScript = `try{document.documentElement.dataset.theme=localStorage.getItem(${JSON.stringify(themeStorageKey)})==="light"?"light":"dark"}catch{}`;

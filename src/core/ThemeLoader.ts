import {getStorageValue} from "../storage/StorageProvider";
import {ThemeName} from "../types/Themes.types";
import {themeRegistry} from "../config/Themes.config";

const applyThemeVariables = (themeVars: Record<string, string>) => {
    Object.entries(themeVars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
    });
};

const applyTheme = async (): Promise<void> => {
    const selectedTheme: ThemeName = getStorageValue("theme") as ThemeName ?? "DEFAULT";
    const themeVariables = themeRegistry[selectedTheme] ?? themeRegistry["DEFAULT"];
    applyThemeVariables(themeVariables);
};

export default applyTheme;

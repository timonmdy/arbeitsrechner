import {Theme, ThemeName} from "../types/Themes.types";

const DEFAULT_THEME: Theme = {
    "color-background": "#0f0f0f",
    "color-cards": "#272727",
    "color-borders": "#60606a",
    "color-accent": "#22d3ee",
    "color-text-primary": "#ffffff",
    "color-text-secondary": "#d1d5dc",
    "color-text-muted": "#7c7c87",
    "color-error": "#fb2c36",
    "color-warning": "#ffdf20",
    "color-success": "#00c951"
}

export const themeRegistry: Record<ThemeName, Theme> = {
    "DEFAULT": DEFAULT_THEME
}
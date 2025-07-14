export type StorageKey =
    | "arbeitsbeginn"
    | "hoTage"
    | "region"
    | "hoMonat"
    | "hoJahr"
    | "hoMode"
    | "hoQuote"
    | "theme"
    | "dayStatus"
    | "hoBereitsGearbeitet"
    | "hoAbwesenheit"
    | "arbeitszeitProTag"
    | "sidebarLocked";

const defaultValues: Record<StorageKey, unknown> = {
    "arbeitsbeginn": {
        value: "string",
        date: ""
    },
    "hoTage": 0,
    "region": "BUND",
    "hoMonat": new Date().getMonth() + 1,
    "hoJahr": new Date().getFullYear(),
    "hoMode": "countOffDays",
    "hoQuote": 60,
    "theme": "DEFAULT",
    "dayStatus": {},
    "hoAbwesenheit": 0,
    "hoBereitsGearbeitet": {
        hours: 0,
        minutes: 0
    },
    "arbeitszeitProTag": "07:06",
    "sidebarLocked": false
}
export const getStorageValue = (storageKey: StorageKey): unknown => {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : defaultValues[storageKey];
}

export const setStorageValue = (storageKey: StorageKey, value: unknown): void => {
    localStorage.setItem(storageKey, JSON.stringify(value));
}
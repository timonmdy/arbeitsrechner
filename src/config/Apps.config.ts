export const appsConfig: {
    title: string;
    description: string;
    link: string;
    subText?: string;
    buttonText?: string;
}[] = [{
    title: "Tageszeit-Rechner",
    description: "Berechne deine restliche oder zusätzliche Arbeitszeit für den aktuellen Tag. Diese App hilft dir, deine geleisteten Stunden zu verfolgen und zu verwalten.",
    link: "/day",
    subText: "Berechne deine Tageszeit"
}, {
    title: "Wochenzeit-Rechner",
    description: "Berechne deine geleistete Arbeitszeit für die aktuelle Woche. Diese App bietet eine Übersicht über deine wöchentlichen Arbeitsstunden und hilft dir, deine Zeit effizient zu planen.",
    link: "/week",
    subText: "Berechne deine wöchentl. Arbeitszeit"
}, {
    title: "HomeOffice-Rechner",
    description: "Übersicht der HomeOffice-Tage mit Kalendar-Funktionalität, um deine HomeOffice-Tage für den Monat zu planen. Außerdem umfasst diese App einen Restzeitrechner, der dir anzeigt, wie viele HomeOffice-Stunden du noch für den Monat übrig hast.",
    link: "/homeoffice",
    subText: "Berechne deine HomeOffice-Tage"
}]
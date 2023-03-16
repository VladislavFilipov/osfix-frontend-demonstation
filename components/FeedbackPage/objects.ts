import { IListFilter } from "Types/listFilters";
import { INormalizedItem } from "Types/normalized";

export const feedbackRoutes = [
    { name: "Активные", path: "", exact: false, statusFilter: null },
    { name: "Завершенные", path: "completed", exact: true, statusFilter: "completed" },
];

export const normalizedDiscStatuses: INormalizedItem[] = [
    { label: "Ожидание ответа", value: "waiting" },
    { label: "В процессе", value: "in-progress" },
    { label: "Завершенные", value: "completed" },
    { label: "Срочно", value: "urgent" },
    { label: "Тестирование", value: "testing" },
];

export const FEEDBACK_BASE_CLASS = "fdb";

export const feedbackListFilters: IListFilter[] = [
    {
        name: "По статусам",
        type: "list",
        field: "status",
        accord: normalizedDiscStatuses,
        variants: [],
    },
];

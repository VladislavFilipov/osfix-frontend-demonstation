import { INormalizedItem } from "Types/normalized";

export interface IListFilter {
    name: string;
    type: "list" | "date";
    field: string;
    subField?: string;
    accord?: INormalizedItem[];
    variants: INormalizedItem[];
}

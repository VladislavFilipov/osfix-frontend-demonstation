import { useState, useMemo } from "react";

export function useSearchAndFilters<Type extends { searchStr?: string; date?: any }>(
    incomeItems: Type[],
    filters: any,
): [Type[], any, any] {
    const [activeFilters, setActiveFilters] = useState(filters);
    const [searchStr, setSearchStr] = useState("");

    const applyFiltering = (incomeItems: Type[]): Type[] => {
        if (!incomeItems || (!activeFilters && typeof searchStr !== "string")) return;

        let filtered = [...incomeItems];

        // apply search
        if (typeof searchStr === "string" && filtered[0]?.searchStr) {
            if (searchStr !== "") {
                filtered = filtered.filter((item) =>
                    item.searchStr.toLowerCase().includes(searchStr.toLowerCase()),
                );
            }
        }

        // apply filters
        if (activeFilters && activeFilters.length !== 0) {
            activeFilters.forEach((filter) => {
                if (filter.type === "list") {
                    if (!filter.subField) {
                        filtered = filtered.filter((item) =>
                            filter.variants.includes(item[filter.field]),
                        );
                    } else {
                        filtered = filtered.filter((item) => {
                            const fieldValue = item[filter.field];
                            return (
                                fieldValue &&
                                filter.variants.includes(item[filter.field][filter.subField])
                            );
                        });
                    }
                } else if (filter.type === "date" && filter.range && filtered[0].date) {
                    filtered = filtered.filter((item) => {
                        const date = new Date(Date.parse(item.date));
                        return date >= filter.range.from && date <= filter.range.to;
                    });
                }
            });
        }

        return filtered;
    };

    const filteredList = useMemo(() => applyFiltering(incomeItems), [
        incomeItems,
        activeFilters,
        searchStr,
    ]);

    return [filteredList, setActiveFilters, setSearchStr];
}

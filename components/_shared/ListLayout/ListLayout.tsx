import { useEffect, useState, ReactNode } from "react";

import ListFilters from "Components/New/ListFilters/ListFilters";
import Loading from "Components/New/Loading/Loading";
import SearchBar from "Components/New/SearchBar/SearchBar";

import { useSearchAndFilters } from "Utils/hooks/useSearchAndFilters";

import "./ListLayout.scss";

interface IListLayoutProps<Type> {
    baseClass: string;
    list: Type[];
    filters: any;
    renderListItem: (item: Type, index?: number) => ReactNode;
    renderActionButtons: (options?: {
        // list: Type[];
        filteredList: Type[];
        [key: string]: any;
    }) => ReactNode;
    actionButtonsOptions?: { [key: string]: any };
    withSearch: boolean;
    searchPlaceholder?: string;
    emptyText?: string;
}

function ListLayout<Type>({
    baseClass,
    list,
    filters,
    renderListItem,
    renderActionButtons,
    actionButtonsOptions,
    withSearch,
    searchPlaceholder,
    emptyText,
}: IListLayoutProps<Type>) {
    const [filteredList, setActiveFilters, setSearchStr] = useSearchAndFilters<Type>(list, filters);

    if (!filteredList) return <Loading />;
    return (
        <div className={`list ${baseClass}-list`}>
            <div className={`list__actions-wrap`}>
                {withSearch && (
                    <SearchBar
                        applySearch={(search) => setSearchStr(search)}
                        placeholder={searchPlaceholder ?? "Поиск..."}
                    />
                )}
                {renderActionButtons && (
                    <div className={`list__btns`}>
                        {renderActionButtons({ filteredList, ...actionButtonsOptions })}
                    </div>
                )}
                {filters && (
                    <ListFilters
                        list={list}
                        filtersList={filters}
                        applyFilters={(filters) => setActiveFilters(filters)}
                    />
                )}
            </div>
            <div className={`list__items`}>
                {filteredList.length > 0 ? (
                    filteredList.map(renderListItem)
                ) : (
                    <div className={`list__empty-text`}>{emptyText ?? "Список пуст"}</div>
                )}
            </div>
        </div>
    );
}

export default ListLayout;

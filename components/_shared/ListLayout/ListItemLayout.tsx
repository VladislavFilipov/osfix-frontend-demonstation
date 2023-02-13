import { PropsWithChildren, HTMLAttributes } from "react";

import { usePickedItem } from "Utils/hooks/usePicked";

import "./ListLayout.scss";

interface IListItemLayoutProps<Type> {
    baseClass: string;
    item: Type;
    isPicked: boolean;
    onClick?: (e) => any;
}

export default function ListItemLayout<Type extends { id: number }>({
    baseClass,
    item,
    isPicked,
    children,
    onClick,
    ...props
}: PropsWithChildren<IListItemLayoutProps<Type>> & HTMLAttributes<HTMLDivElement>) {
    usePickedItem(isPicked, `#${baseClass}_${item.id}`);
    return (
        <div
            className={`list-item ${baseClass}-item ${isPicked ? "picked" : ""}`}
            id={`${baseClass}_${item.id}`}
            onClick={(e) => {
                const target = e.target;
                if (target.closest(".no-propagation") || target.closest(".btn-comp")) return;

                if (onClick) onClick(e);
            }}
            {...props}
        >
            <div className="list-item__container">{children}</div>
        </div>
    );
}

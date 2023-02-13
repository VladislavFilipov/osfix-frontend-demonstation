import { FC } from "react";

import "./StatusLabel.scss";

interface IStatusLabelProps {
    className?: string;
    status?: string | number;
    text: string;
    type: "success" | "warning" | "error";
}

const StatusLabel: FC<IStatusLabelProps> = ({ className, status, text, type }) => {
    return (
        <div className={`status-label status-label_${type} ${className ?? ""}`}>
            {status && <span className="status-label__status">{status}</span>}
            <span className="status-label__text">{text}</span>
        </div>
    );
};

export default StatusLabel;

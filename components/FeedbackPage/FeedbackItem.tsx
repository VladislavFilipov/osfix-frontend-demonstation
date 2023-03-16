import { FC, useEffect } from "react";

import { useHistory } from "react-router-dom";

import ButtonLoad from "Components/New/Button/ButtonLoad";
import WindowConfirm from "Components/New/WindowConfirm/WindowConfirm";
import ListItemLayout from "Components/_shared/ListLayout/ListItemLayout";

import { feedbackApi as API } from "Store/api/feedbackApi";

import { formatDateStringWithTime } from "Utils/functions";
import useCatchApiErrors from "Utils/hooks/useCatchApiErrors";
import { useWindowFuncs } from "Utils/hooks/useWindowConfirm";

import { FEEDBACK_BASE_CLASS, normalizedDiscStatuses } from "./objects";

import FormSelectInline from "../FormSelect/FormSelectInline";

import { IErrorResponse } from "Types/errors";
import { IDiscussionWithSearch } from "Types/feedback";

interface IFeedbackItemProps {
    fdb: IDiscussionWithSearch;
    isPicked: boolean;
    changeStatus: (discussion: IDiscussionWithSearch) => void;
    deleteItem: (discussion: IDiscussionWithSearch) => void;
}

const FeedbackItem: FC<IFeedbackItemProps> = ({ fdb, isPicked, changeStatus, deleteItem }) => {
    const history = useHistory();

    return (
        <ListItemLayout
            item={fdb}
            baseClass={FEEDBACK_BASE_CLASS}
            isPicked={isPicked}
            onClick={() => {
                history.push(`/feedback-new/discussion/${fdb.id}`);
            }}
        >
            <div className="list-item__body">
                <div className="list-item__status no-propagation">
                    <div className="list-item-label">Статус</div>
                    <FormSelectInline
                        className="list-item__status-select"
                        classVariant={"list-item__status-select_" + fdb.status}
                        value={fdb.status}
                        onChange={(value: string) => changeStatus({ ...fdb, status: value })}
                        selectFrom={normalizedDiscStatuses}
                    />
                </div>
                <div className="list-item__time">
                    <div className="list-item-label">Дата/время</div>
                    <div>{formatDateStringWithTime(fdb.date)}</div>
                </div>
                <div className="list-item__author">
                    <div className="list-item-label">Автор</div>
                    <div>{fdb.author}</div>
                </div>
                <div className="list-item__subject">
                    <div className="list-item-label">Тема</div>
                    <div>{fdb.subject}</div>
                </div>

                <ButtonLoad text="Удалить" style="danger" onClick={() => deleteItem(fdb)} />
            </div>
        </ListItemLayout>
    );
};

export default FeedbackItem;

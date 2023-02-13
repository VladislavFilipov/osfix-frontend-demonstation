import { useState } from "react";

import Button from "Components/New/Button/Button";
import ListLayout from "Components/_shared/ListLayout";

import { feedbackApi as API } from "Store/api/feedbackApi";

import useCatchApiErrors from "Utils/hooks/useCatchApiErrors";
import { usePicked } from "Utils/hooks/usePicked";
import { useWindowFuncs } from "Utils/hooks/useWindowConfirm";

import FeedbackItem from "./FeedbackItem";
import NewDisc from "./Forms/NewDiscussion";
import { feedbackListFilters, FEEDBACK_BASE_CLASS } from "./objects";

import ModalWindow from "../ModalWindow/ModalWindow";

import { IDiscussion, IDiscussionWithSearch } from "Types/feedback.types";

const FeedbackList = ({ feedback, updateList }) => {
    const [showConfirm] = useWindowFuncs("confirm");
    const pickedId = usePicked(feedback);

    const [modal, setModal] = useState({
        show: false,
        data: null,
    });

    const [editDiscussion, editResult] = API.useEditDiscussionMutation();
    const [deleteDiscussion, deleteResult] = API.useDeleteDiscussionMutation();
    useCatchApiErrors(deleteResult, editResult);

    const changeStatus = async (discussion: IDiscussionWithSearch) => {
        await editDiscussion(discussion);
    };

    const deleteItem = async (discussion: IDiscussionWithSearch) => {
        if (!(await showConfirm("Удалить обсуждение?", "danger"))) return;
        await deleteDiscussion(discussion.id);
    };

    return (
        <>
            <ListLayout<IDiscussion>
                baseClass={FEEDBACK_BASE_CLASS}
                list={feedback}
                withSearch
                filters={feedbackListFilters}
                renderActionButtons={({ text }) => (
                    <>
                        <Button
                            text={text}
                            style="ok"
                            onClick={() => setModal({ show: true, data: null })}
                        />
                    </>
                )}
                actionButtonsOptions={{ text: "Новое обсуждение" }}
                renderListItem={(fdb) => (
                    <FeedbackItem
                        key={fdb.id}
                        fdb={fdb}
                        isPicked={pickedId === fdb.id}
                        changeStatus={changeStatus}
                        deleteItem={deleteItem}
                    />
                )}
            />

            {modal.show && (
                <ModalWindow
                    close={() => {
                        setModal({ show: false, data: null });
                    }}
                    title={"Новое обсуждение"}
                >
                    <NewDisc
                        onCreate={() => {
                            setModal({ show: false, data: null });
                            updateList();
                        }}
                    />
                </ModalWindow>
            )}
        </>
    );
};

export default FeedbackList;

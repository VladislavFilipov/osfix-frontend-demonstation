import { FC, useEffect, useState } from "react";

import Button from "Components/New/Button/Button";
import { scrollToBottom } from "Components/New/DiscussionPage/functions";
import StatusLabel from "Components/_shared/StatusLabel/StatusLabel";

import { feedbackApi as API } from "Store/api/feedbackApi";

import { formatDateStringWithTime } from "Utils/functions";
import useCatchApiErrors from "Utils/hooks/useCatchApiErrors";
import useUserContext from "Utils/hooks/useUserContext";
import { useWindowFuncs } from "Utils/hooks/useWindowConfirm";

import "./DiscussionPage.scss";

import InputText from "../InputText/InputText";

import { IErrorResponse } from "Types/errors";

const chatListWrapClassName = "disc-chat__list-wrap";
const DiscussionChat: FC<{ discId: number }> = ({ discId }) => {
    const [showConfirm] = useWindowFuncs("confirm");
    const userContext = useUserContext();
    const [newMessage, setNewMessage] = useState("");

    const { data: discMessages, isLoading, isFetching, error } = API.useGetDiscussionMessagesQuery(
        discId,
        {
            pollingInterval: 30000,
        },
    );
    useEffect(() => {
        if (!isFetching) scrollToBottom("." + chatListWrapClassName);
    }, [isFetching]);

    const [addMessage] = API.useAddMessageMutation();
    const [deleteMessage, deleteResult] = API.useDeleteMessageMutation();
    useCatchApiErrors(deleteResult);

    const addNewMessage = async () => {
        if (newMessage) {
            addMessage({
                text: newMessage,
                author: userContext.userData.username,
                date: Date.now(),
                discussionId: discId,
            });
            setNewMessage("");
        }
    };

    const removeMessage = async (id: number) => {
        if (!(await showConfirm("Удалить сообщение?", "danger"))) return;

        deleteMessage(id);
    };

    return (
        <div className="disc-chat">
            <div className="disc-chat__title">Чат</div>
            {error ? (
                <StatusLabel
                    status={(error as IErrorResponse).status}
                    text={(error as IErrorResponse).statusText}
                    type="error"
                />
            ) : (
                <div className={chatListWrapClassName}>
                    {!isLoading && (
                        <div className="disc-chat__list">
                            {discMessages?.map((msg) => (
                                <div
                                    className={`disc-msg ${
                                        userContext.userData.username === msg.author
                                            ? "disc-msg_cur-user"
                                            : ""
                                    }`}
                                >
                                    <div className="disc-msg__author">{msg.author}</div>
                                    <div className="disc-msg__time">
                                        {formatDateStringWithTime(msg.date)}
                                    </div>
                                    <div className="disc-msg__text">{msg.text}</div>
                                    {userContext.userData.username === msg.author && (
                                        <div
                                            className="disc-msg__close"
                                            title="Удалить сообщение"
                                            onClick={() => removeMessage(msg.id)}
                                        >
                                            <div>+</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="disc-chat__input">
                <InputText
                    value={newMessage}
                    onChange={(value) => setNewMessage(value)}
                    onKeyPress={({ key }) => {
                        if (key !== "Enter") return;
                        addNewMessage();
                    }}
                />

                <Button text="Отправить" style="ok" onClick={addNewMessage} />
            </div>
        </div>
    );
};

export default DiscussionChat;

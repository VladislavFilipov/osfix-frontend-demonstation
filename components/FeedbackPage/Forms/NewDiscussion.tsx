import { FC, useState } from "react";

import ButtonLoad from "Components/New/Button/ButtonLoad";
import duscussionYupSchema from "Components/New/DiscussionPage/duscussionYupSchema";
import { FEEDBACK_BASE_CLASS } from "Components/New/FeedbackPage/objects";
import InputText from "Components/New/InputText/InputText";
import Loading from "Components/New/Loading/Loading";
import FormLayout, { FormBtns, FormField } from "Components/_shared/FormLayout";

import { feedbackApi as API } from "Store/api/feedbackApi";

import useCatchApiErrors from "Utils/hooks/useCatchApiErrors";
import useCatchApiSuccess from "Utils/hooks/useCatchApiSuccess";
import useFormValidation from "Utils/hooks/useFormValidation";
import useUserContext from "Utils/hooks/useUserContext";

import "./DiscussionForm.scss";

import { IErrorResponse } from "Types/errors";
import { IDiscussionNoId } from "Types/feedback.types";

interface INewDiscussionProps {
    onCreate: () => void;
}

const NewDiscussion: FC<INewDiscussionProps> = ({ onCreate }) => {
    const userContext = useUserContext();

    const [addDiscussion, addResult] = API.useAddDiscussionMutation();
    useCatchApiSuccess(addResult.isSuccess, onCreate);

    const [initialData] = useState<IDiscussionNoId>({
        subject: "",
        text: "",
        date: Date.now(),
        status: "in-progress",
        author: userContext.userData.username,
        isRead: false,
    });
    const {
        formData,
        formErrors,
        handleChange,
        validateData,
        fieldNames,
    } = useFormValidation<IDiscussionNoId>(initialData, duscussionYupSchema);

    const handleFormSubmit = async () => {
        if (!(await validateData())) return;

        addDiscussion(formData);
    };

    if (!formData) return <Loading />;

    return (
        <FormLayout
            baseClass={FEEDBACK_BASE_CLASS}
            onSubmit={handleFormSubmit}
            actionError={addResult.error as IErrorResponse}
        >
            <FormField>
                <InputText
                    label={"Тема"}
                    value={formData.subject}
                    onChange={(value: string) => handleChange(fieldNames.subject, value)}
                    error={formErrors.subject}
                />
            </FormField>
            <FormField>
                <InputText
                    label={"Содержание"}
                    value={formData.text}
                    onChange={(value: string) => handleChange(fieldNames.text, value)}
                    error={formErrors.text}
                    isTextarea
                />
            </FormField>

            <FormBtns>
                <ButtonLoad text="Создать" style="confirm" role="submit" />
            </FormBtns>
        </FormLayout>
    );
};

export default NewDiscussion;

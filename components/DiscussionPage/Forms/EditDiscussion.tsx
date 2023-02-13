import { FC } from "react";

import Button from "Components/New/Button/Button";
import LinkButton from "Components/New/Button/LinkButton";
import duscussionYupSchema from "Components/New/DiscussionPage/duscussionYupSchema";
import { DISCUSSION_BASE_CLASS } from "Components/New/DiscussionPage/objects";
import InputText from "Components/New/InputText/InputText";
import Loading from "Components/New/Loading/Loading";
import FormLayout, { FormBtns, FormField } from "Components/_shared/FormLayout";

import { feedbackApi as API } from "Store/api/feedbackApi";

import { formatDateStringWithTime } from "Utils/functions";
import useCatchApiSuccess from "Utils/hooks/useCatchApiSuccess";
import useFormValidation from "Utils/hooks/useFormValidation";
import useUserContext from "Utils/hooks/useUserContext";
import { useWindowFuncs } from "Utils/hooks/useWindowConfirm";

import "./DiscussionForm.scss";

import { IErrorResponse } from "Types/errors";
import { IDiscussion } from "Types/feedback.types";

const EditDiscussion: FC<{ discId: number }> = ({ discId }) => {
    const userContext = useUserContext();
    const [showAlert] = useWindowFuncs("alert");

    const { data, isLoading, isFetching, error } = API.useGetDiscussionQuery(discId);
    const [editDiscussion, editResult] = API.useEditDiscussionMutation();

    const onEditSuccess = async () => {
        await showAlert("Успешно отредактированно!", "success");
        editResult.reset();
    };
    useCatchApiSuccess(editResult.isSuccess, onEditSuccess);

    const {
        formData,
        formErrors,
        handleChange,
        validateData,
        fieldNames,
    } = useFormValidation<IDiscussion>(data, duscussionYupSchema);

    const handleFormSubmit = async () => {
        editResult.reset();
        if (!(await validateData())) return;
        editDiscussion(formData);
    };

    if (isLoading || isFetching) return <Loading />;

    const loadingError = error as IErrorResponse;
    const actionError = editResult.error as IErrorResponse;
    const isEditButtonVisible = formData && formData.author === userContext.userData.username;

    return (
        <FormLayout
            baseClass={DISCUSSION_BASE_CLASS}
            loadingError={loadingError}
            actionError={actionError}
            onSubmit={handleFormSubmit}
        >
            {formData && (
                <>
                    <div className="form__info">
                        <div className="form__info-item">
                            <div>Автор:</div>
                            <div>{formData.author}</div>
                        </div>
                        <div className="form__info-item">
                            <div>Дата:</div>
                            <div>{formatDateStringWithTime(formData.date)}</div>
                        </div>
                    </div>

                    <FormField>
                        {formData.author === userContext.userData.username ? (
                            <InputText
                                label={"Тема"}
                                value={formData.subject}
                                onChange={(value: string) =>
                                    handleChange(fieldNames.subject, value)
                                }
                                error={formErrors.subject}
                            />
                        ) : (
                            <>
                                <div className="text-title">Тема:</div>
                                <div>{formData.subject}</div>
                            </>
                        )}
                    </FormField>

                    <FormField name="text">
                        {formData.author === userContext.userData.username ? (
                            <InputText
                                label={"Содержание"}
                                value={formData.text}
                                onChange={(value: string) => handleChange(fieldNames.text, value)}
                                isTextarea
                                error={formErrors.text}
                            />
                        ) : (
                            <>
                                <div className="text-title">Содержание:</div>
                                <div>{formData.text}</div>
                            </>
                        )}
                    </FormField>
                </>
            )}
            <FormBtns>
                <LinkButton text="Назад к списку" path="/feedback-new/" />
                {isEditButtonVisible && (
                    <Button text="Редактировать" style="confirm" role="submit" />
                )}
            </FormBtns>
        </FormLayout>
    );
};

export default EditDiscussion;

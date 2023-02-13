import { FC, FormEvent, HTMLAttributes, PropsWithChildren } from "react";

import StatusLabel from "Components/_shared/StatusLabel/StatusLabel";

import "./FormLayout.scss";

import { IErrorResponse } from "Types/errors";

interface IFormLayoutProps {
    baseClass: string;
    loadingError?: IErrorResponse;
    actionError?: IErrorResponse;
    onSubmit: (e?: FormEvent<HTMLFormElement>) => void;
}

const FormLayout: FC<PropsWithChildren<IFormLayoutProps> & HTMLAttributes<HTMLFormElement>> = ({
    baseClass,
    loadingError,
    actionError,
    children,
    onSubmit,
    ...props
}) => {
    return (
        <form
            className={`form ${baseClass}-form`}
            onSubmit={(e) => {
                e.preventDefault();

                onSubmit(e);
            }}
            {...props}
        >
            {loadingError && (
                <StatusLabel
                    className="form-error_loading"
                    status={loadingError.status}
                    text={loadingError.statusText}
                    type="error"
                />
            )}

            {children}

            {actionError && (
                <StatusLabel
                    className="form-error_action"
                    status={String(actionError.status)}
                    text={actionError.statusText}
                    type="error"
                />
            )}
        </form>
    );
};

export default FormLayout;

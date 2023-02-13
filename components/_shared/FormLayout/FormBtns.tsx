import { FC, PropsWithChildren } from "react";

const FormBtns: FC<PropsWithChildren> = ({ children }) => {
    return <div className={`form__btns`}>{children}</div>;
};

export default FormBtns;

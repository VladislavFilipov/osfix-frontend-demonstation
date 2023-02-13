import { FC, PropsWithChildren } from "react";

interface IFormFieldProps {
    name?: string;
}

const FormField: FC<PropsWithChildren<IFormFieldProps>> = ({ name, children }) => {
    return <div className={`form__field ${name ? `form__field_${name}` : ""}`}>{children}</div>;
};

export default FormField;

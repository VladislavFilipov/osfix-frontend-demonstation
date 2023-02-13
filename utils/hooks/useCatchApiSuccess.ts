import { useEffect } from "react";

const useCatchApiSuccess = (isSuccess: boolean, callback: () => void | any) => {
    useEffect(() => {
        if (isSuccess) {
            callback();
        }
    }, [isSuccess]);
};

export default useCatchApiSuccess;

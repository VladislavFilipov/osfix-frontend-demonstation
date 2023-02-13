import { useEffect } from "react";

import { useWindowFuncs } from "Utils/hooks/useWindowConfirm";

import { IErrorResponse } from "Types/errors";

interface IApiResult {
    error: IErrorResponse;
    isError: boolean;
    reset: () => void;
}

const useCatchApiErrors = (...apiResults: any) => {
    const [showAlert] = useWindowFuncs("alert");

    const catchError = async (result: IApiResult) => {
        await showAlert((result.error as IErrorResponse).statusText, "danger");
        result.reset();
    };
    useEffect(() => {
        console.log("useCatchApiErrors useEffect", apiResults);

        for (const result of apiResults as IApiResult[]) {
            if (result.isError) catchError(result);
        }
    }, apiResults);
};

export default useCatchApiErrors;

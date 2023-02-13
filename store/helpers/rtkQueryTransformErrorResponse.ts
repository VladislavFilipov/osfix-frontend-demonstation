import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/dist/query";
import { IErrorResponse } from "Types/errors";

export default function transformError(
  response: FetchBaseQueryError,
  meta: FetchBaseQueryMeta | undefined,
  arg: any,
  customText?: string
): IErrorResponse {
  console.error("RTK Query Error", response, meta, arg);

  if (meta && meta.response) {
    return {
      status: meta.response.status,
      statusText: customText ?? meta.response.statusText,
    };
  }

  if (typeof response.status === "number") {
    return {
      status: response.status,
      statusText: customText ?? "Request failed!",
      data: response.data,
    };
  } else {
    return {
      status: 404,
      statusText: customText ?? response.status,
      data: response.data,
    };
  }
}

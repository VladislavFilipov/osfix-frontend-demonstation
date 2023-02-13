import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { sortArrayOfObjectsNew } from "Components/MainPage/GeneralPage/MainPageWorkspace/CallsWindow.jsx";

import transformError from "Store/helpers/rtkQueryTransformErrorResponse";

import {
    IDiscussion,
    IDiscussionMessage,
    IDiscussionMessageNoId,
    IDiscussionNoId,
    IDiscussionWithSearch,
} from "Types/feedback.types";

const FEEDBACK_TAG = "Feedback";
const MESSAGES_TAG = "Messages";
export const feedbackApi = createApi({
    reducerPath: "feedback",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.API_URL}/api/${process.env.API_VERSION}/feedback`,
        prepareHeaders: (headers) => {
            headers.set("Authorization", `Bearer_${localStorage.getItem("accessToken")}`);
            return headers;
        },
    }),
    tagTypes: [FEEDBACK_TAG, MESSAGES_TAG],
    endpoints: (build) => ({
        getFeedback: build.query<IDiscussionWithSearch[], { isAdmin: boolean; username: string }>({
            query: () => "/",
            transformResponse: (res: IDiscussion[], meta, arg) => {
                if (!arg.isAdmin) {
                    res = res.filter((fdb) => fdb.author === arg.username);
                }

                return sortArrayOfObjectsNew(
                    res.map((fdb) => ({
                        ...fdb,
                        date: Date.parse(String(fdb.date)),
                        searchStr: fdb.subject,
                    })),
                    "id",
                    "number",
                    "dec",
                );
            },
            transformErrorResponse: (...args) =>
                transformError(...args, "Не удалось загрузить список обсуждений."),
            providesTags: (result, error) =>
                error
                    ? []
                    : [
                          ...result?.map(({ id }) => ({ type: FEEDBACK_TAG, id } as const)),
                          { type: FEEDBACK_TAG, id: "LIST" },
                      ],
        }),
        getDiscussion: build.query<IDiscussionWithSearch, number>({
            query: (id) => `/${id}`,
            transformResponse: (res: IDiscussion, meta, arg) => {
                return {
                    ...res,
                    date: Date.parse(String(res.date)),
                    searchStr: res.subject,
                };
            },
            transformErrorResponse: (...args) =>
                transformError(...args, "Не удалось загрузить обсуждениe."),
            providesTags: (result, error, id) => [{ type: FEEDBACK_TAG, id }],
        }),
        addDiscussion: build.mutation<IDiscussion, IDiscussionNoId>({
            query: (discussion) => ({
                url: `/`,
                method: "POST",
                body: getFixedBody(discussion),
            }),
            transformErrorResponse: (...args) =>
                transformError(...args, "Не удалось создать обсуждениe."),
            invalidatesTags: [{ type: FEEDBACK_TAG, id: "LIST" }],
        }),
        editDiscussion: build.mutation<IDiscussion, IDiscussionWithSearch>({
            query: (discussion) => ({
                url: `/${discussion.id}`,
                method: "PUT",
                body: getFixedBody(discussion),
            }),
            transformErrorResponse: (...args) =>
                transformError(...args, "Не удалось изменить обсуждениe."),
            invalidatesTags: (result, error, { id }) => [{ type: FEEDBACK_TAG, id }],
        }),
        deleteDiscussion: build.mutation<IDiscussion, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            transformErrorResponse: (...args) =>
                transformError(...args, "Не удалось удалить обсуждениe."),
            invalidatesTags: (result, error, id) => (error ? [] : [{ type: FEEDBACK_TAG, id }]),
        }),
        getDiscussionMessages: build.query<IDiscussionMessage[], number>({
            query: (discussionId) => `/discussion/${discussionId}`,
            transformResponse: (res: IDiscussionMessage[]) =>
                sortArrayOfObjectsNew(
                    res.map((message) => ({
                        ...message,
                        date: Date.parse(String(message.date)),
                    })),
                    "date",
                    "number",
                ),
            transformErrorResponse: (...args) =>
                transformError(...args, "Не удалось загрузить список сообщений."),
            providesTags: [MESSAGES_TAG],
        }),
        addMessage: build.mutation<
            IDiscussionMessage,
            IDiscussionMessageNoId & { discussionId: number }
        >({
            query: (message) => ({
                url: `/message/`,
                method: "POST",
                body: getFixedBody(message),
            }),
            transformErrorResponse: (...args) =>
                transformError(...args, "Не удалось добавить сообщение."),
            invalidatesTags: [MESSAGES_TAG],
        }),
        deleteMessage: build.mutation<IDiscussion, number>({
            query: (id) => ({
                url: `/message/${id}`,
                method: "DELETE",
            }),
            transformErrorResponse: (...args) =>
                transformError(...args, "Не удалось удалить сообщение."),
            invalidatesTags: [MESSAGES_TAG],
        }),
    }),
});

type TypeWithFailedData = { [key: string]: any; date: number };
const getFixedBody = (discussion: TypeWithFailedData): TypeWithFailedData => ({
    ...discussion,
    date: Number(discussion.date) / 1000,
});

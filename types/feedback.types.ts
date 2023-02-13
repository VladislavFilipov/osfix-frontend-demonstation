export interface IDiscussion {
    id: number;
    date: number;
    author: string;
    status: string;
    subject: string;
    text: string;
    isRead: boolean;
}

export interface IDiscussionWithSearch extends IDiscussion {
    searchStr: string;
}

export type IDiscussionNoId = Omit<IDiscussion, "id">;

export interface IDiscussionMessage {
    id: number;
    date: number;
    author: string;
    text: string;
}

export type IDiscussionMessageNoId = Omit<IDiscussionMessage, "id">;
// {
//     discussionId: number;
// }

import * as yup from "yup";

import { IDiscussion } from "Types/feedback";

const duscussionYupSchema: yup.SchemaOf<IDiscussion> = yup
    .object({
        id: yup.number().optional(),
        subject: yup.string().required(),
        text: yup.string().required(),
        date: yup.number().defined(),
        author: yup.string().defined(),
        status: yup.string().defined(),
        isRead: yup.boolean().defined(),
    })
    .required();

export default duscussionYupSchema;

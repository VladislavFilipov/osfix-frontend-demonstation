import { FC } from "react";

import { RouteComponentProps } from "react-router-dom";

import DiscussionChat from "Components/New/DiscussionPage/DiscussionChat";
import EditDiscussion from "Components/New/DiscussionPage/Forms/EditDiscussion";
import { DISCUSSION_BASE_CLASS } from "Components/New/DiscussionPage/objects";
import PageLayout from "Components/_shared/PageLayout";

import "./DiscussionPage.scss";

const DiscussionPage: FC<RouteComponentProps<{ discId: string }>> = ({ match }) => {
    const title = "Просмотр обсуждения";
    return (
        <PageLayout baseClass={DISCUSSION_BASE_CLASS} documentTitle={title} title={title}>
            <EditDiscussion discId={+match.params.discId} />
            <DiscussionChat discId={+match.params.discId} />
        </PageLayout>
    );
};

export default DiscussionPage;

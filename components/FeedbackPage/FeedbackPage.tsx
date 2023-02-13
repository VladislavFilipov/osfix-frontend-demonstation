import { useContext } from "react";

import { Switch, useRouteMatch, Link, NavLink } from "react-router-dom";

import { feedbackRoutes, FEEDBACK_BASE_CLASS } from "Components/New/FeedbackPage/objects";
import PrivateRoute from "Components/PrivateRoute/PrivateRoute";
import PageLayout from "Components/_shared/PageLayout/PageLayout";

import { feedbackApi as API } from "Store/api/feedbackApi";

import { ROLE_ADMIN } from "Utils/const.js";

import FeedbackList from "./FeedbackList";
import "./FeedbackPage.scss";

import UserContext from "../../../App";

import { IErrorResponse } from "Types/errors";

const FeedbackPage = () => {
    const userContext = useContext(UserContext);

    const { data: feedback, error, isLoading } = API.useGetFeedbackQuery({
        isAdmin: userContext.userHasAccess([ROLE_ADMIN]),
        username: userContext.userData.username,
    });

    const filterFeedbackByPage = (route) => {
        if (!route.statusFilter) {
            return feedback.filter((fdb) => fdb.status !== "completed");
        } else {
            return feedback.filter((fdb) => fdb.status === route.statusFilter);
        }
    };

    let { path } = useRouteMatch();

    return (
        <PageLayout
            baseClass={FEEDBACK_BASE_CLASS}
            documentTitle="Обратная связь"
            title="Обратная связь"
            navigation={
                <>
                    {feedbackRoutes.map((route) => (
                        <NavLink
                            key={route.name}
                            to={`${path}${route.path}`}
                            exact
                            activeClassName="selected"
                            className="page__nav-item"
                        >
                            {route.name}
                        </NavLink>
                    ))}
                </>
            }
            error={error && ({ message: (error as IErrorResponse)?.statusText } as Error)}
            isLoading={isLoading}
        >
            <Switch>
                {feedbackRoutes.map((route) => (
                    <PrivateRoute
                        exact
                        key={route.name}
                        path={`${path}${route.path}`}
                        component={FeedbackList}
                        feedback={feedback && filterFeedbackByPage(route)}
                        updateList={() => {}}
                    />
                ))}
            </Switch>
        </PageLayout>
    );
};

export default FeedbackPage;

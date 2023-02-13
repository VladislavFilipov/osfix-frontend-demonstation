import { PropsWithChildren, FC, ReactNode } from "react";

import { Helmet } from "react-helmet";

import Loading from "Components/New/Loading/Loading";
import StatusLabel from "Components/_shared/StatusLabel/StatusLabel";

import "./PageLayout.scss";

interface IPageLayoutProps {
    baseClass: string;
    documentTitle: string;
    title: ReactNode;
    navigation?: ReactNode;
    error?: Error | undefined;
    isLoading?: boolean;
}

const PageLayout: FC<PropsWithChildren<IPageLayoutProps>> = ({
    baseClass,
    documentTitle,
    title,
    navigation,
    children,
    error,
    isLoading,
}) => {
    return (
        <div className={`page ${baseClass}-page ${navigation ? "with-nav" : ""}`}>
            <Helmet>
                <title>{documentTitle}</title>
            </Helmet>
            <div className="page__title">{title}</div>
            {error ? (
                <StatusLabel type="error" text={error.message} />
            ) : isLoading ? (
                <Loading />
            ) : (
                <>
                    {navigation && <div className="page__nav">{navigation}</div>}
                    <div className="page__content">{children}</div>
                </>
            )}
        </div>
    );
};

export default PageLayout;

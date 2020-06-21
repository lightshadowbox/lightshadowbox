import React, { useEffect, useState, Suspense, lazy } from 'react';
import NoInternet from 'app/components/noInternet';
import LoadingComponent from 'app/components/loadingComponent';

export default (ImportComponent) => {
    const LazyComp = lazy(ImportComponent);

    const AsyncComponent = (props) => {
        const getStatusOnline = window.navigator.onLine;
        const [isOnline, setOnline] = useState(getStatusOnline);

        useEffect(() => {
            setOnline(getStatusOnline);
        }, [getStatusOnline]);

        if (!isOnline) {
            return <NoInternet />;
        }

        return (
            <Suspense fallback={<LoadingComponent />}>
                <LazyComp {...props} />
            </Suspense>
        );
    };

    return AsyncComponent;
};

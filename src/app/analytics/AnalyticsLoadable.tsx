import {lazyLoad} from "../../utils/loadable";

export const AnalyticsPage = lazyLoad(
    () => import('./analytics'),
    module => module.AnalyticsPage,
);

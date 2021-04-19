import {lazyLoad} from "../../utils/loadable";

export const DashboardPage = lazyLoad(
    () => import('./dashboard'),
    module => module.DashboardPage,
);

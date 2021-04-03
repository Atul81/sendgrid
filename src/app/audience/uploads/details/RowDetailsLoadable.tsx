import {lazyLoad} from "../../../../utils/loadable";

export const RowDetailsPage = lazyLoad(
    () => import('./rowDetails'),
    module => module.RowDetailsPage,
);

import {lazyLoad} from "../../../utils/loadable";

export const CustomEventsPage = lazyLoad(
    () => import('./customEvents'),
    module => module.CustomEventsPage,
);

import {lazyLoad} from "../../../utils/loadable";

export const GroupsPage = lazyLoad(
    () => import('./groups'),
    module => module.GroupsPage,
);

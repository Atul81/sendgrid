import {lazyLoad} from "../../../utils/loadable";

export const UsersPage = lazyLoad(
    () => import('./users'),
    module => module.UsersPage,
);

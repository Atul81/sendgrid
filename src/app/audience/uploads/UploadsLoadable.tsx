import {lazyLoad} from "../../../utils/loadable";

export const UploadsPage = lazyLoad(
    () => import('./uploads'),
    module => module.UploadsPage,
);

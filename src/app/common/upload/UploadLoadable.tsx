import {lazyLoad} from "../../../utils/loadable";

export const UploadPage = lazyLoad(
    () => import('./upload'),
    module => module.UploadPage,
);

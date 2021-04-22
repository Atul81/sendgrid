import {lazyLoad} from "../../../utils/loadable";

export const ExportPage = lazyLoad(
    () => import('./exports'),
    module => module.ExportPage,
);

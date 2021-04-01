import {lazyLoad} from "../../../utils/loadable";

export const SegmentsPage = lazyLoad(
    () => import('./segments'),
    module => module.SegmentsPage,
);

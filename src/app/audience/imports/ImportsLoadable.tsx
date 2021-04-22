import {lazyLoad} from "../../../utils/loadable";

export const ImportsPage = lazyLoad(
    () => import('./imports'),
    module => module.ImportsPage,
);

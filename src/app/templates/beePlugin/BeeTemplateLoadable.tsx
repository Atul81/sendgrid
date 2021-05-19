import {lazyLoad} from "../../../utils/loadable";

export const BeeTemplatePage = lazyLoad(
    () => import('./beeTemplatePage'),
    module => module.BeeTemplatePage,
);

import {lazyLoad} from "../../utils/loadable";

export const TemplatesPage = lazyLoad(
    () => import('./templates'),
    module => module.TemplatesPage,
);

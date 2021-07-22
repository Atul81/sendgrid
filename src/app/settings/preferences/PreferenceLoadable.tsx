import {lazyLoad} from "../../../utils/loadable";

export const PreferencePage = lazyLoad(
    () => import('./preferences'),
    module => module.PreferencePage,
);

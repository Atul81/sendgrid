import {lazyLoad} from "../../../utils/loadable";

export const AutomationPage = lazyLoad(
    () => import('./automation'),
    module => module.AutomationPage,
);

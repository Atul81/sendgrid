import {lazyLoad} from "../../../../utils/loadable";

export const AmendAutomationPage = lazyLoad(
    () => import('./amendAutomation'),
    module => module.AmendAutomationPage,
);

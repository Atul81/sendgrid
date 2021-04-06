import {lazyLoad} from "../../../../utils/loadable";

export const AmendSendersPage = lazyLoad(
    () => import('./amendSenders'),
    module => module.AmendSendersPage,
);

import {lazyLoad} from "../../../utils/loadable";

export const SendersPage = lazyLoad(
    () => import('./senders'),
    module => module.SendersPage,
);

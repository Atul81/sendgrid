import {lazyLoad} from "../../../utils/loadable";

export const DedicatedIpsPage = lazyLoad(
    () => import('./dedicatedIps'),
    module => module.DedicatedIpsPage,
);

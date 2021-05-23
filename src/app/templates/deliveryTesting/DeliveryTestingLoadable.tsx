import {lazyLoad} from "../../../utils/loadable";

export const DeliveryTestingPage = lazyLoad(
    () => import('./deliveryTesting'),
    module => module.DeliveryTestingPage,
);

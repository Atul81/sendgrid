import {lazyLoad} from "../../../utils/loadable";

export const CampaignPage = lazyLoad(
    () => import('./campaigns'),
    module => module.CampaignPage,
);

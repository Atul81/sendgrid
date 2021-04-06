import {lazyLoad} from "../../../../utils/loadable";

export const AmendCampaignsPage = lazyLoad(
    () => import('./amendCampaigns'),
    module => module.AmendCampaignsPage,
);

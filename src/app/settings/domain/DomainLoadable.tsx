import {lazyLoad} from "../../../utils/loadable";

export const DomainSettingsPage = lazyLoad(
    () => import('./domain'),
    module => module.DomainSettingsPage,
);

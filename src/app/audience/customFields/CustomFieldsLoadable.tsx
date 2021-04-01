import {lazyLoad} from "../../../utils/loadable";

export const CustomFieldsPage = lazyLoad(
    () => import('./customFields'),
    module => module.CustomFieldsPage,
);

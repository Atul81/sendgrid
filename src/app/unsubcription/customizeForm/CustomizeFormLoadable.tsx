import {lazyLoad} from "../../../utils/loadable";

export const CustomizeFormPage = lazyLoad(
    () => import('./customizeForm'),
    module => module.CustomizeFormPage,
);

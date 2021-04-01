import {lazyLoad} from "../../../../utils/loadable";

export const EditContactPage = lazyLoad(
    () => import('./editContact'),
    module => module.EditContactPage,
);
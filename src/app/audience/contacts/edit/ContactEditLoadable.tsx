import {lazyLoad} from "../../../../utils/loadable";

export const ContactEditPage = lazyLoad(
    () => import('./editContact'),
    module => module.EditContactPage,
);
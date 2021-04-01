import {lazyLoad} from "../../../utils/loadable";

export const ContactsPage = lazyLoad(
    () => import('./contacts'),
    module => module.ContactsPage,
);

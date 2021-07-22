import {lazyLoad} from "../../../../utils/loadable";

export const DnsRecordsPage = lazyLoad(
    () => import('./dnsRecords'),
    module => module.DnsRecordsPage,
);

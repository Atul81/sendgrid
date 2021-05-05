import urlConfig from "../../../config/urlConfig.json";

export const getAllSegments = () => {
    const allSegmentsRequest = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig.segments, allSegmentsRequest);
}
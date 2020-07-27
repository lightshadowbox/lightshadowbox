import HttpClient from 'app/services/httpClient';

const getPcustomeTokenListApi = () => {
    const httpClient = new HttpClient('https://api.incognito.org');
    return httpClient.get('/ptoken/list');
};

export { getPcustomeTokenListApi };

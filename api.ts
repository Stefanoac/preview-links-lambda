import axios from 'axios';
import https from 'https';

const api = axios.create({
    httpsAgent: new https.Agent({  
        rejectUnauthorized: false,
    }),
    timeout: 5000,
});

export async function get(url:string) {
    const response = await api.get(url);
    return response.data;
}
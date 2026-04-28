const http = require('http');

const get = (url) => {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: data ? JSON.parse(data) : data });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
};

const test = async () => {
    const baseURL = 'http://localhost:3000/api';
    const routes = ['/institute', '/departments', '/events', '/participants'];

    for (const route of routes) {
        try {
            console.log(`--- Testing ${route} ---`);
            const res = await get(baseURL + route);
            console.log(`Status: ${res.status}`);
            if (res.status === 200) {
                const keys = Object.keys(res.data);
                console.log(`Keys: ${keys.join(', ')}`);
                if (res.data[keys[0]]) {
                    console.log(`Count: ${Array.isArray(res.data[keys[0]]) ? res.data[keys[0]].length : '1'}`);
                }
            } else {
                console.log(`Error Data:`, res.data);
            }
        } catch (err) {
            console.error(`Request Failed:`, err.message);
        }
    }
};

test();

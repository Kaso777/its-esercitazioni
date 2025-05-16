
async function apiRequest(url, method = 'GET', data =null, headers ={}) {
    const options= {
        method,
        // 1.
        headers:{
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (method !== 'GET' && data) {
        options.body = JSON.stringify(data);
    }

    if (method === 'GET' && data) {
        const params = new URLSearchParams(data).toString();
        url += '?' + params;
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

host = 'http://localhost:3000';

const tasto = document.querySelector('#tasto');

tasto.addEventListener('click', () => {
    username = document.querySelector("#username").value;
    body = {username: username};

    apiRequest (host+"/user/query", 'GET', body )
        .then(data => console.log(data))
        .catch(error => console.error(error));
});

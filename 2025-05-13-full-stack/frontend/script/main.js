
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


const tasto = document.querySelector('#tasto');
const lista = document.querySelector('#comment-list');


tasto.addEventListener('click', async() => {
    const nome = document.querySelector('#name').value;
    const messaggio = document.querySelector('#messaggio').value;
    try {
        // Usa 'await' per ottenere il risultato della richiesta
        const result = await apiRequest('http://localhost:3000/about', 'POST', {
            nome: nome,
            messaggio: messaggio
        });
        
        // Stampa il risultato, che ora è il valore restituito dalla chiamata API
        console.log('Pippo:', result);

        // Aggiungi il commento alla lista dei commenti sulla pagina
        const commentoDiv = document.createElement('div');
        commentoDiv.classList.add('commento');
        commentoDiv.innerHTML = `<strong>${result.nome}</strong>: ${result.messaggio}`;
        lista.appendChild(commentoDiv);

        // Pulisci i campi del modulo
        document.querySelector('#name').value = '';
        document.querySelector('#messaggio').value = '';
    } catch (error) {
        console.error('Errore durante l\'invio del commento:', error);
    }
})
        
/*
apiRequest('http://localhost:3000', 'POST', {
    username:'john_doe',
    password: 'secret123'
})
    .then(data => console.log('Login success:', data))
    .catch(error => console.error(error));
*/

/*
Funzione asincrona
Ci servirà ogni volta che vogliamo fare una chiamata.
Ogni volta che ci sarà un tastino che deve fare un invio un qualcosa che deve fare una chiamata ad una API ci penserà questa funzione.

1.
Gli headers mi danno indicazioni sulla comunicazioni http/https.
Sono una sorta di intestazioni che mi danno info sulla pagina 
*/
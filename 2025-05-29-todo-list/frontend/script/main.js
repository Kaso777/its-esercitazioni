// #noteListDiv    // Per mostrare le note
// #messageForm    // Il form per l'input
// #message        // L'input text


// Funzione che gestisce tutte le chiamate API al backend
// È asincrona perché deve attendere le risposte dal server
async function apiRequest(url, method = 'GET', data = null) {
    // Prepara le opzioni base per la richiesta fetch
    const options = {
        method,  // Metodo HTTP (GET, POST, etc)
        headers: { 'Content-Type': 'application/json' },  // Dice al server che mandiamo JSON
    };

    // Se è una richiesta NON GET (es. POST) e abbiamo dei dati
    // Li convertiamo in JSON e li mettiamo nel body
    if (method !== 'GET' && data) {
        options.body = JSON.stringify(data);
    }

    // Se è una richiesta GET e abbiamo dei dati
    // Li aggiungiamo all'URL come parametri query (?chiave=valore)
    if (method === 'GET' && data) {
        const params = new URLSearchParams(data).toString();
        url += '?' + params;
    }

    try {
        // Fa la richiesta al server e attende la risposta
        const response = await fetch(url, options);
        // Se la risposta non è ok (status 200-299), lancia un errore
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        // Converte la risposta in JSON e la restituisce
        return await response.json();
    } catch (error) {
        // Se c'è un errore, lo mostra in console e lo propaga
        console.error('API Request Error:', error);
        throw error;
    }
}

// Ottiene riferimenti agli elementi HTML che ci servono
const noteListDiv = document.querySelector('#noteListDiv');    // Div dove mostriamo le note
const messageForm = document.querySelector('#messageForm');    // Form per inserire nuove note
const messageInput = document.querySelector('#message');       // Campo di input per il testo

// Funzione che mostra le note nella pagina
function renderNotes(notes) {
    // Svuota il div delle note
    noteListDiv.innerHTML = '';
    
    // Se non ci sono note, mostra un messaggio
    if (notes.length === 0) {
        noteListDiv.textContent = 'Nessuna nota presente.';
        return;
    }

    // Per ogni nota, crea un paragrafo e lo aggiunge alla pagina
    notes.forEach(note => {
        const p = document.createElement('p');
        p.textContent = note.note;
        noteListDiv.appendChild(p);
    });
}

// Funzione che carica le note dal server
async function loadNotes() {
    try {
        // Chiede le note al server
        const notes = await apiRequest('http://localhost:3000/api/notes');
        // Le mostra nella pagina
        renderNotes(notes);
    } catch {
        // Se c'è un errore, mostra un messaggio
        noteListDiv.textContent = 'Errore nel caricamento delle note.';
    }
}

// Gestisce l'invio del form per aggiungere una nuova nota
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();  // Previene il refresh della pagina
    const text = messageInput.value.trim();  // Prende il testo e rimuove spazi
    if (!text) return;  // Se il testo è vuoto, non fa nulla

    try {
        // Invia la nuova nota al server
        await apiRequest('http://localhost:3000/api/notes/add', 'POST', { note: text });
        messageInput.value = '';  // Svuota il campo input
        loadNotes();  // Ricarica la lista delle note
    } catch {
        // Se c'è un errore, mostra un alert
        alert('Errore nell\'invio della nota.');
    }
});

// Quando la pagina si carica, mostra subito le note
loadNotes();
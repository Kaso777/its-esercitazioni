// #noteListDiv    // Per mostrare le note
// #messageForm    // Il form per l'input
// #message        // L'input text

const listSelector = document.querySelector('#listSelector');
async function loadLists() {
    try {
        const lists = await apiRequest('http://localhost:3000/api/lists');
        listSelector.innerHTML = ''; // Svuota il menu a tendina

        lists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.id;
            option.textContent = list.name;
            listSelector.appendChild(option);
        });

        // Dopo aver caricato le liste, carica anche le note della prima lista
        loadNotes();
    } catch (err) {
        alert('Errore nel caricamento delle liste.');
    }
}



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

     // Crea un ul per contenere tutti i li
    const ul = document.createElement('ul');

    // Per ogni nota, crea un paragrafo e lo aggiunge alla pagina
    notes.forEach(note => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = note.status;  // Imposta lo stato della checkbox


        

// Crea il bottone di modifica
        const editButton = document.createElement('button');
        editButton.textContent = '✏️';
        editButton.className = 'edit-btn';
        
        editButton.addEventListener('click', async () => {
            const newText = prompt('Modifica la nota:', note.note);
            if (newText && newText !== note.note) {
                try {
                    await apiRequest(
                        `http://localhost:3000/api/notes/${note.id}`,
                        'PUT',
                        { 
                            note: newText,
                            status: note.status 
                        }
                    );
                    loadNotes();
                } catch {
                    alert('Errore nella modifica della nota.');
                }
            }
        });

        // Crea il bottone di cancellazione singola
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';
        deleteButton.className = 'delete-btn';
        
        // Listener per la cancellazione singola
        deleteButton.addEventListener('click', async () => {
            try {
                await apiRequest(
                    `http://localhost:3000/api/notes/${note.id}`,
                    'DELETE'
                );
                loadNotes(); // Ricarica la lista
            } catch {
                alert('Errore nella cancellazione della nota.');
            }
        });


        // Listener per aggiornare lo stato della nota nel DB 
        checkbox.addEventListener('change', async () => {
            try {
                await apiRequest(
                    `http://localhost:3000/api/notes/${note.id}`,
                    'PUT',
                    { status: checkbox.checked }
                );
            } catch {
                alert('Errore nell\'aggiornamento dello stato.');
                checkbox.checked = !checkbox.checked; // Ripristina stato se errore
            }
        });

        const label = document.createElement('span'); // Crea un'etichetta per la checkbox
        label.textContent = note.note;  // Imposta il testo della nota

        li.appendChild(checkbox);  // Aggiunge la checkbox al div
        li.appendChild(label);      // Aggiunge l'etichetta al div
        li.appendChild(editButton); // Aggiunge il pulsante di modifica ad ogni nota
        li.appendChild(deleteButton); // Aggiunge il pulsante di eliminazione ad ogni nota

        noteListDiv.appendChild(li);
    });
}

// Script per eliminare le note completate
const deleteCompletedButton = document.querySelector('#deleteCompleted'); // Seleziona il pulsante con id "deleteCompleted" dalla pagina HTML
deleteCompletedButton.addEventListener('click', async () => {
    // Aggiunge un event listener al pulsante che ascolta il click
    // La funzione collegata è asincrona perché utilizza `await`
    try {
        // Chiede al server di eliminare le note completate
        await apiRequest('http://localhost:3000/api/notes/completed', 'DELETE');
        // Esegue una richiesta HTTP DELETE verso l'endpoint /api/notes/completed
        loadNotes();  // Se la richiesta va a buon fine ricarica la lista delle note
    } catch {
        // Se qualcosa va storto durante la richiesta (es. errore di rete, risposta 500...)
        alert('Errore nell\'eliminazione delle note completate.');
        // Mostra un messaggio d’errore all’utente
    }
});

// Script per aggiungere una nuova lista
const newListForm = document.querySelector('#newListForm');
const newListNameInput = document.querySelector('#newListName');

newListForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = newListNameInput.value.trim();
    if (!name) return;

    try {
        await apiRequest('http://localhost:3000/api/lists/add', 'POST', { name });
        newListNameInput.value = '';
        loadLists(); // Ricarica il menu a tendina con le nuove liste
    } catch {
        alert('Errore nella creazione della lista.');
    }
});




// Funzione che carica le note dal server
async function loadNotes() {
    try {
        const selectedListId = listSelector.value;
        const notes = await apiRequest('http://localhost:3000/api/notes', 'GET', { list_id: selectedListId });

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
        await apiRequest('http://localhost:3000/api/notes/add', 'POST', { note: text, list_id: listSelector.value });

        messageInput.value = '';  // Svuota il campo input
        loadNotes();  // Ricarica la lista delle note
    } catch {
        // Se c'è un errore, mostra un alert
        alert('Errore nell\'invio della nota.');
    }
});

// Quando la pagina si carica, mostra subito le note
loadLists();
// Carica le liste all'avvio
listSelector.addEventListener('change', () => {
    loadNotes();
});

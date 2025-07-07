// Seleziono dal DOM l'elemento <select> con id 'listSelector', che contiene le liste disponibili
const listSelector = document.querySelector('#listSelector');

// Funzione asincrona per caricare tutte le liste dal backend
async function loadLists() {
    try {
        // Faccio una richiesta GET all'endpoint '/api/lists' per ottenere tutte le liste
        const lists = await apiRequest('http://localhost:3000/api/lists');

        // Svuoto il menu a tendina per evitare duplicati quando ricarico le liste
        listSelector.innerHTML = '';

        // Per ogni lista ricevuta dal server, creo un'opzione nel select
        lists.forEach(list => {
            const option = document.createElement('option'); // Creo un elemento <option>
            option.value = list.id;                          // Imposto il valore con l'id della lista
            option.textContent = list.name;                  // Imposto il testo visibile con il nome della lista
            listSelector.appendChild(option);                // Aggiungo l'opzione al select
        });

        // Se non ci sono liste, disabilito i pulsanti di modifica e cancellazione
        if (lists.length === 0) {
            editListBtn.disabled = true;
            deleteListBtn.disabled = true;
        } else {
            // Altrimenti li abilito
            editListBtn.disabled = false;
            deleteListBtn.disabled = false;
        }

        // Dopo aver caricato le liste, carico le note relative alla lista selezionata (default la prima)
        loadNotes();
    } catch (err) {
        // Se c'è un errore (es. server non raggiungibile), mostro un alert all'utente
        alert('Errore nel caricamento delle liste.');
    }
}

// Seleziono i pulsanti per modificare e cancellare la lista dalla pagina HTML tramite id
const editListBtn = document.getElementById('editListBtn');
const deleteListBtn = document.getElementById('deleteListBtn');

// Seleziono i popup e i relativi elementi per la modifica della lista
const editListPopup = document.getElementById('editListPopup');
const editListInput = document.getElementById('editListInput');
const confirmEditListBtn = document.getElementById('confirmEditList');
const cancelEditListBtn = document.getElementById('cancelEditList');

// Seleziono i popup e i relativi elementi per la cancellazione della lista
const deleteListPopup = document.getElementById('deleteListPopup');
const confirmDeleteListBtn = document.getElementById('confirmDeleteList');
const cancelDeleteListBtn = document.getElementById('cancelDeleteList');

// Aggiungo un listener al pulsante "Modifica lista" per aprire il popup di modifica
editListBtn.addEventListener('click', () => {
    // Prendo l'opzione selezionata nel menu a tendina
    const selectedOption = listSelector.options[listSelector.selectedIndex];
    if (!selectedOption) return alert('Seleziona prima una lista'); // Se nessuna lista selezionata, avviso l'utente

    // Inserisco il nome della lista nel campo di input del popup
    editListInput.value = selectedOption.textContent;
    // Mostro il popup impostando il display a 'flex' (visibile)
    editListPopup.style.display = 'flex';
});

// Listener per il pulsante di conferma della modifica lista
confirmEditListBtn.addEventListener('click', async () => {
    // Prendo il nuovo nome inserito dall'utente e tolgo spazi inutili
    const newName = editListInput.value.trim();
    // Prendo l'id della lista selezionata
    const listId = listSelector.value;

    if (!newName) return alert('Inserisci un nome valido'); // Se il nome è vuoto, avviso

    try {
        // Invio la richiesta PUT per modificare la lista sul server
        await apiRequest(`http://localhost:3000/api/lists/${listId}`, 'PUT', { name: newName });
        editListPopup.style.display = 'none'; // Nascondo il popup di modifica
        await loadLists();                     // Ricarico le liste per aggiornare la vista
        listSelector.value = listId;           // Reseleziono la lista modificata nel menu
        loadNotes();                           // Ricarico le note relative alla lista modificata
    } catch {
        alert('Errore nella modifica della lista'); // Se qualcosa va storto, avviso
    }
});

// Listener per il pulsante annulla modifica lista, chiude il popup
cancelEditListBtn.addEventListener('click', () => {
    editListPopup.style.display = 'none';
});

// Listener per il pulsante "Cancella lista" che apre il popup di conferma cancellazione
deleteListBtn.addEventListener('click', () => {
    if (!listSelector.value) return alert('Seleziona prima una lista'); // Controllo che ci sia una lista selezionata
    deleteListPopup.style.display = 'flex'; // Mostro il popup di conferma cancellazione
});

// Listener per il pulsante di conferma cancellazione lista
confirmDeleteListBtn.addEventListener('click', async () => {
    const listId = listSelector.value; // Prendo l'id della lista selezionata

    try {
        // Mando la richiesta DELETE al server per eliminare la lista
        await apiRequest(`http://localhost:3000/api/lists/${listId}`, 'DELETE');
        deleteListPopup.style.display = 'none'; // Nascondo il popup
        await loadLists();                       // Ricarico le liste per aggiornare la vista
        loadNotes();                            // Ricarico le note (che ora saranno vuote o relative a un'altra lista)
    } catch {
        alert('Errore nella cancellazione della lista'); // Avviso in caso di errore
    }
});

// Listener per il pulsante annulla cancellazione, chiude il popup
cancelDeleteListBtn.addEventListener('click', () => {
    deleteListPopup.style.display = 'none';
});


// Funzione generica per fare chiamate API asincrone al server
async function apiRequest(url, method = 'GET', data = null) {
    // Preparo le opzioni per fetch: metodo e headers (content-type JSON)
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    // Se è una richiesta con metodo diverso da GET e ho dati, li converto in JSON e li metto nel body
    if (method !== 'GET' && data) {
        options.body = JSON.stringify(data);
    }

    // Se è una GET e ho dati, li aggiungo all'URL come parametri query
    if (method === 'GET' && data) {
        const params = new URLSearchParams(data).toString();
        url += '?' + params;
    }

    try {
        // Eseguo la richiesta fetch e aspetto la risposta
        const response = await fetch(url, options);
        // Se la risposta non è OK (200-299), lancio un errore per il catch
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        // Ritorno la risposta convertita in JSON
        return await response.json();
    } catch (error) {
        // In caso di errore lo loggo e lo rilancio all'esterno
        console.error('API Request Error:', error);
        throw error;
    }
}

// Seleziono gli elementi dal DOM per la gestione delle note
const noteListDiv = document.querySelector('#noteListDiv');    // Div dove mostro le note
const messageForm = document.querySelector('#messageForm');    // Form per aggiungere nuove note
const messageInput = document.querySelector('#message');       // Input testuale per la nuova nota

// Funzione che mostra le note in pagina, accetta un array di note
function renderNotes(notes) {
    // Svuoto il div delle note per aggiornarlo con le nuove
    noteListDiv.innerHTML = '';

    // Se non ci sono note, mostro un messaggio all'utente
    if (notes.length === 0) {
        noteListDiv.textContent = 'Nessuna nota presente.';
        return;
    }

    // Per ogni nota creo un <li> che contiene checkbox, testo e bottoni azione
    notes.forEach(note => {
        const li = document.createElement('li');
        li.style.display = 'flex';          // Flex per layout orizzontale
        li.style.alignItems = 'center';     // Allineo verticalmente al centro

        // Checkbox per indicare stato completato o no
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = note.status;     // Checkbox selezionata se lo status è true
        checkbox.className = 'note-checkbox';

        // Span che contiene il testo della nota
        const label = document.createElement('span');
        label.className = 'note-text';
        label.textContent = note.note;

        // Div contenente i bottoni azione (modifica, elimina)
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'note-actions';

        // Bottone modifica con icona matita
        const editButton = document.createElement('button');
        editButton.textContent = '✏️';
        editButton.className = 'edit-btn';

        // Bottone elimina con icona cestino
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';
        deleteButton.className = 'delete-btn';

        // Aggiungo i bottoni al div azioni
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        // Aggiungo checkbox, testo e azioni al <li>
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(actionsDiv);

        // Ora gestisco gli eventi legati a modifica, cancellazione e cambio stato

        // Riferimenti al popup di modifica e suoi elementi
        const editPopup = document.getElementById('editPopup');
        const editInput = document.getElementById('editInput');
        const editConfirm = document.getElementById('editConfirm');
        const editCancel = document.getElementById('editCancel');

        // Quando clicco il bottone modifica apro il popup e precompilo il testo
        editButton.addEventListener('click', () => {
            editInput.value = note.note;         // Inserisco testo attuale della nota
            editPopup.style.display = 'flex';    // Mostro popup

            // Alla conferma modifica aggiorno la nota via API
            editConfirm.onclick = async () => {
                const newText = editInput.value.trim(); // Prendo testo nuovo
                // Se il testo è cambiato e non è vuoto, faccio la modifica
                if (newText && newText !== note.note) {
                    try {
                        await apiRequest(
                            `http://localhost:3000/api/notes/${note.id}`,
                            'PUT',
                            { note: newText, status: note.status } // Mando testo aggiornato e stato attuale
                        );
                        editPopup.style.display = 'none'; // Chiudo popup
                        loadNotes();                      // Ricarico le note aggiornate
                    } catch {
                        alert('Errore nella modifica della nota.');
                    }
                } else {
                    // Se testo vuoto o non cambiato, chiudo popup senza fare nulla
                    editPopup.style.display = 'none';
                }
            };

            // Se clicco annulla chiudo popup senza modifiche
            editCancel.onclick = () => {
                editPopup.style.display = 'none';
            };
        });

        // Riferimenti popup conferma cancellazione nota
        const confirmPopup = document.getElementById('confirmPopup');
        const confirmYes = document.getElementById('confirmYes');
        const confirmNo = document.getElementById('confirmNo');

        // Al click su elimina apro il popup di conferma cancellazione
        deleteButton.addEventListener('click', () => {
            confirmPopup.style.display = 'flex';

            // Se confermo la cancellazione chiamo API DELETE per eliminare la nota
            confirmYes.onclick = async () => {
                confirmPopup.style.display = 'none'; // Chiudo popup
                try {
                    await apiRequest(`http://localhost:3000/api/notes/${note.id}`, 'DELETE');
                    loadNotes(); // Ricarico le note dopo eliminazione
                } catch {
                    alert('Errore nella cancellazione della nota.');
                }
            };

            // Se annullo chiudo il popup senza azioni
            confirmNo.onclick = () => {
                confirmPopup.style.display = 'none';
            };
        });

        // Listener per cambio stato checkbox completato
        checkbox.addEventListener('change', async () => {
            try {
                // Mando aggiornamento stato completato/not completato via API PUT
                await apiRequest(
                    `http://localhost:3000/api/notes/${note.id}`,
                    'PUT',
                    { status: checkbox.checked }
                );
            } catch {
                // Se errore, avviso e riporto checkbox al valore precedente
                alert('Errore nell\'aggiornamento dello stato.');
                checkbox.checked = !checkbox.checked;
            }
        });

        // Aggiungo la singola nota (li) al div contenitore delle note
        noteListDiv.appendChild(li);
    });
}

// Seleziono il pulsante per eliminare tutte le note completate
const deleteCompletedButton = document.querySelector('#deleteCompleted');

// Al click sul pulsante chiamo la API per eliminare tutte le note con status completato
deleteCompletedButton.addEventListener('click', async () => {
    try {
        await apiRequest('http://localhost:3000/api/notes/completed', 'DELETE');
        loadNotes(); // Ricarico la lista delle note dopo eliminazione
    } catch {
        alert('Errore nell\'eliminazione delle note completate.');
    }
});

// Seleziono il form per creare una nuova lista e il campo input per il nome
const newListForm = document.querySelector('#newListForm');
const newListNameInput = document.querySelector('#newListName');

// Al submit del form di creazione nuova lista
newListForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevengo refresh pagina

    const name = newListNameInput.value.trim(); // Prendo il nome inserito e tolgo spazi

    if (!name) return; // Se il nome è vuoto, non faccio nulla

    try {
        // Chiamo API per creare una nuova lista passando il nome
        await apiRequest('http://localhost:3000/api/lists/add', 'POST', { name });
        newListNameInput.value = ''; // Svuoto il campo input
        loadLists(); // Ricarico le liste per mostrare la nuova
    } catch {
        alert('Errore nella creazione della lista.');
    }
});

// Funzione per caricare le note di una lista specifica
async function loadNotes() {
    const selectedListId = listSelector.value; // Prendo l'id della lista selezionata

    // Se nessuna lista selezionata, mostro messaggio e esco
    if (!selectedListId) {
        noteListDiv.textContent = 'Nessuna lista disponibile da cui caricare le note.';
        return;
    }

    try {
        // Chiamo API per ottenere tutte le note relative alla lista selezionata
        const notes = await apiRequest('http://localhost:3000/api/notes', 'GET', { list_id: selectedListId });
        renderNotes(notes); // Passo le note alla funzione che le renderizza
    } catch {
        noteListDiv.textContent = 'Errore nel caricamento delle note.';
    }
}

// Al submit del form per aggiungere una nuova nota
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevengo il refresh pagina

    const text = messageInput.value.trim(); // Prendo il testo inserito e tolgo spazi

    if (!text) return; // Se testo vuoto, non faccio nulla

    try {
        // Invio al server la nuova nota associata alla lista selezionata
        await apiRequest('http://localhost:3000/api/notes/add', 'POST', { note: text, list_id: listSelector.value });

        messageInput.value = ''; // Svuoto il campo input dopo invio
        loadNotes();             // Ricarico le note per mostrare la nuova
    } catch {
        alert('Errore nell\'invio della nota.');
    }
});

// Quando la pagina si carica, carico subito le liste e le note relative
loadLists();

// Ogni volta che cambio lista nel menu a tendina, carico le note della lista selezionata
listSelector.addEventListener('change', () => {
    loadNotes();
});

// Imposto le textarea affinché si adattino in altezza al contenuto digitato
document.querySelectorAll('textarea').forEach(el => {
    el.addEventListener('input', () => {
        el.style.height = 'auto';              // Resetto altezza
        el.style.height = el.scrollHeight + 'px'; // Imposto altezza pari all'altezza del contenuto
    });
});

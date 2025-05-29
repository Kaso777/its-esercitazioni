async function apiRequest(url, method = 'GET', data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
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
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

const noteListDiv = document.querySelector('#noteListDiv');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');

// Funzione per mostrare le note
function renderNotes(notes) {
  noteListDiv.innerHTML = '';
  if (notes.length === 0) {
    noteListDiv.textContent = 'Nessuna nota presente.';
    return;
  }
  notes.forEach(note => {
    const p = document.createElement('p');
    p.textContent = note.note;
    noteListDiv.appendChild(p);
  });
}

// Funzione per caricare e mostrare la lista note
async function loadNotes() {
  try {
    const notes = await apiRequest('http://localhost:3000/api/notes');
    renderNotes(notes);
  } catch {
    noteListDiv.textContent = 'Errore nel caricamento delle note.';
  }
}

// Gestione submit del form per inserire una nuova nota
messageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  try {
    await apiRequest('http://localhost:3000/api/notes/add', 'POST', { note: text });
    messageInput.value = '';
    loadNotes();  // ricarica la lista dopo l’inserimento
  } catch {
    alert('Errore nell\'invio della nota.');
  }
});

// Carica subito la lista note all’avvio della pagina
loadNotes();

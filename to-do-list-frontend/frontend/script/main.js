document.addEventListener("DOMContentLoaded", function () {
    const API_BASE = "http://127.0.0.1:8000/api";

    // === Elementi DOM ===
    const listSelector = document.getElementById("listSelector");
    const newListForm = document.getElementById("newListForm");
    const newListName = document.getElementById("newListName");
    const editListBtn = document.getElementById("editListBtn");
    const deleteListBtn = document.getElementById("deleteListBtn");
    const archiveListBtn = document.getElementById("archiveListBtn");
    const showArchivedListsBtn = document.getElementById("showArchivedListsBtn");

    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("message");
    const noteListDiv = document.getElementById("noteListDiv");
    const deleteCompleted = document.getElementById("deleteCompleted");

    const editListPopup = document.getElementById("editListPopup");
    const editListInput = document.getElementById("editListInput");
    const confirmEditList = document.getElementById("confirmEditList");
    const cancelEditList = document.getElementById("cancelEditList");

    const deleteListPopup = document.getElementById("deleteListPopup");
    const confirmDeleteList = document.getElementById("confirmDeleteList");
    const cancelDeleteList = document.getElementById("cancelDeleteList");

    const confirmPopup = document.getElementById("confirmPopup");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    const editPopup = document.getElementById("editPopup");
    const editInput = document.getElementById("editInput");
    const editConfirm = document.getElementById("editConfirm");
    const editCancel = document.getElementById("editCancel");

    // Sezione per liste archiviate
    const archivedSection = document.createElement("section");
    archivedSection.id = "archived-section";
    archivedSection.innerHTML = `<h2>Liste archiviate</h2><ul id="archivedLists"></ul>`;
    archivedSection.style.display = "none";
    document.querySelector("main").appendChild(archivedSection);

    const archivedListsUl = document.getElementById("archivedLists");

    // === Variabili di stato ===
    let currentLists = [];
    let currentListId = null;
    let noteToDelete = null;
    let noteToEdit = null;

    // === Headers comuni per fetch API ===
    function headers() {
        return {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        };
    }

    // === Caricamento liste ===
    function fetchLists() {
        fetch(`${API_BASE}/lists`, { headers: headers() })
            .then(res => res.json())
            .then(data => {
                currentLists = data.data;
                renderListSelector();
                renderNoteList();
            });
    }

    function fetchArchivedLists() {
        fetch(`${API_BASE}/lists/archived`, { headers: headers() })
            .then(res => res.json())
            .then(data => {
                renderArchivedLists(data.data);
            });
    }

    // === Render delle liste nel <select> ===
    function renderListSelector() {
        const previousListId = currentListId;

        listSelector.innerHTML = "";
        currentLists.forEach(list => {
            if (!list.archived) {
                const option = document.createElement("option");
                option.value = list.id;
                option.textContent = list.name;
                listSelector.appendChild(option);
            }
        });

        if (previousListId && currentLists.find(l => l.id == previousListId && !l.archived)) {
            listSelector.value = previousListId;
            currentListId = previousListId;
        } else {
            currentListId = listSelector.value;
        }
    }

    // === Render note della lista selezionata ===
    function renderNoteList() {
        const selected = currentLists.find(l => l.id == currentListId);
        noteListDiv.innerHTML = "";

        if (!selected || !selected.notes) return;

        selected.notes.forEach(note => {
            const li = document.createElement("li");
            li.innerHTML = `
                <input type="checkbox" data-id="${note.id}" ${note.status ? "checked" : ""}>
                <span class="${note.status ? "checked" : ""}">${note.noteText}</span>
                <button data-id="${note.id}" class="edit-note">✏️</button>
                <button data-id="${note.id}" class="delete-note">🗑️</button>
            `;
            noteListDiv.appendChild(li);

            const checkbox = li.querySelector("input[type='checkbox']");
            checkbox.addEventListener("change", () => {
                const action = checkbox.checked ? "check" : "uncheck";
                fetch(`${API_BASE}/notes/${note.id}/${action}`, {
                    method: "PATCH",
                    headers: headers(),
                }).then(fetchLists);
            });

            li.querySelector(".edit-note").addEventListener("click", () => {
                noteToEdit = note;
                editInput.value = note.noteText;
                editPopup.classList.add("show");
            });

            li.querySelector(".delete-note").addEventListener("click", () => {
                noteToDelete = note;
                confirmPopup.classList.add("show");
            });
        });
    }

    function renderArchivedLists(lists) {
        archivedListsUl.innerHTML = "";
        lists.forEach(list => {
            const li = document.createElement("li");
            li.textContent = list.name + " ";
            const unarchiveBtn = document.createElement("button");
            unarchiveBtn.textContent = "📤";
            unarchiveBtn.addEventListener("click", () => {
                fetch(`${API_BASE}/lists/${list.id}/unarchive`, {
                    method: "PATCH",
                    headers: headers(),
                }).then(() => {
                    fetchLists();
                    fetchArchivedLists();
                });
            });
            li.appendChild(unarchiveBtn);
            archivedListsUl.appendChild(li);
        });
    }

    // === Archivio ===
    archiveListBtn.addEventListener("click", () => {
        if (!currentListId) return;
        fetch(`${API_BASE}/lists/${currentListId}/archive`, {
            method: "PATCH",
            headers: headers(),
        }).then(() => {
            fetchLists();
        });
    });

    showArchivedListsBtn.addEventListener("click", () => {
        if (archivedSection.style.display === "none") {
            archivedSection.style.display = "block";
            fetchArchivedLists();
        } else {
            archivedSection.style.display = "none";
        }
    });

    // === Cambio lista selezionata ===
    listSelector.addEventListener("change", () => {
        currentListId = listSelector.value;
        renderNoteList();
    });

    // === Aggiunta nuova lista ===
    newListForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = newListName.value.trim();
        if (!name) return;

        fetch(`${API_BASE}/lists`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ name }),
        }).then(() => {
            newListName.value = "";
            fetchLists();
        });
    });

    // === Modifica lista ===
    editListBtn.addEventListener("click", () => {
        const selected = currentLists.find(l => l.id == currentListId);
        if (!selected) return;
        editListInput.value = selected.name;
        editListPopup.classList.add("show");
    });

    confirmEditList.addEventListener("click", () => {
        const name = editListInput.value.trim();
        if (!name) return;

        fetch(`${API_BASE}/lists/${currentListId}`, {
            method: "PUT",
            headers: headers(),
            body: JSON.stringify({ name }),
        }).then(() => {
            editListPopup.classList.remove("show");
            fetchLists();
        });
    });

    cancelEditList.addEventListener("click", () => {
        editListPopup.classList.remove("show");
    });

    // === Eliminazione lista (conferma popup) ===
    deleteListBtn.addEventListener("click", () => {
        if (!currentListId) return;
        deleteListPopup.classList.add("show");
    });

    confirmDeleteList.addEventListener("click", () => {
        if (!currentListId) return;

        fetch(`${API_BASE}/lists/${currentListId}`, {
            method: "DELETE",
            headers: headers(),
        }).then(() => {
            deleteListPopup.classList.remove("show");
            fetchLists();
        });
    });

    cancelDeleteList.addEventListener("click", () => {
        deleteListPopup.classList.remove("show");
    });

    // === Aggiunta nuova nota ===
    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const note = messageInput.value.trim();
        if (!note || !currentListId) return;

        fetch(`${API_BASE}/notes`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
                note,
                list_id: currentListId,
            }),
        }).then(() => {
            messageInput.value = "";
            fetchLists();
        });
    });

    // === Eliminazione note completate ===
    deleteCompleted.addEventListener("click", () => {
        const selected = currentLists.find(l => l.id == currentListId);
        if (!selected || !selected.notes) return;

        const promises = selected.notes
            .filter(n => n.status)
            .map(n =>
                fetch(`${API_BASE}/notes/${n.id}`, {
                    method: "DELETE",
                    headers: headers(),
                })
            );

        Promise.all(promises).then(fetchLists);
    });

    // === Conferma eliminazione nota ===
    confirmYes.addEventListener("click", () => {
        if (!noteToDelete) return;

        fetch(`${API_BASE}/notes/${noteToDelete.id}`, {
            method: "DELETE",
            headers: headers(),
        }).then(() => {
            confirmPopup.classList.remove("show");
            noteToDelete = null;
            fetchLists();
        });
    });

    confirmNo.addEventListener("click", () => {
        confirmPopup.classList.remove("show");
        noteToDelete = null;
    });

    // === Modifica nota ===
    editConfirm.addEventListener("click", () => {
        if (!noteToEdit) return;

        const note = editInput.value.trim();
        if (!note) return;

        fetch(`${API_BASE}/notes/${noteToEdit.id}`, {
            method: "PUT",
            headers: headers(),
            body: JSON.stringify({ note }),
        }).then(() => {
            editPopup.classList.remove("show");
            noteToEdit = null;
            fetchLists();
        });
    });

    editCancel.addEventListener("click", () => {
        editPopup.classList.remove("show");
        noteToEdit = null;
    });

    // Nascondi popup all'avvio
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("show");
    });

    // === Avvio iniziale ===
    fetchLists();
});

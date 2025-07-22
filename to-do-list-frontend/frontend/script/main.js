document.addEventListener("DOMContentLoaded", function () {
    const API_BASE = "http://localhost/api";

    const listSelector = document.getElementById("listSelector");
    const newListForm = document.getElementById("newListForm");
    const newListName = document.getElementById("newListName");
    const editListBtn = document.getElementById("editListBtn");
    const deleteListBtn = document.getElementById("deleteListBtn");

    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("message");
    const noteListDiv = document.getElementById("noteListDiv");
    const deleteCompleted = document.getElementById("deleteCompleted");

    const editListPopup = document.getElementById("editListPopup");
    const editListInput = document.getElementById("editListInput");
    const confirmEditList = document.getElementById("confirmEditList");
    const cancelEditList = document.getElementById("cancelEditList");

    const confirmPopup = document.getElementById("confirmPopup");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    const editPopup = document.getElementById("editPopup");
    const editInput = document.getElementById("editInput");
    const editConfirm = document.getElementById("editConfirm");
    const editCancel = document.getElementById("editCancel");

    let currentLists = [];
    let currentListId = null;
    let noteToDelete = null;
    let noteToEdit = null;

    function headers() {
        return {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        };
    }

    function fetchLists() {
        fetch(`${API_BASE}/lists`, { headers: headers() })
            .then(res => res.json())
            .then(data => {
                currentLists = data.data;
                renderListSelector();
                renderNoteList();
            });
    }

    function renderListSelector() {
        listSelector.innerHTML = "";
        currentLists.forEach(list => {
            const option = document.createElement("option");
            option.value = list.id;
            option.textContent = list.name;
            listSelector.appendChild(option);
        });

        currentListId = listSelector.value;
    }

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

    listSelector.addEventListener("change", () => {
        currentListId = listSelector.value;
        renderNoteList();
    });

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

    deleteListBtn.addEventListener("click", () => {
        if (!currentListId) return;

        fetch(`${API_BASE}/lists/${currentListId}`, {
            method: "DELETE",
            headers: headers(),
        }).then(() => {
            fetchLists();
        });
    });

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

    // Classe CSS "show" per visualizzare i modali
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("show");
    });

    // Inizializza le liste all'avvio
    fetchLists();
});

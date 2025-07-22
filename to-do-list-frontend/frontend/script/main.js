document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "http://localhost/api";
    let currentListId = null;

    const listSelector = document.getElementById("listSelector");
    const noteListDiv = document.getElementById("noteListDiv");
    const newListForm = document.getElementById("newListForm");
    const newListNameInput = document.getElementById("newListName");
    const deleteListBtn = document.getElementById("deleteListBtn");
    const editListBtn = document.getElementById("editListBtn");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("message");
    const deleteCompletedBtn = document.getElementById("deleteCompleted");

    const deleteListPopup = document.getElementById("deleteListPopup");
    const confirmDeleteList = document.getElementById("confirmDeleteList");
    const cancelDeleteList = document.getElementById("cancelDeleteList");

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

    let noteToDelete = null;
    let noteToEdit = null;

    async function loadLists() {
        const res = await fetch(`${API_BASE}/lists`, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        const data = await res.json();
        listSelector.innerHTML = "";
        data.data.forEach((list) => {
            const option = document.createElement("option");
            option.value = list.id;
            option.textContent = list.name;
            listSelector.appendChild(option);
        });
        if (data.data.length > 0) {
            currentListId = data.data[0].id;
            listSelector.value = currentListId;
            loadNotes(currentListId);
        }
    }

    async function loadNotes(listId) {
        const res = await fetch(`${API_BASE}/lists/${listId}`, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        const data = await res.json();
        noteListDiv.innerHTML = "";
        data.data.notes.forEach((note) => {
            const li = document.createElement("li");
            li.textContent = note.note;
            li.dataset.id = note.id;
            li.className = note.status ? "checked" : "";

            li.addEventListener("click", () => toggleNoteStatus(note.id, !note.status));

            const editBtn = document.createElement("button");
            editBtn.textContent = "✏️";
            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                noteToEdit = note;
                editInput.value = note.note;
                editPopup.style.display = "block";
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑️";
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                noteToDelete = note.id;
                confirmPopup.style.display = "block";
            });

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            noteListDiv.appendChild(li);
        });
    }

    messageForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const note = messageInput.value.trim();
        if (!note || !currentListId) return;

        const res = await fetch(`${API_BASE}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({ note, status: false, list_id: currentListId }),
        });

        if (res.ok) {
            messageInput.value = "";
            loadNotes(currentListId);
        }
    });

    confirmYes.addEventListener("click", async () => {
        if (noteToDelete) {
            await fetch(`${API_BASE}/notes/${noteToDelete}`, {
                method: "DELETE",
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            loadNotes(currentListId);
        }
        confirmPopup.style.display = "none";
    });

    confirmNo.addEventListener("click", () => {
        confirmPopup.style.display = "none";
    });

    editConfirm.addEventListener("click", async () => {
        const newText = editInput.value.trim();
        if (!newText || !noteToEdit) return;

        await fetch(`${API_BASE}/notes/${noteToEdit.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({ note: newText }),
        });
        loadNotes(currentListId);
        editPopup.style.display = "none";
    });

    editCancel.addEventListener("click", () => {
        editPopup.style.display = "none";
    });

    async function toggleNoteStatus(noteId, newStatus) {
        const endpoint = `${API_BASE}/notes/${noteId}/${newStatus ? "check" : "uncheck"}`;
        await fetch(endpoint, {
            method: "PATCH",
            headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        loadNotes(currentListId);
    }

    newListForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = newListNameInput.value.trim();
        if (!name) return;

        const res = await fetch(`${API_BASE}/lists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({ name }),
        });

        if (res.ok) {
            newListNameInput.value = "";
            loadLists();
        }
    });

    listSelector.addEventListener("change", (e) => {
        currentListId = e.target.value;
        loadNotes(currentListId);
    });

    deleteListBtn.addEventListener("click", () => {
        deleteListPopup.style.display = "block";
    });

    cancelDeleteList.addEventListener("click", () => {
        deleteListPopup.style.display = "none";
    });

    confirmDeleteList.addEventListener("click", async () => {
        if (!currentListId) return;
        await fetch(`${API_BASE}/lists/${currentListId}`, {
            method: "DELETE",
            headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        deleteListPopup.style.display = "none";
        loadLists();
    });

    editListBtn.addEventListener("click", () => {
        const selectedOption = listSelector.options[listSelector.selectedIndex];
        if (selectedOption) {
            editListInput.value = selectedOption.textContent;
            editListPopup.style.display = "block";
        }
    });

    cancelEditList.addEventListener("click", () => {
        editListPopup.style.display = "none";
    });

    confirmEditList.addEventListener("click", async () => {
        const newName = editListInput.value.trim();
        if (!newName || !currentListId) return;

        await fetch(`${API_BASE}/lists/${currentListId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({ name: newName }),
        });
        editListPopup.style.display = "none";
        loadLists();
    });

    deleteCompletedBtn.addEventListener("click", async () => {
        const res = await fetch(`${API_BASE}/lists/${currentListId}`, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        const data = await res.json();

        const completedNotes = data.data.notes.filter((note) => note.status);
        await Promise.all(
            completedNotes.map((note) =>
                fetch(`${API_BASE}/notes/${note.id}`, {
                    method: "DELETE",
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                })
            )
        );

        loadNotes(currentListId);
    });

    loadLists();
});

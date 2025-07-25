document.addEventListener("DOMContentLoaded", function () {
	const API_BASE = "http://127.0.0.1:8000/api";

	// === Elementi DOM ===
	const listSelector = document.getElementById("listSelector");
	const noteListDiv = document.getElementById("noteListDiv");
	const messageInput = document.getElementById("message");
	const messageForm = document.getElementById("messageForm");
	const deleteCompletedBtn = document.getElementById("deleteCompleted");

	const newListForm = document.getElementById("newListForm");
	const newListName = document.getElementById("newListName");
	const editListBtn = document.getElementById("editListBtn");
	const deleteListBtn = document.getElementById("deleteListBtn");
	const archiveListBtn = document.getElementById("archiveListBtn");
	const showArchivedListsBtn = document.getElementById("showArchivedListsBtn");

	const deleteListPopup = document.getElementById("deleteListPopup");
	const confirmDeleteList = document.getElementById("confirmDeleteList");
	const cancelDeleteList = document.getElementById("cancelDeleteList");

	const editListPopup = document.getElementById("editListPopup");
	const confirmEditList = document.getElementById("confirmEditList");
	const cancelEditList = document.getElementById("cancelEditList");
	const editListInput = document.getElementById("editListInput");

	const editPopup = document.getElementById("editPopup");
	const editInput = document.getElementById("editInput");
	const editConfirm = document.getElementById("editConfirm");
	const editCancel = document.getElementById("editCancel");

	const confirmPopup = document.getElementById("confirmPopup");
	const confirmYes = document.getElementById("confirmYes");
	const confirmNo = document.getElementById("confirmNo");

	const tagList = document.getElementById("tagList");
	const newTagForm = document.getElementById("newTagForm");
	const newTagName = document.getElementById("newTagName");

	// 🆕 Variabili per il popup di modifica tag
	const editTagPopup = document.getElementById("editTagPopup");
	const editTagInput = document.getElementById("editTagInput");
	const editTagConfirm = document.getElementById("editTagConfirm");
	const editTagCancel = document.getElementById("editTagCancel");

	// Stato applicazione
	let currentListId = null;
	let currentNotes = [];
	let currentEditingNoteId = null;
	let currentDeletingNoteId = null;
	let currentEditingTagId = null;
	let archivedVisible = false;  // se la sezione archiviate è visibile

	// === Fetch e render liste ===
	async function fetchLists() {
		const res = await fetch(`${API_BASE}/lists`);
		const data = await res.json();
		populateListSelector(data.data);
	}

	function populateListSelector(lists) {
		listSelector.innerHTML = "";
		lists.forEach((list) => {
			if (!list.archived) {
				const option = document.createElement("option");
				option.value = list.id;
				option.textContent = list.name;
				listSelector.appendChild(option);
			}
		});
		if (lists.length) {
			currentListId = listSelector.value;
			fetchNotes(currentListId);
			fetchTags(currentListId);
		} else {
			currentListId = null;
			noteListDiv.innerHTML = "";
			tagList.innerHTML = "";
		}
	}

	listSelector.addEventListener("change", () => {
		currentListId = listSelector.value;
		fetchNotes(currentListId);
		fetchTags(currentListId);
	});

	// === Creazione lista ===
	newListForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		await fetch(`${API_BASE}/lists`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newListName.value }),
		});
		newListName.value = "";
		await fetchLists();
	});

	// === Modifica lista ===
	editListBtn.addEventListener("click", () => {
		if (!currentListId) return;
		editListPopup.classList.add("show");
		editListInput.value = listSelector.selectedOptions[0].textContent;
	});
	confirmEditList.addEventListener("click", async () => {
		const newName = editListInput.value.trim();
		if (!newName) return;
		await fetch(`${API_BASE}/lists/${currentListId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newName }),
		});
		editListPopup.classList.remove("show");
		await fetchLists();
	});
	cancelEditList.addEventListener("click", () => {
		editListPopup.classList.remove("show");
	});

	// === Elimina lista ===
	deleteListBtn.addEventListener("click", () => {
		if (!currentListId) return;
		deleteListPopup.classList.add("show");
	});
	confirmDeleteList.addEventListener("click", async () => {
		await fetch(`${API_BASE}/lists/${currentListId}`, { method: "DELETE" });
		deleteListPopup.classList.remove("show");
		await fetchLists();
	});
	cancelDeleteList.addEventListener("click", () => {
		deleteListPopup.classList.remove("show");
	});

	// === Archivia lista ===
	archiveListBtn.addEventListener("click", async () => {
		if (!currentListId) return;
		await fetch(`${API_BASE}/lists/${currentListId}/archive`, { method: "PATCH" });
		await fetchLists();
		if (archivedVisible) await updateArchivedSection();
	});

	// === Toggle + render archiviate ===
	showArchivedListsBtn.addEventListener("click", async () => {
		archivedVisible = !archivedVisible;
		let section = document.getElementById("archivedListsSection");
		if (archivedVisible) {
			if (!section) {
				section = document.createElement("section");
				section.id = "archivedListsSection";
				section.innerHTML = `<h3>Liste Archiviate</h3><ul id="archivedListsUl"></ul>`;
				document.querySelector("main").appendChild(section);
			}
			section.style.display = "block";
			await updateArchivedSection();
		} else if (section) {
			section.style.display = "none";
		}
	});

	// === Funzione di aggiornamento live archiviate ===
	async function updateArchivedSection() {
		const res = await fetch(`${API_BASE}/lists/archived`);
		const data = await res.json();
		const ul = document.getElementById("archivedListsUl");
		if (!ul) return;
		ul.innerHTML = "";
		data.data.forEach((list) => {
			const li = document.createElement("li");
			li.textContent = list.name;
			const btn = document.createElement("button");
			btn.textContent = "📤";
			btn.title = "Disarchivia";
			btn.classList.add("disarchive-btn");
			btn.addEventListener("click", async () => {
				await fetch(`${API_BASE}/lists/${list.id}/unarchive`, { method: "PATCH" });
				await fetchLists();
				if (archivedVisible) await updateArchivedSection();
			});
			li.appendChild(btn);
			ul.appendChild(li);
		});
	}

	// === Fetch/render note ===
	async function fetchNotes(listId) {
		const res = await fetch(`${API_BASE}/lists/${listId}`);
		const data = await res.json();
		currentNotes = data.data.notes || [];
		renderNotes();
	}

	function renderNotes() {
		noteListDiv.innerHTML = "";
		currentNotes.forEach((note) => {
			const li = document.createElement("li");
			li.innerHTML = `
				<input type="checkbox" ${note.status ? "checked" : ""} data-id="${note.id}">
				<span>${note.note}</span>
				<button data-edit="${note.id}">✏️</button>
				<button data-delete="${note.id}">🗑️</button>
			`;
			noteListDiv.appendChild(li);
		});
	}

	// === Aggiunta nota ===
	messageForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		await fetch(`${API_BASE}/notes`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ note: messageInput.value, list_id: currentListId }),
		});
		messageInput.value = "";
		await fetchNotes(currentListId);
	});

	// === Edit/delete nota ===
	noteListDiv.addEventListener("click", async (e) => {
		const id = e.target.dataset.edit || e.target.dataset.delete;
		if (!id) return;
		if (e.target.dataset.edit) {
			const note = currentNotes.find((n) => n.id == id);
			currentEditingNoteId = id;
			editInput.value = note.note;
			editPopup.classList.add("show");
		}
		if (e.target.dataset.delete) {
			currentDeletingNoteId = id;
			confirmPopup.classList.add("show");
		}
	});
	noteListDiv.addEventListener("change", async (e) => {
		if (e.target.type === "checkbox") {
			const id = e.target.dataset.id;
			await fetch(`${API_BASE}/notes/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: e.target.checked ? 1 : 0 }),
			});
		}
	});
	editConfirm.addEventListener("click", async () => {
		await fetch(`${API_BASE}/notes/${currentEditingNoteId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ note: editInput.value }),
		});
		editPopup.classList.remove("show");
		await fetchNotes(currentListId);
	});
	editCancel.addEventListener("click", () => {
		editPopup.classList.remove("show");
	});
	confirmYes.addEventListener("click", async () => {
		await fetch(`${API_BASE}/notes/${currentDeletingNoteId}`, { method: "DELETE" });
		confirmPopup.classList.remove("show");
		await fetchNotes(currentListId);
	});
	confirmNo.addEventListener("click", () => {
		confirmPopup.classList.remove("show");
	});

	// === Cancella completate ===
	deleteCompletedBtn.addEventListener("click", async () => {
		const completed = [...noteListDiv.querySelectorAll("input[type='checkbox']:checked")];
		await Promise.all(
			completed.map((box) => fetch(`${API_BASE}/notes/${box.dataset.id}`, { method: "DELETE" }))
		);
		await fetchNotes(currentListId);
	});

	// === Fetch/render tag ===
	async function fetchTags(listId) {
		const res = await fetch(`${API_BASE}/lists/${listId}`);
		const data = await res.json();
		const listTags = data.data.tags || [];
		tagList.innerHTML = "";
		listTags.forEach((tag) => {
			const li = document.createElement("li");
			const span = document.createElement("span");
			span.textContent = tag.name;

			const del = document.createElement("button");
			del.textContent = "❌";
			del.addEventListener("click", async () => {
				await fetch(`${API_BASE}/lists/${listId}/tags/${tag.id}`, { method: "DELETE" });
				await fetchTags(listId);
			});

			const edit = document.createElement("button");
			edit.textContent = "✏️";
			edit.addEventListener("click", () => {
				currentEditingTagId = tag.id;
				editTagInput.value = tag.name;
				editTagPopup.classList.add("show");
			});

			li.appendChild(span);
			li.appendChild(edit);
			li.appendChild(del);
			tagList.appendChild(li);
		});
	}

	// === Modifica tag ===
	editTagConfirm.addEventListener("click", async () => {
		const newName = editTagInput.value.trim();
		if (newName && currentEditingTagId) {
			await fetch(`${API_BASE}/tags/${currentEditingTagId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: newName }),
			});
			editTagPopup.classList.remove("show");
			currentEditingTagId = null;
			await fetchTags(currentListId);
		}
	});
	editTagCancel.addEventListener("click", () => {
		editTagPopup.classList.remove("show");
		currentEditingTagId = null;
	});

	// === Nuovo tag ===
	newTagForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (!currentListId) return;
		const res = await fetch(`${API_BASE}/tags`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newTagName.value }),
		});
		const createdTag = await res.json();
		await fetch(`${API_BASE}/lists/${currentListId}/tags/${createdTag.data.id}`, { method: "POST" });
		newTagName.value = "";
		await fetchTags(currentListId);
	});

	// === Avvio iniziale ===
	fetchLists();
});

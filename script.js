const BASE_URL = "http://localhost:3000/notes";

const noteTitle = document.getElementById("noteTitle");
const noteDescription = document.getElementById("noteDescription");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const errorMessage = document.getElementById("errorMessage");

const fetchNotes = async () => {
    notesContainer.innerHTML = "";
    try {
        const response = await fetch(BASE_URL);
        const notes = await response.json();
        notes.forEach(note => displayNote(note));
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
};

const displayNote = (note) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";

    const notetitle = document.createElement("h4");
    notetitle.className = "note-title";
    notetitle.textContent = `${note.title}:`;

    const notedescription = document.createElement("p");
    notedescription.className = "note-description";
    notedescription.textContent = note.description;

    const noteBTNs = document.createElement("div");
    noteBTNs.className = "note-btns";

    const editBTN = document.createElement("button");
    editBTN.className = "edit-btn";
    editBTN.textContent = "Edit";
    editBTN.addEventListener('click',()=>{
        editNote(note);
    });

    const deletBTN = document.createElement("button");
    deletBTN.className = "delete-btn";
    deletBTN.textContent = "Delete";
    deletBTN.addEventListener('click',()=>{
        deleteNote(note.id);
    });

    noteBTNs.appendChild(editBTN);
    noteBTNs.appendChild(deletBTN);
    noteDiv.appendChild(notetitle);
    noteDiv.appendChild(notedescription);
    noteDiv.appendChild(noteBTNs);
    notesContainer.appendChild(noteDiv);
};

const addNote = async () => {
    const title = noteTitle.value.trim();
    const description = noteDescription.value.trim();

    // Validation
    if (title.length < 6) {
        errorMessage.textContent = "*Title must be at least 6 characters.";
        return;
    }
    if (description.length < 20) {
        errorMessage.textContent = "*Description must be at least 20 characters.";
        return;
    }

    errorMessage.textContent = ""; 

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description })
        });
        const newNote = await response.json();
        displayNote(newNote);
        noteTitle.value = ""; 
        noteDescription.value = "";
    } catch (error) {
        console.error("Error adding note:", error);
    }
};

const editNote = async (note) => {
    const newTitle = prompt("Edit note title:", note.title);
    const newDescription = prompt("Edit note description:", note.description);

    if (!newTitle || newTitle.length < 6) {
        alert("Title must be at least 6 characters.");
        return;
    }
    if (!newDescription || newDescription.length < 20) {
        alert("Description must be at least 20 characters.");
        return;
    }

    try {
        await fetch(`${BASE_URL}/${note.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, description: newDescription })
        });
        fetchNotes();
    } catch (error) {
        console.error("Error updating note:", error);
    }
};

const deleteNote = async (id) => {
    try {
        await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
        fetchNotes();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
};

addNoteBtn.addEventListener("click", addNote);
document.addEventListener("DOMContentLoaded", fetchNotes);

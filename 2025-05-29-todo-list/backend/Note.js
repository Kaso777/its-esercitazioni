class Note {
    constructor(noteId, note, status){
        this.noteId=noteId;
        this.note=note;
        this.status=false;;
    }

    getNoteId() {
        return this.noteId;
    }

    getNote() {
        return this.note;
    }

    getStatus() {
        return this.status;
    }
}
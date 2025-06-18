<?php

class Ticket {
    private $nome_utente;
    private $tipo_ticket;
    private $contenuto;

    public function __construct($nome_utente, $tipo_ticket, $contenuto) {
        $this->nome_utente = $nome_utente;
        $this->tipo_ticket = $tipo_ticket;
        $this->contenuto = $contenuto;
    }

    public function getNomeUtente() {
        return $this->nome_utente;
    }

    public function getTipoTicket() {
        return $this->tipo_ticket;
    }

    public function getContenuto() {
        return $this->contenuto;
    }

    public function setNomeUtente($nome_utente) {
        $this->nome_utente = $nome_utente;
    }

    public function setTipoTicket($tipo_ticket) {
        $this->tipo_ticket = $tipo_ticket;
    }

    public function setContenuto($contenuto) {
        $this->contenuto = $contenuto;
    }

    public function __toString() {
        return "Ticket di {$this->nome_utente}: {$this->tipo_ticket} - {$this->contenuto}";
    }

    public function validate() {
    if (empty(trim($this->nome_utente)) || empty(trim($this->tipo_ticket)) || empty(trim($this->contenuto))) {
        throw new Exception('Tutti i campi sono obbligatori.');
        }
    }

}

//Prendo i dati dal form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $ticket = new Ticket($_POST['utente'] ?? '', $_POST['tipo'] ?? '', $_POST['contenuto'] ?? '');
        $ticket->validate();
        echo "Ticket creato con successo!";
        echo $ticket->__toString();
    } catch (Exception $e) {
        echo "Errore: " . $e->getMessage();
    }
}
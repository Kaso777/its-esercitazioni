<?php

// Class Ticket rappresenta un ticket di supporto con nome utente, tipo e contenuto.
class Ticket {
    private $nome_utente;
    private $tipo_ticket;
    private $contenuto;

    //Costruttore
    public function __construct($nome_utente, $tipo_ticket, $contenuto) {
        $this->nome_utente = $nome_utente;
        $this->tipo_ticket = $tipo_ticket;
        $this->contenuto = $contenuto;
    }

    // Metodi getter e setter
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
        return "Ticket di: {$this->nome_utente} \n \n Tipologia: {$this->tipo_ticket} \n \n Contenuto: {$this->contenuto}";
    }

    // Metodo per validare i dati del ticket
    public function validate() {
    if (empty(trim($this->nome_utente)) || empty(trim($this->tipo_ticket)) || empty(trim($this->contenuto))) {
        throw new Exception('Tutti i campi sono obbligatori.');
        } elseif (strlen($this->contenuto) <10) {
            throw new Exception('Il contenuto del ticket deve essere lungo almeno 10 caratteri.');
        }
    }
}
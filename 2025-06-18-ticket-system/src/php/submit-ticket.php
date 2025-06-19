<?php
require_once 'Ticket.php';

$messaggio = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $ticket = new Ticket($_POST['utente'] ?? '', $_POST['tipo'] ?? '', $_POST['contenuto'] ?? '');
        $ticket->validate();
        $messaggio = "<p style='color:green;'>Ticket creato con successo!</p>";
        $messaggio .= "<p>" . nl2br(htmlspecialchars($ticket->__toString())) . "</p>";
    } catch (Exception $e) {
        $messaggio = "<p style='color:red;'>Errore: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
} else {
    $messaggio = "<p>Usa il form per inviare un ticket.</p>";
}
?>
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="http://localhost:8080/css/main.css" />
    <title>Risultato Ticket</title>
</head>
<body>
    <?php echo $messaggio; ?>
    <a href="http://localhost:8080">Torna al form</a>
</body>
</html>


<pre>

<?php

$nome = $_GET['nome'] ?? "NomeAnonimo";
$cognome = $_GET['cognome'] ?? "CognomeAnonimo";
$messaggio = $_GET['messaggio'] ?? "Testo assente";


echo "L'utente $nome $cognome ha inviato il seguente messaggio: $messaggio";

?>

</pre>
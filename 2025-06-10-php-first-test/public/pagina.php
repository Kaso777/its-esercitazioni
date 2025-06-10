<?php
// Verifica se la richiesta è di tipo GET e se il parametro 'inputText' è presente
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['inputText']) && !empty($_GET['inputText'])) {
    // Recupera il valore di inputText e lo sanifica per prevenire attacchi XSS
    $inputText = htmlspecialchars($_GET['inputText']);
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Risultato del Form</title>
</head>
<body>
    <h1>Hai inserito:</h1>
    <p><?php echo $inputText; ?></p>
    <p><a href="index.php">Torna al form</a></p>
</body>
</html>
<?php
} else {
    // Se la pagina viene caricata direttamente senza dati GET,
    // o se 'inputText' non è presente, reindirizza l'utente al form.
    header("Location: index.php");
    exit();
}
?>
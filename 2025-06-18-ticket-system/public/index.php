<?php
echo "Server PHP attivo!";

?>



<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" type="text/css" href="./css/main.css" />

</head>
<body>
    <form method="post" action="">
        <input type="text" name="utente" placeholder="Inserire nome utente" required>
        
        <select name="tipo" required>
            <option value="bug">Bug</option>
            <option value="richiesta">Richiesta</option>
            <option value="supporto">Supporto tecnico</option>
            <option value="altro">Altro</option>
        </select>
        <textarea name="contenuto" placeholder="Descrivi il problema o la richiesta" required></textarea>
        <button type="submit">Invia</button>
    </form>
    
</body>
</html>
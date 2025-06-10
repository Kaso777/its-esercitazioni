<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form di Input</title>
</head>
<body>
    <h1>Inserisci del testo</h1>
    <form method="GET" action="pagina.php">
        <input type="text" id="inputText" name="inputText" required>
        <button type="submit">Invia</button>
    </form>
    
</body>
</html>


<?php
/*
PHP è un linguaggio lato server. Ciò significa che quando una richiesta arriva a pagina.php (ad esempio, quando il form viene inviato),
il server esegue il codice PHP. Il compito del codice PHP, in questo caso, è di:
1. Ricevere i dati inviati dal form (tramite $_GET).
2. Elaborare questi dati (nel tuo esempio, semplicemente li sanifica con htmlspecialchars).
3. Generare una risposta che il browser dell'utente può capire e visualizzare.

Questa "risposta" è tipicamente un documento HTML. Il browser non capisce il PHP; capisce solo HTML, CSS e JavaScript.
Quindi, anche se pagina.php ha un'estensione .php, il suo scopo finale è produrre un output che è fondamentalmente una pagina web HTML completa.

Pensa al processo:
1. index.php (o form.php): È una pagina HTML con un form. Quando la invii, il tuo browser fa una richiesta a pagina.php.
2. Il server riceve la richiesta per pagina.php: Riconosce l'estensione .php e passa il file all'interprete PHP.
3. L'interprete PHP esegue pagina.php:
        - Verifica se ci sono dati GET e se inputText è presente.
        - Se sì, prende il valore di inputText.
        - Poi, PHP inizia a "stampare" l'HTML.
            Tutte le istruzioni echo che vedi in pagina.php stanno generando riga per riga il codice HTML che formerà la pagina di risposta.
        - Nel tuo codice, l'interprete PHP crea un'intera struttura HTML (<!DOCTYPE html>, <html>, <head>, <body>, <h1>, <p>, ecc.) e
            inserisce il valore di $inputText al suo interno.
4. Il server invia l'HTML generato al tuo browser: Una volta che l'interprete PHP ha finito di elaborare e ha generato tutto l'HTML,
    il server invia questo HTML puro al tuo browser.
5. Il tuo browser visualizza l'HTML: Il browser riceve il codice HTML e lo rende visibile all'utente come una normale pagina web.

In sintesi, pagina.php non si limita a stampare il testo, ma costruisce l'intera struttura di una pagina web intorno a quel testo,
rendendola navigabile e presentabile come qualsiasi altra pagina HTML.

*/
?>
<!DOCTYPE html>
<html>
<head>
    <title>Modifica auto {{ $car->id }}</title>
</head>
<body>
    <h1>Modifica Auto</h1>

    <form action="{{ route('cars.update', $car->id) }}" method="POST">
        @csrf
        @method('PUT') <!-- Laravel richiede questo per simulare PUT -->

        <label for="make">Make:</label><br>
        <input type="text" name="make" value="{{ $car->make }}" required><br><br>

        <label for="model">Model:</label><br>
        <input type="text" name="model" value="{{ $car->model }}" required><br><br>

        <label for="produced_on">Produced On:</label><br>
        <input type="date" name="produced_on" value="{{ $car->produced_on }}" required><br><br>

        <button type="submit">Salva modifiche</button>
    </form>

    <a href="{{ route('cars.index') }}">Torna alla lista</a>
</body>
</html>

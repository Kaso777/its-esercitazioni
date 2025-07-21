<!DOCTYPE html>
<html>
<head>
    <title>Add New Car</title>
</head>
<body>
    <h1>Add New Car</h1>

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('cars.store') }}" method="POST">
        @csrf

        <label for="make">Make:</label><br>
        <input type="text" id="make" name="make" value="{{ old('make') }}" required><br><br>

        <label for="model">Model:</label><br>
        <input type="text" id="model" name="model" value="{{ old('model') }}" required><br><br>

        <label for="produced_on">Produced On:</label><br>
        <input type="date" id="produced_on" name="produced_on" value="{{ old('produced_on') }}" required><br><br>

        <button type="submit">Add Car</button>
    </form>

    <a href="{{ route('cars.index') }}">Torna all'index</a>

</body>
</html>
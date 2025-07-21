<!DOCTYPE html>
<html>
  <head>
    <title>Car {{ $car->id }}</title>
  </head>
  <body>
    <h1>Car {{ $car->id }}</h1>
    <ul>
      <li>Make: {{ $car->make }}</li>
      <li>Model: {{ $car->model }}</li>
      <li>Produced on: {{ $car->produced_on }}</li>
    </ul>

    <a href="{{ route('cars.index') }}">Torna all'index</a>
  </body>
</html>
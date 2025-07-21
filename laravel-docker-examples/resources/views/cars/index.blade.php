<ul>
@foreach ($cars as $car)
    <li>
        {{ $car->make }} {{ $car->model }} ({{ $car->produced_on }})
        <a href="{{ route('cars.show', $car->id) }}">Vedi</a>
        <a href="{{ route('cars.edit', $car->id) }}">Modifica</a>
        <form action="{{ route('cars.destroy', $car->id) }}" method="POST" style="display:inline;">
            @csrf
            @method('DELETE')
            <button type="submit" onclick="return confirm('Sei sicuro di voler eliminare questa auto?')">
                Elimina
            </button>
        </form>
    </li>
@endforeach
</ul>
<a href="{{ route('cars.create') }}">
    <button type="button">Aggiungi una nuova auto</button>
</a>
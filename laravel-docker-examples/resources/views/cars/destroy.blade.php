<form action="{{ route('cars.destroy', $car->id) }}" method="POST" style="display:inline;">
    @csrf
    @method('DELETE')
    <button type="submit" onclick="return confirm('Sei sicuro di voler eliminare questa auto?')">
        Elimina
    </button>
</form>

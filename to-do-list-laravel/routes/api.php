use App\Http\Controllers\NoteController;
use App\Http\Controllers\ListaController;

Route::apiResource('notes', NoteController::class);
Route::apiResource('lists', ListaController::class);
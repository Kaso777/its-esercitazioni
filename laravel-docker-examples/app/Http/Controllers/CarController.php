<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;
use App\Http\Controllers\Controller;

class CarController extends Controller
{
    public function index()
{
    $cars = Car::all();  // Prende tutte le righe dalla tabella 'cars'
    return view('cars.index', ['cars' => $cars]);  // Passa i dati alla view 'cars.index'
}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('cars.add');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validazione dati (meglio sempre farla)
        $validated = $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'produced_on' => 'required|date',
        ]);

        $car = Car::create($validated);
        return redirect()->route('cars.show', $car->id)
                            ->with('success', 'Car created successfully!');
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $car = Car::find($id);
        //if (!$car) {
          //  abort(404, 'Car not found');
        //}
        return view('cars.show', array('car'=>$car));
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $car = Car::findOrFail($id); // Cerca l'auto, oppure lancia un 404
        return view('cars.edit', ['car' => $car]); // Mostra la view col form di modifica
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
{
    // Validazione dei dati
    $validated = $request->validate([
        'make' => 'required|string|max:255',
        'model' => 'required|string|max:255',
        'produced_on' => 'required|date',
    ]);

    // Trova l'auto da aggiornare
    $car = Car::findOrFail($id);

    // Aggiorna i campi con i dati validati
    $car->update($validated);

    // Redirect con messaggio di successo
    return redirect()->route('cars.show', $car->id)
                     ->with('success', 'Car updated successfully!');
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    $car = Car::findOrFail($id);
    $car->delete();

    return redirect()->route('cars.index')->with('success', 'Car deleted successfully!');
}

}
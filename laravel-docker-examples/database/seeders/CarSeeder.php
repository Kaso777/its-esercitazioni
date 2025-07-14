<?php

namespace Database\Seeders;

use App\Models\Car;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Car::create ([
            'make'=>'Toyota',
            'model'=>'Corolla',
            'produced_on'=>'2020-12-01',
        ]);
    }
}
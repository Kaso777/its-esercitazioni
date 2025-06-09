class Vehicle {
    constructor(brand, model, plate) {
        this.brand = brand;
        this.model = model;
        this.plate = plate;
        this.turnedOn = false;
    }

    turnOn() {
        if (this.turnedOn = true ) {
            console.log("è già acceso")
        } else {
        this.turnedOn = true;
        console.log(`Veicolo ${this.plate} acceso.`)
        }
    }

    turnOff() {
        if (this.turnedOn = false ) {
            console.log("è già spento")
        } else {
        this.turnedOn = false;
        console.log(`Veicolo ${this.plate} spento.`)
        }
    }
}


class Car extends Vehicle {
    constructor(brand, model, plate, seats) {
        super(brand, model, plate);
        this.seats = seats;
        this.takenSeats = 0;
        console.log("Tipo di veicolo: Automobile.");
    }

    addPassenger() {
        if (this.takenSeats < this.seats) {
            this.takenSeats++;
            console.log(`Persona caricata su ${this.plate}`)
        } else {
            console.log(`Auto ${this.plate} già piena.`);
        }
    }

    removePassenger() {
        if (this.takenSeats < this.seats) {

        }
    }
}



const pandino = new Car("Fiat", "Panda", "DC666PD", 4)


pandino.turnOn();
pandino.turnOn();
pandino.turnOff();
pandino.turnOff();


pandino.addPassenger();
pandino.addPassenger();
pandino.addPassenger();
pandino.addPassenger();
pandino.addPassenger();


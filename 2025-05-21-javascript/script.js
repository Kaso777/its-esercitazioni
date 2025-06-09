//function pres(name, age) {
//    console.log(`Mi chiamo ${name} e ho ${age} anni`);
//}

//console.log(pres("Giacomino", 66));



/*
const pres = (name, age) => `Mi chiamo ${name} e ho ${age} anni`
console.log(pres("Giacomino", 66));
*/

/*
const pres = (name, age) => {
    if (age < 18) {
        return `Mi chiamo ${name} e sono minorenne`
        } else {
            return `Sono ${name} e sono maggiorenne`
        }
    }


console.log(pres("Giacomino", 66));
*/

// Scrivere una funzione getOdds che prende in ingresso un array di numeri e mi restituisce un array che contiene solo i numero dispari del primo array.

function getOdds(array) {
    
    let array2 = []
    k=0
    for (let i=0; i< array.length; i++){
        if (array[i] %2!=0) {
            array2[k] = array[i]
            k++
        }
    }
        return array2
}

console.log(getOdds([1,2,3,4,5,6,7,8,9,10,11,12,15,16,18,61,15,60,611,68486,11651]))
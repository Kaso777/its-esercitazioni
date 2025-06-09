class Author {
    constructor(fullName, yearOfBirth){
        this.fullName=fullName;
        this.yearOfBirth=yearOfBirth;
        this.yearOfDeath=null;
    }

    isAlive() {
        if (this.yearOfDeath==null) 
        return true
    }

    setDeath(year) {
        if (this.yearOfDeath) {
            console.log(`Attenzione: l'anno di morte di ${this.fullName} è già impostato al ${this.yearOfDeath}. Sovrascrivo con ${year}`)
        } else {
            console.log(`Anno di morte di ${this.fullName} impostato a ${year}`)
        }
    this.yearOfDeath=year;
    }

    setAlive() {
        if (this.yearOfDeath) {
            console.log(`Impostato ${this.fullName} come vivo`)
        } else {
            console.log(`${this.fullName} è già impostato come vivo`)
        }
        this.yearOfDeath=null;
    }
}


class Book {
    constructor (title, author, year, pages) {
        this.title=title;
        this.author=author;
        this.year=year;
        this.pages=pages;
        this.read=false;
    }

    setRead() {
        if (this.read) {
            console.log("Libro già letto")
        } else {
            this.read=true
            console.log(`Libro ${this.title} segnato come letto.`)
        }
    }

    setUnread() {
        if (this.read) {
            this.read=false
            console.log(`Libro ${this.title} segnato come NON letto.`)
        } else {
            console.log(`Il libro ${this.title} è già segnato come NON letto.`)
            
        }
    }

}

const autore1 = new Author("Brambello Robert Falchetto Lassopeluso", 879)
const libro1 = new Book ("Balla con le scimmie",autore1, 912)

const autore2 = new Author("Autore Due", 860)
const libro2 = new Book("Nuota con le balene", [autore1, autore2], 905)


libro1.setRead();
libro1.setRead();
libro1.setUnread();
libro1.setUnread();

if (autore1.isAlive()==true) console.log(`${autore1.fullName} è ancora vivo`);
else console.log(`${autore1.fullName} è stiattato nel ${autore1.yearOfDeath}`)

autore1.setDeath(960);
autore1.setDeath(961);
if (autore1.isAlive()==true) console.log(`${autore1.fullName} è ancora vivo`);
else console.log(`${autore1.fullName} è stiattato nel ${autore1.yearOfDeath}`)

autore1.setAlive();
autore1.setAlive();
if (autore1.isAlive()==true) console.log(`${autore1.fullName} è ancora vivo`);
else console.log(`${autore1.fullName} è stiattato nel ${autore1.yearOfDeath}`)

console.log(`${autore1.fullName} ha scritto ${libro1.title}`)
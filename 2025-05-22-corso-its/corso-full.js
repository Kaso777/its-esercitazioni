class Person {
    constructor(name, surname) {
        this.name=name;
        this.surname=surname;
    }
}

class Teacher extends Person {
    constructor(name, surname, id, subject) {
        super(name, surname)
        this.id=id;
        this.subject=subject;
    }
}


class Student extends Person {
    constructor(name,surname, idStudent, vote) {
        super(name, surname)
        this.idStudent=idStudent;
        this.vote=vote;
    }
}

class Tutor extends Person {
    constructor (name, surname, office) {
        super(name, surname)
        this.office=office;
    }
}


class UF {
    constructor(nomenclatura, teacher, hours) {
        this.nomenclatura=nomenclatura;
        this.teacher=teacher;
        this.hours=hours;
    }
}

class Classroom {
    constructor (students, uf, tutor) {
        this.students=[];
        this.uf=uf;
        this.tutor=tutor;
    }

    addStudent(idStudent) {
        if (this.students.idStudent.include(idStudent)) {
            console.log(`Lo studente è già nella classe.`)
        } else {
            this.students.push(idStudent)
            console.log(`Studente ${idStudent} aggiunto.`)
        }

    }


}


const teacher1 = new Teacher("Mario", "Pedrozzi", "t012", "Lancio di bestemmie")
const teacher2 = new Teacher ("Federica", "Lamanoamica", "t060", "Presa del gambero")

const studente1 = new Student("Marcellino", "Nonhavoglia", "s111", null)
const studente2 = new Student("Bernardina", "Scuoiatrote", "s666", null)


console.log(teacher1);
console.log(teacher2);

console.log(studente1);
console.log(studente2);
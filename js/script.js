// Variables

let DB;

// Interface Selectors
const form = document.querySelector('#form'),
    petName = document.querySelector('#pet'),
    customerName = document.querySelector('#customer'),
    phone = document.querySelector('#tel'),
    date = document.querySelector('#date'),
    hour = document.querySelector('#hour'),
    symptoms = document.querySelector('#symptoms'),
    appointment = document.querySelector('#manages');


// Event

// Wait for dom ready!
document.addEventListener('DOMContentLoaded', () => {

    //  Create Data Base
    let createDB = window.indexedDB.open('appointments', 1);

    // if there's an error send to console
    createDB.onerror = () => {
        console.log("There was an Error");
    }

    // If all is ok then display in console, and assign data base
    createDB.onsuccess = () => {
        //Assign to dataBase.
        DB = createDB.result;
        console.log(DB);
    };
    // This method only runs one time, and is perfect to create SChema.container
    createDB.onupgradeneeded = (e) => {
        // The event is the same data
        let db = e.target.result;

        // Define object Store , need 2  parameters, the db name and options
        // keyPath is the index of the database
        let objectStore = db.createObjectStore('appointments',
            {
                keyPath: 'key',
                autoIncrement: true,
            });

        // Create the index and field of data base, createIndex: 3 parameters, name, keypath and options
        objectStore.createIndex('petName', 'petName', { unique: false });
        objectStore.createIndex('customerName', 'customerName', { unique: false });
        objectStore.createIndex('phone', 'phone', { unique: true});
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('hour', 'hour', { unique: false });
        objectStore.createIndex('symptoms', 'symptoms', { unique: false });

        console.log('Database Created and Ready');
    };

});


// Variables

let DB;

// Interface Selectors
const form = document.querySelector('form'),
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
        objectStore.createIndex('phone', 'phone', { unique: true });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('hour', 'hour', { unique: false });
        objectStore.createIndex('symptoms', 'symptoms', { unique: false });

        console.log('Database Created and Ready');
    };

    //When the form is sent
    form.addEventListener('submit', addData);

    // functions
    function addData(e) {
        e.preventDefault();
        const newAppointment = {
            petName: petName.value,
            customerName: customerName.value,
            phone: phone.value,
            date: date.value,
            hour: hour.value,
            symptoms: symptoms.value,
        }
        // In IndexedDB we use transactions
        let transaction = DB.transaction(['appointments'], 'readwrite');
        let objectStore = transaction.objectStore('appointments');
        // console.log('objectStore', objectStore);
        let dataRequest = objectStore.add(newAppointment);
        dataRequest.onsuccess = () => {
            form.reset();
        };
        transaction.onComplete = () => {
            console.log('Appointment Added!!!');
        };
        transaction.onerror = () => {
            console.log('There was an error adding Apppointment Data. Data was not added!');
        }

        

    }

    function showData() {
        // Clean previous appointments 
        while (appointment.firstChild) {
            appointment.removeChild(appointment.firstChild);
        }

        // Create objectStore
        let objectStore = DB.transaction('appointments').objectStore('appointments');

        // Return a request
        objectStore.openCursos().onsuccess = function (e) {
            // The cursor will be positioned on the indicated record to access the data
            let cursor = e.target.result;
            if (cursor) {
                let appointmentHTML = document.createElement('li');
                appointmentHTML.setAttribute('data-appointment-id', cursor.value.key);
                appointmentHTML.classList.add('list-group-item');
                appointmentHTML.innerHTML = `
                <p class="font-weight-bold">Pet: <span class="font-weight-normal">${cursor.value.petName}</span> </p>`;

                // append to the parent

                appointment.appendChild(appointmentHTML);

                cursor.continue();

            }
        };

    }

});


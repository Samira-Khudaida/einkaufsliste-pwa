// 1. Referenzen zu HTML-Elementen bekommen
const itemInput = document.getElementById('item-input');
const addItemBtn = document.getElementById('add-item-btn');
const shoppingListUl = document.getElementById('shopping-list');
const clearListBtn = document.getElementById('clear-list-btn');

// 2. Die Variable für unsere Einkaufsliste
// Versuche, die Liste aus dem localStorage zu laden, ansonsten starte mit einem leeren Array
let shoppingList = loadListFromLocalStorage();

// --- Funktionen zur Verwaltung der Liste ---

// Funktion, um die Liste im HTML anzuzeigen
function renderList() {
    // Zuerst die aktuelle Liste im HTML leeren, um Duplikate zu vermeiden
    shoppingListUl.innerHTML = '';

    // Für jeden Artikel im shoppingList-Array ein Listenelement erstellen
    shoppingList.forEach((itemText, index) => {
        const li = document.createElement('li'); // Neues <li> Element erstellen
        li.textContent = itemText; // Den Text des Artikels setzen

        // Löschen-Button für jeden Artikel erstellen
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.classList.add('delete-item-btn'); // CSS-Klasse hinzufügen
        
        // Event Listener für den Löschen-Button
        deleteBtn.addEventListener('click', () => {
            deleteItem(index); // Rufe deleteItem mit dem Index des Artikels auf
        });

        li.appendChild(deleteBtn); // Löschen-Button zum <li> hinzufügen
        shoppingListUl.appendChild(li); // <li> zur <ul> hinzufügen
    });
}

// Funktion zum Hinzufügen eines Artikels
function addItem() {
    const newItem = itemInput.value.trim(); // Wert aus dem Input-Feld lesen und Leerzeichen entfernen

    if (newItem !== '') { // Nur hinzufügen, wenn der Input nicht leer ist
        shoppingList.push(newItem); // Artikel zum Array hinzufügen
        saveListToLocalStorage(); // Liste speichern
        renderList(); // Liste im HTML neu rendern
        itemInput.value = ''; // Input-Feld leeren
        itemInput.focus(); // Fokus zurück zum Input-Feld setzen
    } else {
        alert('Bitte gib einen Artikel ein!'); // Optional: Warnung bei leerem Input
    }
}

// Funktion zum Löschen eines Artikels
function deleteItem(indexToDelete) {
    // Entfernt 1 Element an der Position indexToDelete aus dem Array
    shoppingList.splice(indexToDelete, 1);
    saveListToLocalStorage(); // Liste speichern
    renderList(); // Liste im HTML neu rendern
}

// Funktion zum Leeren der gesamten Liste
function clearList() {
    if (confirm('Möchtest du wirklich die gesamte Liste löschen?')) { // Bestätigungsdialog
        shoppingList = []; // Array leeren
        saveListToLocalStorage(); // Leere Liste speichern
        renderList(); // Leere Liste im HTML anzeigen
    }
}

// --- Funktionen zum Speichern und Laden mit localStorage ---

// Speichert das aktuelle shoppingList-Array im Browser-Speicher
function saveListToLocalStorage() {
    // Array in einen JSON-String umwandeln, da localStorage nur Strings speichern kann
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Lädt die Liste aus dem Browser-Speicher
function loadListFromLocalStorage() {
    const storedList = localStorage.getItem('shoppingList');
    if (storedList) {
        // JSON-String zurück in ein JavaScript-Array umwandeln
        return JSON.parse(storedList);
    }
    return []; // Wenn nichts gespeichert ist, leeres Array zurückgeben
}

// --- Event Listener ---

// Event Listener für den "Hinzufügen"-Button
addItemBtn.addEventListener('click', addItem);

// Event Listener für die "Enter"-Taste im Input-Feld
itemInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addItem();
    }
});

// Event Listener für den "Liste leeren"-Button
clearListBtn.addEventListener('click', clearList);

// --- Initialisierung beim Laden der Seite ---
// Zeigt die gespeicherten Artikel an, sobald die Seite geladen ist
renderList();

// PWA: Service Worker registrieren (für Offline-Fähigkeiten und Caching)
// Dies ist ein optionaler, aber wichtiger Schritt für eine vollwertige PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registriert:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker Registrierung fehlgeschlagen:', error);
            });
    });
}
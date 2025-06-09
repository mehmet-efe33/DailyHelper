const calendarGrid = document.getElementById('calendar-grid');
const monthYearLabel = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
const noteText = document.getElementById('noteText');
const saveNoteBtn = document.getElementById('saveNote');

let currentDate = new Date();
let selectedDate = null;

// Gün isimleri (Pazartesi değil Pazar ile başlıyor)
const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

// Notları localStorage'den al
function loadNotes() {
    const notes = localStorage.getItem('calendarNotes');
    return notes ? JSON.parse(notes) : {};
}

// Notları kaydet
function saveNotes(notes) {
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
}

// Takvimi oluştur
function renderCalendar(date) {
    calendarGrid.innerHTML = '';

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // YYYY-MM-DD formatı için
    monthYearLabel.textContent = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const notes = loadNotes();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // Gün adları
    for (const dayName of dayNames) {
        const dayNameDiv = document.createElement('div');
        dayNameDiv.classList.add('day-name');
        dayNameDiv.textContent = dayName;
        calendarGrid.appendChild(dayNameDiv);
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${month + 1}-${d}`;
        const cell = document.createElement('div');
        cell.classList.add('day-cell');
        cell.dataset.date = dateStr;

        // Gün numarası
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = d;
        cell.appendChild(dayNumber);

        // Bugünün gününü vurgula
        if (dateStr === todayStr &&
            today.getMonth() === month &&
            today.getFullYear() === year) {
            cell.classList.add('today');
        }

        // Not varsa, notu ekle ve class ver
        if (notes[dateStr]) {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');
            noteDiv.textContent = notes[dateStr];
            cell.appendChild(noteDiv);
            cell.classList.add('has-note');
        }

        cell.addEventListener('click', () => {
            selectedDate = dateStr;
            noteText.value = notes[dateStr] || '';
            document.getElementById('noteModalLabel').textContent = `${selectedDate} için Not`;
            noteModal.show();
        });

        calendarGrid.appendChild(cell);
    }
}


// Not kaydet butonu
saveNoteBtn.addEventListener('click', () => {
    const notes = loadNotes();
    if (noteText.value.trim() === '') {
        delete notes[selectedDate];
    } else {
        notes[selectedDate] = noteText.value.trim();
    }
    saveNotes(notes);
    noteModal.hide();
    renderCalendar(currentDate);
});

// Ay değiştir butonları
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Sayfa yüklendiğinde takvimi çiz
renderCalendar(currentDate);

// Dark mode varsa takvimde uygula
if (document.body.classList.contains('dark-mode')) {
    document.getElementById('calendar').classList.add('dark-mode');
}
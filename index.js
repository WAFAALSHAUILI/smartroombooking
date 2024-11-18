// تعريف الجدول للأيام والحصص
const schedule = {
    "الأحد": ["", "", "", "", "", "", "", "", ""],
    "الإثنين": ["", "", "", "", "", "", "", "", ""],
    "الثلاثاء": ["", "", "", "", "", "", "", "", ""],
    "الأربعاء": ["", "", "", "", "", "", "", "", ""],
    "الخميس": ["", "", "", "", "", "", "", "", ""]
};

// دالة لعرض الجدول الأسبوعي
function renderSchedule() {
    const tableBody = document.getElementById("schedule-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = '';

    for (const day in schedule) {
        const row = document.createElement("tr");
        const dayCell = document.createElement("td");
        dayCell.textContent = day;
        row.appendChild(dayCell);

        schedule[day].forEach((period, index) => {
            const cell = document.createElement("td");
            cell.textContent = period ? `${period.teacher} - ${period.class}` : "متاح";
            if (period) {
                cell.classList.add("booked");
            }
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    }
}

// دالة لحجز الحصة
function bookSlot(date, teacher, subject, className) {
    const day = new Date(date).toLocaleDateString("ar-EG", { weekday: 'long' });

    if (!schedule[day]) return;

    const periodIndex = prompt("أدخل رقم الحصة (1-9):") - 1;

    if (periodIndex >= 0 && periodIndex < schedule[day].length && !schedule[day][periodIndex]) {
        schedule[day][periodIndex] = { teacher, subject, class: className };
        renderSchedule();
        document.getElementById("notification").style.display = 'block';
        document.getElementById("notification").textContent = "تم حجز الحصة بنجاح!";
    } else {
        alert("الحصة غير متاحة أو غير صحيحة.");
    }
}

// التعامل مع نموذج الحجز
document.getElementById("booking-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const date = document.getElementById("date").value;
    const teacher = document.getElementById("teacher-name").value;
    const subject = document.getElementById("subject").value;
    const className = document.getElementById("class").value;

    if (date && teacher && subject && className) {
        bookSlot(date, teacher, subject, className);
    } else {
        alert("يرجى ملء جميع الحقول.");
    }
});

// عند تحميل الصفحة، عرض الجدول
renderSchedule();

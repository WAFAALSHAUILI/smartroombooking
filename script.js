const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
let selectedWeekDates = [];
let schedule = {};
let currentPeriodKey = "";

// تحديث الجدول عند اختيار الأسبوع
document.getElementById("week").addEventListener("change", function () {
    const selectedWeek = this.value;
    updateWeekDates(selectedWeek);
    renderSchedule();
});

// تحديث تواريخ الأسبوع بناءً على رقم الأسبوع
function updateWeekDates(week) {
    // تحويل حقل input[type="week"] إلى تاريخ بداية الأسبوع
    const [year, weekNumber] = week.split('-W');
    const startDate = getStartDateOfWeek(year, weekNumber);

    selectedWeekDates = [];

    // التحقق من التاريخ
    if (isNaN(startDate.getTime())) {
        console.error("تاريخ الأسبوع غير صالح");
        return;
    }

    for (let i = 0; i < daysOfWeek.length; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // استثناء الجمعة والسبت
        if (date.getDay() !== 5 && date.getDay() !== 6) {
            selectedWeekDates.push(date);
        }
    }
}

// دالة لحساب تاريخ بداية الأسبوع بناءً على السنة ورقم الأسبوع
function getStartDateOfWeek(year, weekNumber) {
    const d = new Date(year, 0, 1); // بداية السنة الجديدة
    const dayOfWeek = d.getDay() || 7; // نحصل على اليوم الأول من السنة
    d.setDate(d.getDate() + (7 * (weekNumber - 1)) - dayOfWeek + 1); // تحديد بداية الأسبوع
    return d;
}

// عرض الجدول
function renderSchedule() {
    const tableBody = document.querySelector("#schedule-table tbody");
    tableBody.innerHTML = "";

    // إضافة الأيام إلى الجدول
    daysOfWeek.forEach((day, index) => {
        if (selectedWeekDates[index]) {
            const currentDate = selectedWeekDates[index];
            const dateKey = currentDate.toISOString().split("T")[0]; // الحصول على التاريخ بتنسيق YYYY-MM-DD
            const row = document.createElement("tr");

            const dayCell = document.createElement("td");
            dayCell.textContent = `${day} (${currentDate.toLocaleDateString("ar-EG")})`;
            row.appendChild(dayCell);

            // إضافة الحصص اليومية
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement("td");
                const periodKey = `${dateKey}-${i}`;

                if (new Date(dateKey) < new Date()) {
                    cell.textContent = "منصرم";
                    cell.classList.add("disabled");
                } else if (schedule[periodKey]) {
                    cell.textContent = `تم الحجز (${schedule[periodKey].date})`;
                    cell.classList.add("booked");
                } else {
                    cell.textContent = "متاح";
                    cell.classList.add("available");
                    cell.onclick = () => selectSlot(cell, periodKey);
                }

                row.appendChild(cell);
            }

            tableBody.appendChild(row);
        }
    });
}

// تحديد الحصة
function selectSlot(cell, periodKey) {
    document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
    cell.classList.add("selected");
    currentPeriodKey = periodKey;

    document.getElementById("booking-form").style.display = "block";
}

// تأكيد الحجز
function confirmBooking() {
    const teacherName = document.getElementById("teacher-name").value;
    const subject = document.getElementById("subject").value;
    const className = document.getElementById("class").value;

    if (teacherName && subject && className && currentPeriodKey) {
        schedule[currentPeriodKey] = {
            teacher: teacherName,
            subject,
            class: className,
            date: new Date().toLocaleDateString("ar-EG")
        };

        renderSchedule();
        document.getElementById("booking-form").style.display = "none";
        document.getElementById("notification").textContent = "تم الحجز بنجاح!";
        document.getElementById("notification").style.display = "block";
    } else {
        alert("يرجى ملء جميع الحقول!");
    }
}

// بدء التشغيل
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const currentWeek = `${today.getFullYear()}-W${Math.ceil((today.getDate() - today.getDay() + 1) / 7)}`;
    document.getElementById("week").value = currentWeek;
    updateWeekDates(currentWeek);
    renderSchedule();
});

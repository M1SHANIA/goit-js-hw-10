import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector('[data-start]');
const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');

let countdownInterval;
let userSelectedDate;

startButton.disabled = true;

flatpickr(datetimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];

        if (userSelectedDate < new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });

            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    },
});

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}


function startCountdown() {
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeDifference = userSelectedDate - now;

        if (timeDifference <= 0) {
            clearInterval(countdownInterval);
            displayTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            iziToast.success({
                title: 'Countdown Finished',
                message: 'The countdown has reached zero.',
            });
            startButton.disabled = true;
            datetimePicker.disabled = false;
        } else {
            const timeRemaining = convertMs(timeDifference);
            displayTime(timeRemaining);
        }
    }, 1000);
}

function displayTime({ days, hours, minutes, seconds }) {
    timerDays.textContent = addLeadingZero(days);
    timerHours.textContent = addLeadingZero(hours);
    timerMinutes.textContent = addLeadingZero(minutes);
    timerSeconds.textContent = addLeadingZero(seconds);
}

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    datetimePicker.disabled = true;
    startCountdown();
});

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.querySelector(".form").addEventListener("submit", function (event) {
    event.preventDefault();

    const delay = parseInt(this.elements.delay.value);
    const state = this.elements.state.value;

    const snackbarPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });

    snackbarPromise
        .then((delay) => {
            iziToast.success({
                title: "Fulfilled promise",
                message: `✅ Fulfilled promise in ${delay}ms`,
            });
        })
        .catch((delay) => {
            iziToast.error({
                title: "Rejected promise",
                message: `❌ Rejected promise in ${delay}ms`,
            });
        });
    event.target.reset();
});


const API = "http://localhost:3000/appointments";

const form = document.getElementById("appointmentForm");
const list = document.getElementById("appointmentList");
const message = document.getElementById("message");
const sortBtn = document.getElementById("sortBtn");

// Display messages
function showMessage(text, color = "green") {
    message.textContent = text;
    message.style.color = color;
}

// GET: Retrieve appointments
async function loadAppointments() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Unable to load appointments");
        }

        const appointments = await response.json();
        displayAppointments(appointments);

    } catch (error) {
        showMessage(error.message, "red");
    }
}

// Display records using DOM manipulation
function displayAppointments(appointments) {
    list.innerHTML = "";

    if (appointments.length === 0) {
        list.textContent = "No appointments found.";
        return;
    }

    appointments.forEach(item => {
        const div = document.createElement("div");
        div.className = "appointment";

        const details = document.createElement("p");

        details.textContent =
            `Owner: ${item.owner} | Pet: ${item.pet} |
            Service: ${item.service} | Date: ${item.date} |
            Status: ${item.status}`;

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirm";

        confirmBtn.addEventListener("click", () => {
            updateStatus(item.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            deleteAppointment(item.id);
        });

        div.append(details, confirmBtn, deleteBtn);
        list.appendChild(div);
    });
}

// POST: Add new appointment
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const owner = document.getElementById("owner").value.trim();
    const pet = document.getElementById("pet").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;

    if (!owner || !pet || !service || !date) {
        showMessage("Please fill all fields", "red");
        return;
    }

    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    if (date < localToday) {
        showMessage("Please select a future date", "red");
        return;
    }

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                owner,
                pet,
                service,
                date,
                status: "Pending"
            })
        });

        if (!response.ok) {
            throw new Error("Booking failed");
        }

        form.reset();
        showMessage("Appointment booked successfully!");
        loadAppointments();

    } catch (error) {
        showMessage(error.message, "red");
    }
});

// PATCH: Update appointment status
async function updateStatus(id) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "Confirmed"
            })
        });

        if (!response.ok) {
            throw new Error("Status update failed");
        }

        showMessage("Appointment confirmed!");
        loadAppointments();

    } catch (error) {
        showMessage(error.message, "red");
    }
}

// DELETE: Remove appointment
async function deleteAppointment(id) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        showMessage("Appointment deleted!");
        loadAppointments();

    } catch (error) {
        showMessage(error.message, "red");
    }
}

// Sort appointments by date
async function sortAppointments() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Unable to sort appointments");
        }

        const appointments = await response.json();

        appointments.sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        displayAppointments(appointments);

    } catch (error) {
        showMessage(error.message, "red");
    }
}

sortBtn.addEventListener("click", sortAppointments);

// Load appointments when page opens
loadAppointments();

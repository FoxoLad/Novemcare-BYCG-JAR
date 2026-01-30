let selectedDoctor = null;

const doctorButtons = document.querySelectorAll(".doctor-btn");
const appointmentsList = document.getElementById("appointmentsList");

// Doctor selection
doctorButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    doctorButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    // .trim() ensures "Dr. Reyes" matches exactly without hidden spaces
    selectedDoctor = btn.textContent.trim(); 
    renderAppointments();
  });
});

// Render today's appointments
function renderAppointments() {
  const appointments = getAppointments();
  
  // FIX: Use local date (YYYY-MM-DD) to match patient.js and admin.js
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const filtered = appointments.filter(a =>
    a.doctor === selectedDoctor &&
    a.date === today &&
    a.status === "scheduled"
  );

  appointmentsList.innerHTML = "";

  if (!selectedDoctor) {
    appointmentsList.innerHTML = "<p class='muted'>Selecciona un doctor para ver las citas.</p>";
    return;
  }

  if (filtered.length === 0) {
    appointmentsList.innerHTML = `<p class='muted'>No hay citas programadas para el ${today}.</p>`;
    return;
  }

  filtered.forEach(a => {
    const card = document.createElement("div");
    card.className = "appointment-card";

    card.innerHTML = `
      <p><strong>Paciente:</strong> ${a.patient}</p>
      <p><strong>Hora:</strong> ${a.time}</p>
      <p><strong>Motivo:</strong> ${a.reason || "No especificado"}</p>
      <button class="primary-btn">Completar cita</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      completeAppointment(a.id);
    });

    appointmentsList.appendChild(card);
  });
}

// Complete appointment
function completeAppointment(id) {
  const reason = prompt("Motivo de finalización de la cita:");

  if (!reason || !reason.trim()) {
    alert("El motivo es obligatorio.");
    return;
  }

  const appointments = getAppointments();
  const appointment = appointments.find(a => a.id === id);

  if (appointment) {
    appointment.status = "completed";
    appointment.completionReason = reason;
    saveAppointments(appointments);
    renderAppointments();
  }
}

// Helpers
function getAppointments() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

function saveAppointments(data) {
  localStorage.setItem("appointments", JSON.stringify(data));
}
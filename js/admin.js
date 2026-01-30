const table = document.getElementById("appointmentsTable");
const form = document.getElementById("adminForm");

const idInput = document.getElementById("appointmentId");
const patientInput = document.getElementById("patientInput");
const doctorInput = document.getElementById("doctorInput");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const reasonInput = document.getElementById("reasonInput");

renderTable();

// Submit form (create or edit)
form.addEventListener("submit", e => {
  e.preventDefault();

  if (!patientInput.value || !doctorInput.value || !dateInput.value || !timeInput.value) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  const appointments = getAppointments();

  if (idInput.value) {
    const appointment = appointments.find(a => a.id == idInput.value);
    appointment.patient = patientInput.value;
    appointment.doctor = doctorInput.value;
    appointment.date = dateInput.value;
    appointment.time = timeInput.value;
    appointment.reason = reasonInput.value;
  } else {
    appointments.push({
      id: Date.now(),
      patient: patientInput.value,
      doctor: doctorInput.value,
      date: dateInput.value,
      time: timeInput.value,
      reason: reasonInput.value,
      status: "scheduled"
    });
  }

  saveAppointments(appointments);
  form.reset();
  idInput.value = "";
  renderTable();
});

// Render table
function renderTable() {
  const appointments = getAppointments();
  table.innerHTML = "";

  appointments.forEach(a => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${a.patient}</td>
      <td>${a.doctor}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td>${a.status}</td>
      <td>
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Eliminar</button>
      </td>
    `;

    row.querySelector(".btn-edit").addEventListener("click", () => loadAppointment(a));
    row.querySelector(".btn-delete").addEventListener("click", () => deleteAppointment(a.id));

    table.appendChild(row);
  });
}

// Load appointment into form
function loadAppointment(a) {
  idInput.value = a.id;
  patientInput.value = a.patient;
  doctorInput.value = a.doctor;
  dateInput.value = a.date;
  timeInput.value = a.time;
  reasonInput.value = a.reason || "";
}

// Delete appointment
function deleteAppointment(id) {
  if (!confirm("¿Eliminar esta cita?")) return;

  let appointments = getAppointments();
  appointments = appointments.filter(a => a.id !== id);
  saveAppointments(appointments);
  renderTable();
}

// Helpers
function getAppointments() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

function saveAppointments(data) {
  localStorage.setItem("appointments", JSON.stringify(data));
}

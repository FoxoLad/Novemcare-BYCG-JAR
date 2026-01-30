// Selected doctor
let selectedDoctor = null;

// Get elements
const doctorButtons = document.querySelectorAll(".doctor-btn");
const form = document.querySelector(".appointment-form");

// Doctor selection
doctorButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    doctorButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedDoctor = btn.textContent.trim();
    console.log("Doctor selected:", selectedDoctor);
  });
});

// Form submission
form.addEventListener("submit", e => {
  e.preventDefault();

  const patient = form.querySelector('input[type="text"]').value.trim();
  const date = form.querySelector('input[type="date"]').value;
  const time = form.querySelector('input[type="time"]').value;
  const reason = form.querySelector("textarea").value.trim();

  if (!patient || !date || !time || !selectedDoctor) {
    alert("Por favor selecciona un doctor y completa todos los campos.");
    return;
  }

  const appointments = getAppointments();

  const duplicate = appointments.some(a =>
    a.doctor === selectedDoctor &&
    a.date === date &&
    a.time === time
  );

  if (duplicate) {
    alert("Ese horario ya está ocupado para este doctor.");
    return;
  }

  const newAppointment = {
    id: Date.now(),
    patient,
    doctor: selectedDoctor,
    date,
    time,
    reason,
    status: "scheduled"
  };

  appointments.push(newAppointment);
  saveAppointments(appointments);

  form.reset();
  selectedDoctor = null;
  doctorButtons.forEach(b => b.classList.remove("selected"));

  alert("Cita agendada correctamente.");
});

// Helpers
function getAppointments() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

function saveAppointments(data) {
  localStorage.setItem("appointments", JSON.stringify(data));
}

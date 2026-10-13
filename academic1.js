// Academic Honesty — prototipo académico de demostración.
// Las calificaciones se guardan en este navegador. No uses información sensible.
// El formulario del espacio seguro NO transmite ni guarda mensajes.

const STORAGE_KEY = "academicHonestyDemoGrades";
const gradeForm = document.querySelector("#grade-form");
const gradesList = document.querySelector("#grades-list");
const averageScore = document.querySelector("#average-score");
const ringScore = document.querySelector("#ring-score");
const scoreRing = document.querySelector("#score-ring");
const feedbackMessage = document.querySelector("#feedback-message");
const clearGradesButton = document.querySelector("#clear-grades");

function loadGrades() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

let grades = loadGrades();

function saveGrades() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
  } catch (error) {
    console.warn("No fue posible guardar los registros en este navegador.");
  }
}

function getFeedback(average) {
  if (average >= 90) {
    return {
      title: "¡Vas por muy buen camino!",
      message: "Tus resultados son sólidos. Sigue practicando la honestidad académica: reconoce tus fuentes, organiza tus tiempos y ayuda a crear un entorno de aprendizaje responsable."
    };
  }
  if (average >= 80) {
    return {
      title: "Tienes una buena base.",
      message: "Identifica qué actividades te resultan más difíciles y reserva tiempo para repasarlas. Si tienes dudas sobre una tarea o una fuente, pide orientación antes de entregar."
    };
  }
  if (average >= 70) {
    return {
      title: "Hay oportunidades para mejorar.",
      message: "Divide tus tareas en pasos pequeños, consulta los criterios de evaluación y busca apoyo con anticipación. Mejorar es un proceso y pedir ayuda es una decisión responsable."
    };
  }
  return {
    title: "Vamos paso a paso.",
    message: "Empieza por detectar un tema que necesites reforzar. Habla con tu docente o equipo de apoyo y crea un plan realista. Una calificación no define tu capacidad de aprender."
  };
}

function renderGrades() {
  gradesList.replaceChildren();

  if (grades.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Aún no hay calificaciones registradas.";
    gradesList.append(empty);
    averageScore.textContent = "—";
    ringScore.textContent = "—";
    scoreRing.style.background = "conic-gradient(var(--blue) 0deg, #eaf0fa 0deg)";
    feedbackMessage.innerHTML = '<span class="feedback-emoji">✦</span><div><strong>Tu progreso empieza aquí</strong><p>Agrega una calificación para recibir una sugerencia personalizada.</p></div>';
    return;
  }

  const average = grades.reduce((sum, item) => sum + item.grade, 0) / grades.length;
  const roundedAverage = Math.round(average);
  averageScore.textContent = roundedAverage;
  ringScore.textContent = roundedAverage;
  scoreRing.style.background = `conic-gradient(var(--blue) ${average * 3.6}deg, #eaf0fa 0deg)`;

  const feedback = getFeedback(average);
  feedbackMessage.replaceChildren();
  const icon = document.createElement("span");
  icon.className = "feedback-emoji";
  icon.textContent = "✦";
  const content = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = feedback.title;
  const paragraph = document.createElement("p");
  paragraph.textContent = feedback.message;
  content.append(title, paragraph);
  feedbackMessage.append(icon, content);

  [...grades].reverse().forEach((item) => {
    const li = document.createElement("li");
    li.className = "grade-item";
    const details = document.createElement("div");
    const subject = document.createElement("strong");
    subject.textContent = item.subject;
    const meta = document.createElement("small");
    meta.textContent = `${item.type} · ${item.date}`;
    const value = document.createElement("span");
    value.className = "grade-value";
    value.textContent = item.grade;
    details.append(subject, meta);
    li.append(details, value);
    gradesList.append(li);
  });
}

gradeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const subjectInput = document.querySelector("#subject");
  const gradeInput = document.querySelector("#grade");
  const typeInput = document.querySelector("#grade-type");
  const subject = subjectInput.value.trim();
  const grade = Number(gradeInput.value);

  if (!subject || gradeInput.value === "" || !Number.isFinite(grade) || grade < 0 || grade > 100) {
    alert("Escribe una materia y una calificación entre 0 y 100.");
    return;
  }

  grades.push({
    subject,
    grade,
    type: typeInput.value,
    date: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })
  });
  saveGrades();
  renderGrades();
  gradeForm.reset();
  document.querySelector("#subject").focus();
});

clearGradesButton.addEventListener("click", () => {
  if (grades.length === 0) return;
  const confirmed = confirm("¿Quieres borrar las calificaciones guardadas en este navegador?");
  if (!confirmed) return;
  grades = [];
  saveGrades();
  renderGrades();
});

const safeForm = document.querySelector("#safe-form");
const messageInput = document.querySelector("#message");
const charCount = document.querySelector("#char-count");
const safeStatus = document.querySelector("#safe-status");

messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length}/1200`;
});

safeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const topic = document.querySelector("#topic").value;
  const consent = document.querySelector("#privacy-consent").checked;
  const message = messageInput.value.trim();

  safeStatus.className = "form-status";
  if (!topic || !message || !consent) {
    safeStatus.textContent = "Completa el tema, el mensaje y la casilla del aviso para continuar.";
    safeStatus.classList.add("error");
    return;
  }

  // No se guarda ni se envía el mensaje. Solo se muestra una confirmación.
  safeStatus.textContent = "Demostración completada: tu mensaje no se envió ni se guardó. En una versión real se necesitaría un canal seguro de orientación.";
  safeStatus.classList.add("success");
  safeForm.reset();
  charCount.textContent = "0/1200";
});

const cases = {
  collaboration: {
    title: "¿Colaboración o copia?",
    description: "Tu equipo comparte ideas para un trabajo. Una persona te ofrece copiar párrafos de su entrega anterior porque el tema es parecido. La entrega es mañana.",
    options: [
      { text: "Copiar los párrafos y cambiar algunas palabras.", feedback: "Cambiar unas palabras no convierte el trabajo ajeno en propio. Considera las reglas de la actividad y reconoce correctamente las fuentes." },
      { text: "Usar la idea como punto de partida, consultar fuentes y redactar tu propio análisis.", feedback: "Buena alternativa: elaboras tu análisis, verificas la información y citas las fuentes que realmente consultaste." },
      { text: "Preguntar al docente qué colaboración y fuentes están permitidas.", feedback: "Pedir aclaración es una opción responsable, especialmente cuando las instrucciones no son claras." }
    ]
  },
  ai: {
    title: "Fuentes y uso responsable de IA",
    description: "Usaste una herramienta de IA para explorar un tema, pero no estás seguro de si puedes incluir parte de la respuesta en tu tarea.",
    options: [
      { text: "Entregar la respuesta sin revisar ni mencionar el uso de la herramienta.", feedback: "Esto puede ocultar cómo se produjo el trabajo y dejar errores sin verificar. Revisa las reglas de la materia antes de entregar." },
      { text: "Verificar la información, consultar fuentes confiables y seguir las reglas de declaración de uso.", feedback: "Buena práctica: verificas la exactitud y respetas las reglas del curso sobre el uso y la declaración de herramientas." },
      { text: "Preguntar al docente cómo se permite utilizar IA en esa actividad.", feedback: "Es una opción responsable. Las reglas pueden cambiar entre materias y tipos de actividad." }
    ]
  },
  pressure: {
    title: "Presión académica y decisiones",
    description: "Tienes varias entregas la misma semana y temes no terminar una tarea a tiempo. Un compañero te ofrece compartir su archivo para que lo presentes como tuyo.",
    options: [
      { text: "Entregar el archivo del compañero como si fuera tuyo.", feedback: "La presión es real, pero presentar trabajo ajeno como propio no resuelve el problema de fondo. Busca alternativas honestas." },
      { text: "Priorizar tareas, explicar la situación y pedir orientación o una extensión si es posible.", feedback: "Buena alternativa: comunicas la situación, exploras opciones legítimas y haces un plan de trabajo realista." },
      { text: "Dividir la tarea en pasos y pedir ayuda para entender lo que te falta.", feedback: "Pedir apoyo a tiempo puede ayudarte a avanzar sin comprometer tu integridad académica." }
    ]
  }
};

const caseDialog = document.querySelector("#case-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogOptions = document.querySelector("#dialog-options");
const caseFeedback = document.querySelector("#case-feedback");
const finishCase = document.querySelector("#finish-case");
let activeCase = null;
let selectedOption = null;

document.querySelectorAll("[data-event]").forEach((button) => {
  button.addEventListener("click", () => {
    activeCase = cases[button.dataset.event];
    selectedOption = null;
    dialogTitle.textContent = activeCase.title;
    dialogDescription.textContent = activeCase.description;
    dialogOptions.replaceChildren();
    caseFeedback.textContent = "";
    finishCase.textContent = "Reflexionar sobre el caso";
    activeCase.options.forEach((option, index) => {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.className = "case-option";
      optionButton.textContent = option.text;
      optionButton.addEventListener("click", () => {
        selectedOption = index;
        dialogOptions.querySelectorAll(".case-option").forEach((el) => el.classList.remove("selected"));
        optionButton.classList.add("selected");
        caseFeedback.textContent = option.feedback;
        finishCase.textContent = "Ver reflexión final";
      });
      dialogOptions.append(optionButton);
    });
    if (typeof caseDialog.showModal === "function") caseDialog.showModal();
    else alert("Tu navegador no admite este cuadro de diálogo. Prueba una versión actualizada.");
  });
});

finishCase.addEventListener("click", () => {
  if (selectedOption === null) {
    caseFeedback.textContent = "Elige una opción para explorar sus posibles consecuencias. No siempre hay una única respuesta sencilla: analiza las reglas, la transparencia y el impacto.";
    return;
  }
  caseFeedback.textContent += " Reflexiona: ¿a quién afecta esta decisión?, ¿qué reglas aplican?, ¿qué otra opción honesta puedes tomar?";
  finishCase.textContent = "Cerrar caso";
  finishCase.onclick = () => caseDialog.close();
});

document.querySelector("#close-dialog").addEventListener("click", () => caseDialog.close());
caseDialog.addEventListener("click", (event) => {
  if (event.target === caseDialog) caseDialog.close();
});

const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  });
});

renderGrades();

tailwind.config = {
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",
        "gold-dark": "#B8860B",
      },
    },
  },
};

// Modal de l'ajout des etudiants

function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}


// Fonction de toggle de Menu mobile

function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({
    behavior: "smooth",
  });
}

function handleSubmit(event) {
  event.preventDefault();

  // Animation de soumission
  const button = event.target.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.textContent = "Traitement en cours...";
  button.disabled = true;

  setTimeout(() => {
    alert(
      "Candidature reçue ! Notre équipe d'admission examinera votre dossier et vous contactera sous 48h."
    );
    button.textContent = originalText;
    button.disabled = false;
    event.target.reset();
  }, 2000);
}

// Animation au scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.classList.add("bg-opacity-95");
  } else {
    nav.classList.remove("bg-opacity-95");
  }
});

// Données des horaires par promotion
const schedules = {
  1: {
    title: "1ère Année",
    schedule: [
      {
        time: "08:00-10:00",
        lundi: "Anatomie",
        mardi: "Physiologie",
        mercredi: "Chimie",
        jeudi: "Biologie",
        vendredi: "TP Anatomie",
      },
      {
        time: "10:15-12:15",
        lundi: "Physiologie",
        mardi: "Anatomie",
        mercredi: "Encadrement",
        jeudi: "Chimie",
        vendredi: "TP Physiologie",
      },
      {
        time: "14:00-16:00",
        lundi: "Biologie",
        mardi: "Encadrement",
        mercredi: "Anatomie",
        jeudi: "Physiologie",
        vendredi: "Séminaire",
      },
      {
        time: "16:15-18:15",
        lundi: "Encadrement",
        mardi: "TP",
        mercredi: "Biologie",
        jeudi: "Encadrement",
        vendredi: "Libre",
      },
    ],
  },
  2: {
    title: "2ème Année",
    schedule: [
      {
        time: "08:00-10:00",
        lundi: "Pathologie",
        mardi: "Pharmacologie",
        mercredi: "Sémiologie",
        jeudi: "Anatomie Path",
        vendredi: "TP Pathologie",
      },
      {
        time: "10:15-12:15",
        lundi: "Pharmacologie",
        mardi: "Sémiologie",
        mercredi: "Encadrement",
        jeudi: "Pathologie",
        vendredi: "TP Pharmacologie",
      },
      {
        time: "14:00-16:00",
        lundi: "Sémiologie",
        mardi: "Encadrement",
        mercredi: "Pathologie",
        jeudi: "Pharmacologie",
        vendredi: "Stage",
      },
      {
        time: "16:15-18:15",
        lundi: "Encadrement",
        mardi: "Stage",
        mercredi: "Sémiologie",
        jeudi: "Encadrement",
        vendredi: "Libre",
      },
    ],
  },
  3: {
    title: "3ème Année",
    schedule: [
      {
        time: "08:00-10:00",
        lundi: "Médecine Interne",
        mardi: "Chirurgie",
        mercredi: "Pédiatrie",
        jeudi: "Gynécologie",
        vendredi: "Stage Clinique",
      },
      {
        time: "10:15-12:15",
        lundi: "Chirurgie",
        mardi: "Pédiatrie",
        mercredi: "Encadrement",
        jeudi: "Médecine Interne",
        vendredi: "Stage Clinique",
      },
      {
        time: "14:00-16:00",
        lundi: "Pédiatrie",
        mardi: "Encadrement",
        mercredi: "Chirurgie",
        jeudi: "Gynécologie",
        vendredi: "Stage Clinique",
      },
      {
        time: "16:15-18:15",
        lundi: "Encadrement",
        mardi: "Stage",
        mercredi: "Médecine Interne",
        jeudi: "Encadrement",
        vendredi: "Libre",
      },
    ],
  },
};

// Données des coordinations par promotion
const coordinations = {
  1: {
    title: "1ère Année",
    coordinator: {
      name: "Dr. Sophie PREMIÈRE",
      title: "Coordinatrice 1ère Année",
      email: "premiere@ede-medecine.edu",
      phone: "+XXX XX XX XX 01",
    },
    assistant: {
      name: "Mme. Claire ASSISTANT",
      title: "Assistante Pédagogique",
      email: "assistant1@ede-medecine.edu",
      phone: "+XXX XX XX XX 02",
    },
  },
  2: {
    title: "2ème Année",
    coordinator: {
      name: "Prof. Michel DEUXIÈME",
      title: "Coordinateur 2ème Année",
      email: "deuxieme@ede-medecine.edu",
      phone: "+XXX XX XX XX 03",
    },
    assistant: {
      name: "M. Paul SUPPORT",
      title: "Assistant Pédagogique",
      email: "assistant2@ede-medecine.edu",
      phone: "+XXX XX XX XX 04",
    },
  },
  3: {
    title: "3ème Année",
    coordinator: {
      name: "Dr. Fatima TROISIÈME",
      title: "Coordinatrice 3ème Année",
      email: "troisieme@ede-medecine.edu",
      phone: "+XXX XX XX XX 05",
    },
    assistant: {
      name: "Mme. Aisha CLINIQUE",
      title: "Assistante Clinique",
      email: "assistant3@ede-medecine.edu",
      phone: "+XXX XX XX XX 06",
    },
  },
};

// Fonction pour changer d'onglet
function showTab(tabName) {
  // Cacher tous les contenus
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });

  // Réinitialiser tous les onglets
  document.querySelectorAll('[id^="tab-"]').forEach((tab) => {
    tab.classList.remove("active-tab");
    tab.classList.add("border-transparent", "text-gray-500");
  });

  // Afficher le contenu sélectionné
  document.getElementById(`content-${tabName}`).classList.remove("hidden");

  // Activer l'onglet sélectionné
  const activeTab = document.getElementById(`tab-${tabName}`);
  activeTab.classList.add("active-tab");
  activeTab.classList.remove("border-transparent", "text-gray-500");
}

// Fonction pour mettre à jour la promotion
function updatePromotion() {
  const promotion = document.getElementById("promotionSelect").value;
  updateSchedule(promotion);
  updateCoordination(promotion);
}

// Fonction pour mettre à jour l'horaire
function updateSchedule(promotion) {
  const scheduleData = schedules[promotion] || schedules[1];
  document.getElementById("promotion-title").textContent = scheduleData.title;

  const tbody = document.getElementById("schedule-body");
  tbody.innerHTML = "";

  scheduleData.schedule.forEach((row) => {
    const tr = document.createElement("tr");
    tr.className = "border-b hover:bg-gray-50";
    tr.innerHTML = `
                    <td class="px-4 py-3 font-medium text-gold">${row.time}</td>
                    <td class="px-4 py-3">${row.lundi}</td>
                    <td class="px-4 py-3">${row.mardi}</td>
                    <td class="px-4 py-3">${row.mercredi}</td>
                    <td class="px-4 py-3">${row.jeudi}</td>
                    <td class="px-4 py-3">${row.vendredi}</td>
                `;
    tbody.appendChild(tr);
  });
}

// Fonction pour mettre à jour la coordination
function updateCoordination(promotion) {
  const coordData = coordinations[promotion] || coordinations[1];
  document.getElementById("coordination-title").textContent = coordData.title;

  const coordDiv = document.getElementById("promotion-coordination");
  coordDiv.innerHTML = `
                <h3 class="text-xl font-bold mb-4 flex items-center">
                    <span class="text-2xl mr-2">👨‍🎓</span>
                    Coordination ${coordData.title}
                </h3>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="flex items-center space-x-4">
                        <div class="w-16 h-16 gradient-gold rounded-full flex items-center justify-center">
                            <span class="text-black font-bold text-xl">${promotion}</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-lg">${coordData.coordinator.name}</h4>
                            <p class="text-gray-600">${coordData.coordinator.title}</p>
                            <p class="text-sm text-gold">${coordData.coordinator.email}</p>
                            <p class="text-sm text-gray-500">${coordData.coordinator.phone}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <span class="text-gray-600 font-bold text-xl">A</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-lg">${coordData.assistant.name}</h4>
                            <p class="text-gray-600">${coordData.assistant.title}</p>
                            <p class="text-sm text-gold">${coordData.assistant.email}</p>
                            <p class="text-sm text-gray-500">${coordData.assistant.phone}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-6 p-4 bg-gold bg-opacity-10 rounded-lg">
                    <h4 class="font-bold mb-2">Heures de permanence:</h4>
                    <p class="text-sm text-gray-700">Lundi - Vendredi: 9h00 - 17h00</p>
                    <p class="text-sm text-gray-700">Bureau: Bâtiment A, 2ème étage</p>
                </div>
            `;
}

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  updatePromotion();
});

// ===== ADMIN_DASHBOARD =====

// Gestion d'affichage des sections
const tabs = document.querySelectorAll(".tab-btn");
const TabSections = document.querySelectorAll(".tab-section");

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log("tu m_as cliqueé");

    tabs.forEach((b) => b.classList.remove("bg-blue-600", "text-white"));
    tabs.forEach((b) => b.classList.add("bg-gray-300", "text-black"));
    btn.classList.remove("bg-gray-300", "text-black");
    btn.classList.add("bg-blue-600", "text-white");

    TabSections.forEach((sec) => sec.classList.add("hidden"));
    document.getElementById(btn.dataset.target).classList.remove("hidden");
  });
});

// == TABLEAU DE BORD ==
// == GERER LES ETUDIANTS ==

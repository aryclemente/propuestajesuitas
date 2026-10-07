// -------------------------------------------------------------------------- //
// JESUITAS VENEZUELA - INTERACTIVE APP LOGIC                                 //
// STITCH DESIGN SYSTEM INTEGRATION                                           //
// -------------------------------------------------------------------------- //

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCounters();
  initDirectoryFilter();
  initDonationCalculator();
  initModals();
});

/* Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }
}

/* Animated Counters for Stats */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  function runCounter() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 50;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerHTML = Math.ceil(count).toLocaleString() + '<span>' + suffix + '</span>';
          setTimeout(updateCount, 25);
        } else {
          counter.innerHTML = target.toLocaleString() + '<span>' + suffix + '</span>';
        }
      };

      updateCount();
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        runCounter();
        animated = true;
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* Directory Data & Interactive Search System */
const directoryData = [
  { title: "UCAB Caracas - Universidad Católica Andrés Bello", category: "educacion", state: "Caracas", address: "Montalbán, Caracas", contact: "info@ucab.edu.ve" },
  { title: "UCAB Guayana", category: "educacion", state: "Bolívar", address: "Puerto Ordaz, Estado Bolívar", contact: "infoguayana@ucab.edu.ve" },
  { title: "Fe y Alegría - Oficina Nacional", category: "educacion", state: "Caracas", address: "Esquina Luneta a Mercedes, Caracas", contact: "feyalegria@feyalegria.org.ve" },
  { title: "Colegio San Ignacio", category: "colegios", state: "Caracas", address: "Av. Santa Teresa de Jesús, La Castellana", contact: "contacto@sanignacio.edu.ve" },
  { title: "Colegio Gonzaga", category: "colegios", state: "Zulia", address: "Maracaibo, Estado Zulia", contact: "administracion@gonzaga.edu.ve" },
  { title: "Parroquia San Francisco (Iglesia de San Francisco)", category: "parroquias", state: "Caracas", address: "Av. Universidad, Centro de Caracas", contact: "sanfranciscocss@jesuitas.org.ve" },
  { title: "Centro Gumilla (Investigación y Acción Social)", category: "social", state: "Caracas", address: "Esquina de Mijares, Alcabala a Urapal", contact: "contacto@gumilla.org" },
  { title: "Servicio Jesuita a Refugiados (JRS Venezuela)", category: "social", state: "Táchira", address: "San Cristóbal y Frontera", contact: "jrs.venezuela@jrs.net" },
  { title: "Casa de Espiritualidad Loyola", category: "espiritualidad", state: "Miranda", address: "Los Teques, Estado Miranda", contact: "espiritualidad@jesuitas.org.ve" },
  { title: "Huellas - Movimiento Juvenil Ignaciano", category: "pastoral", state: "Caracas", address: "Sede Central, Caracas", contact: "coordinacion@huellas.org.ve" },
  { title: "Parroquia Jesús Obrero", category: "parroquias", state: "Caracas", address: "Catia, Caracas", contact: "jesusobrero@jesuitas.org.ve" },
  { title: "Instituto Radiofónico Fe y Alegría (IRFA Lara)", category: "educacion", state: "Lara", address: "Barquisimeto, Estado Lara", contact: "irfa@feyalegria.org.ve" },
  { title: "Centro Loyola Mérida", category: "espiritualidad", state: "Mérida", address: "Sector Hechicera, Mérida", contact: "loyolamerida@jesuitas.org.ve" },
  { title: "Instituto Universitario Jesús Obrero (IUJO Barquisimeto)", category: "educacion", state: "Lara", address: "Barquisimeto, Estado Lara", contact: "contacto@iujo.edu.ve" }
];

function initDirectoryFilter() {
  const searchInput = document.getElementById('directorySearch');
  const categorySelect = document.getElementById('directoryCategory');
  const stateSelect = document.getElementById('directoryState');
  const resultsContainer = document.getElementById('directoryResults');

  if (!resultsContainer) return;

  function renderResults(data) {
    resultsContainer.innerHTML = '';
    if (data.length === 0) {
      resultsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; color: var(--primary-sanguine);"></i>
        <p>No se encontraron obras o instituciones que coincidan con los filtros seleccionados.</p>
      </div>`;
      return;
    }

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'directory-item';
      const sectorBadge = formatSectorBadge(item.category);
      card.innerHTML = `
        ${sectorBadge}
        <h4 class="dir-title">${item.title}</h4>
        <div class="dir-location">
          <i class="fas fa-map-marker-alt" style="color: var(--primary-sanguine);"></i> ${item.address} (${item.state})
        </div>
        <div class="dir-contact">
          <i class="fas fa-envelope"></i> ${item.contact}
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  }

  function filterData() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCategory = categorySelect ? categorySelect.value : 'all';
    const selectedState = stateSelect ? stateSelect.value : 'all';

    const filtered = directoryData.filter(item => {
      const matchesQuery = item.title.toLowerCase().includes(query) || 
                           item.address.toLowerCase().includes(query) || 
                           item.state.toLowerCase().includes(query);
      const matchesCategory = (selectedCategory === 'all') || (item.category === selectedCategory);
      const matchesState = (selectedState === 'all') || (item.state === selectedState);

      return matchesQuery && matchesCategory && matchesState;
    });

    renderResults(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterData);
  if (categorySelect) categorySelect.addEventListener('change', filterData);
  if (stateSelect) stateSelect.addEventListener('change', filterData);

  renderResults(directoryData);
}

function formatSectorBadge(cat) {
  const map = {
    'educacion': '<span class="sector-chip educacion"><i class="fas fa-graduation-cap"></i> Educación</span>',
    'colegios': '<span class="sector-chip educacion"><i class="fas fa-school"></i> Colegio Ignaciano</span>',
    'parroquias': '<span class="sector-chip pastoral"><i class="fas fa-church"></i> Parroquia</span>',
    'social': '<span class="sector-chip social"><i class="fas fa-hands-helping"></i> Acción Social</span>',
    'espiritualidad': '<span class="sector-chip pastoral"><i class="fas fa-pray"></i> Casa de Retiro</span>',
    'pastoral': '<span class="sector-chip juventud"><i class="fas fa-users"></i> Pastoral Juvenil</span>'
  };
  return map[cat] || `<span class="sector-chip educacion">${cat}</span>`;
}

/* Donation Calculator */
function initDonationCalculator() {
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (customInput) customInput.value = btn.getAttribute('data-val');
    });
  });
}

/* Modals Handler */
function initModals() {
  const donateModal = document.getElementById('donateModal');
  const openDonateBtns = document.querySelectorAll('.trigger-donate-modal');
  const closeBtns = document.querySelectorAll('.modal-close');

  openDonateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (donateModal) donateModal.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.classList.remove('active');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
    }
  });
}

/* Modal Helper Function */
window.openModalWithContent = function(title, bodyHtml) {
  const dynamicModal = document.getElementById('dynamicModal');
  if (dynamicModal) {
    document.getElementById('dynamicModalTitle').innerText = title;
    document.getElementById('dynamicModalBody').innerHTML = bodyHtml;
    dynamicModal.classList.add('active');
  }
};

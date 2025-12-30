/* ===============================
   UI: LOGO / NAVBAR / THEME
================================ */

const logo = document.getElementById('logo');
const navbar = document.getElementById('navbar');
const themeToggler = document.getElementById('theme-toggler');
const lightBtn = document.getElementById('theme-btn-light');
const darkBtn = document.getElementById('theme-btn-dark');

// Scroll behavior - semplificato
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const switchPoint = 100; // Soglia più bassa per miglior risposta

    const hasScrolled = scrollY > switchPoint;
    
    logo.classList.toggle('scrolled', hasScrolled);
    navbar.classList.toggle('scrolled', hasScrolled);
    themeToggler.classList.toggle('scrolled', hasScrolled);
});

// Theme toggle
let isDark = false;

function updateTheme() {
    document.body.classList.toggle('dark-mode', isDark);
    
    // Aggiorna solo i pulsanti
    darkBtn.classList.toggle('active', isDark);
    lightBtn.classList.toggle('active', !isDark);
    
    // Non cambiare più lo sfondo del body
    // Lo sfondo animato gestirà i colori
}

lightBtn.addEventListener('click', () => {
    isDark = false;
    updateTheme();
    // Cambia colore scheme dello sfondo animato
    if (app && app.setColorScheme) {
        app.setColorScheme(1); // Tema chiaro
    }
});

darkBtn.addEventListener('click', () => {
    isDark = true;
    updateTheme();
    // Cambia colore scheme dello sfondo animato
    if (app && app.setColorScheme) {
        app.setColorScheme(2); // Tema scuro
    }
});

// Inizializza con tema chiaro
updateTheme();

/* ===============================
   RANDOM USER CONTROLS
================================ */

const recordSlider = document.getElementById('recordSlider');
const recordCount = document.getElementById('recordCount');
const loadBtn = document.getElementById('loadBtn');

const loader = document.getElementById('loader');
const userContent = document.getElementById('userContent');
const navigation = document.getElementById('navigation');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const userIndex = document.getElementById('userIndex');

let users = [];
let currentIndex = 0;

// Slider label
recordSlider.addEventListener('input', e => {
  recordCount.textContent = e.target.value;
});

/* ===============================
   NATIONALITY FILTER (FLAGS MAP)
================================ */

const natCheckboxes = document.querySelectorAll('input[name="nat"]');
const flagMarkers = document.querySelectorAll('.flag-marker');

// sync UI state (optional but clean)
function syncFlags() {
  flagMarkers.forEach(flag => {
    const forId = flag.getAttribute('for');
    const checkbox = document.getElementById(forId);
    if (!checkbox) return;

    flag.classList.toggle('active', checkbox.checked);
  });
}

// checkbox → UI
natCheckboxes.forEach(cb => {
  cb.addEventListener('change', syncFlags);
});

// flag click → checkbox already handled by <label>
flagMarkers.forEach(flag => {
  flag.addEventListener('click', () => {
    requestAnimationFrame(syncFlags);
  });
});

syncFlags();

/* ===============================
   LOAD USERS
================================ */

loadBtn.addEventListener('click', async () => {
  const numResults = recordSlider.value;

  // gender
  let gender = 'all';
  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    if (radio.checked) gender = radio.value;
  });

  // nationality
  const selectedNats = [...natCheckboxes]
    .filter(cb => cb.checked)
    .map(cb => cb.value.toLowerCase());

  if (!selectedNats.length) {
    alert('Please select at least one nationality');
    return;
  }

  loader.style.display = 'block';
  userContent.style.display = 'none';
  navigation.style.display = 'none';

  try {
    let url = `https://randomuser.me/api/?results=${numResults}&nat=${selectedNats.join(',')}`;
    if (gender !== 'all') url += `&gender=${gender}`;

    const res = await axios.get(url);
    users = res.data.results;
    currentIndex = 0;

    showUser(currentIndex);
    navigation.style.display = 'flex';
  } catch (err) {
    loader.textContent = 'Error loading users';
    console.error(err);
  }
});

/* ===============================
   USER DISPLAY
================================ */

window.addEventListener('DOMContentLoaded', async () => {
  loader.style.display = 'block';
  userContent.style.display = 'none';
  navigation.style.display = 'none';

  try {
    // Chiamo l'API per un solo utente
    const res = await axios.get('https://randomuser.me/api/?results=1');
    users = res.data.results;  // array con un solo elemento
    currentIndex = 0;

    // Mostra il primo (e unico) utente
    showUser(currentIndex);

    // Non serve navigazione per singolo utente
    navigation.style.display = 'none';
  } catch (err) {
    loader.textContent = 'Error loading user';
    console.error(err);
  }
});



function showUser(index) {
  const user = users[index];
  if (!user) return;

  document.getElementById('userPhoto').src = user.picture.large;
  document.getElementById('userName').textContent =
    `${user.name.first} ${user.name.last}`;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userPhone').textContent = user.phone;
  document.getElementById('userLocation').textContent =
    `${user.location.city}, ${user.location.country}`;
  document.getElementById('userAge').textContent = user.dob.age;
  document.getElementById('userNat').textContent = user.nat;

  userIndex.textContent = `${index + 1} / ${users.length}`;

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === users.length - 1;

  loader.style.display = 'none';
  userContent.style.display = 'flex';
}

/* ===============================
   NAVIGATION
================================ */

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showUser(currentIndex);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < users.length - 1) {
    currentIndex++;
    showUser(currentIndex);
  }
});

/* ===============================
   STATISTICS FUNCTIONALITY
================================ */

// Chart instances
let nationalityChart = null;
let ageChart = null;

// Statistics data
let statsData = {
  totalUsers: 0,
  users: [],
  nationalities: {},
  ages: [],
  genders: { male: 0, female: 0 },
  emailDomains: {}
};

// Initialize statistics
function initStatistics() {
  // Check if we're already loaded users
  if (users && users.length > 0) {
    updateStatistics(users);
  }
  
  // Set up intersection observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Observe statistics and about sections
  document.querySelectorAll('.statistics-section, .about-section').forEach(section => {
    observer.observe(section);
  });
  
  // Refresh stats button
  const refreshBtn = document.getElementById('refreshStats');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      if (users && users.length > 0) {
        updateStatistics(users);
      }
    });
  }
}

// Update statistics with new user data
function updateStatistics(userArray) {
  if (!userArray || userArray.length === 0) return;
  
  // Reset stats
  statsData = {
    totalUsers: userArray.length,
    users: userArray,
    nationalities: {},
    ages: [],
    genders: { male: 0, female: 0 },
    emailDomains: {},
    countries: new Set()
  };
  
  // Collect data
  userArray.forEach(user => {
    // Nationality
    const nat = user.nat;
    statsData.nationalities[nat] = (statsData.nationalities[nat] || 0) + 1;
    
    // Age
    statsData.ages.push(user.dob.age);
    
    // Gender
    if (user.gender === 'male') {
      statsData.genders.male++;
    } else {
      statsData.genders.female++;
    }
    
    // Email domain
    const domain = user.email.split('@')[1];
    statsData.emailDomains[domain] = (statsData.emailDomains[domain] || 0) + 1;
    
    // Country
    statsData.countries.add(user.location.country);
  });
  
  // Update UI
  updateStatsUI();
  updateCharts();
}

// Update statistics UI
function updateStatsUI() {
  // Total users
  document.getElementById('totalUsers').textContent = statsData.totalUsers.toLocaleString();
  
  // Average age
  const avgAge = statsData.ages.length > 0 
    ? Math.round(statsData.ages.reduce((a, b) => a + b, 0) / statsData.ages.length)
    : 0;
  document.getElementById('avgAge').textContent = avgAge;
  
  // Top country
  let topCountry = '--';
  let maxCount = 0;
  const countryCounts = {};
  
  statsData.users.forEach(user => {
    const country = user.location.country;
    countryCounts[country] = (countryCounts[country] || 0) + 1;
    if (countryCounts[country] > maxCount) {
      maxCount = countryCounts[country];
      topCountry = country;
    }
  });
  document.getElementById('topCountry').textContent = topCountry;
  
  // Gender ratio
  const malePercent = statsData.totalUsers > 0 
    ? Math.round((statsData.genders.male / statsData.totalUsers) * 100)
    : 50;
  const femalePercent = 100 - malePercent;
  document.getElementById('genderRatio').textContent = `${malePercent}/${femalePercent}`;
  
  // Additional stats
  document.getElementById('youngestAge').textContent = 
    statsData.ages.length > 0 ? Math.min(...statsData.ages) : '--';
  document.getElementById('oldestAge').textContent = 
    statsData.ages.length > 0 ? Math.max(...statsData.ages) : '--';
  
  // Most common email domain
  let commonDomain = '--';
  let domainMax = 0;
  Object.entries(statsData.emailDomains).forEach(([domain, count]) => {
    if (count > domainMax) {
      domainMax = count;
      commonDomain = domain;
    }
  });
  document.getElementById('commonDomain').textContent = commonDomain;
  
  // Unique countries
  document.getElementById('uniqueCountries').textContent = statsData.countries.size;
}

// Update charts
function updateCharts() {
  // Nationality chart
  const nationalityCtx = document.getElementById('nationalityChart')?.getContext('2d');
  if (nationalityCtx) {
    if (nationalityChart) {
      nationalityChart.destroy();
    }
    
    const natLabels = Object.keys(statsData.nationalities);
    const natData = Object.values(statsData.nationalities);
    
    nationalityChart = new Chart(nationalityCtx, {
      type: 'doughnut',
      data: {
        labels: natLabels,
        datasets: [{
          data: natData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'white',
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }
  
  // Age chart
  const ageCtx = document.getElementById('ageChart')?.getContext('2d');
  if (ageCtx) {
    if (ageChart) {
      ageChart.destroy();
    }
    
    // Group ages
    const ageGroups = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 };
    statsData.ages.forEach(age => {
      if (age <= 25) ageGroups['18-25']++;
      else if (age <= 35) ageGroups['26-35']++;
      else if (age <= 45) ageGroups['36-45']++;
      else if (age <= 55) ageGroups['46-55']++;
      else ageGroups['56+']++;
    });
    
    ageChart = new Chart(ageCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(ageGroups),
        datasets: [{
          label: 'Users',
          data: Object.values(ageGroups),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'white'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'white'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

// Initialize statistics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initStatistics();
  
  // Update statistics whenever new users are loaded
  const originalLoadBtnClick = loadBtn.onclick;
  loadBtn.onclick = async function() {
    await originalLoadBtnClick?.();
    if (users && users.length > 0) {
      updateStatistics(users);
    }
  };
});

// Update navigation to handle sections
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', function(e) {
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Update active nav link
        document.querySelectorAll('.navbar a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    }
  });
});

// Update scroll behavior for navbar
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const switchPoint = 100;
  
  // Update navbar style
  const hasScrolled = scrollY > switchPoint;
  logo.classList.toggle('scrolled', hasScrolled);
  navbar.classList.toggle('scrolled', hasScrolled);
  themeToggler.classList.toggle('scrolled', hasScrolled);
  
  // Update active nav link based on scroll position
  const sections = document.querySelectorAll('section');
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = '#' + section.id;
    }
  });
  
  if (currentSection) {
    document.querySelectorAll('.navbar a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active');
      }
    });
  }
});

/* ===============================
   MOBILE ENHANCEMENTS
================================ */

// Detect mobile device
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Handle mobile menu toggle (if needed)
function setupMobileMenu() {
  if (isMobileDevice() && window.innerWidth < 768) {
    // Add touch events for better mobile interaction
    document.querySelectorAll('.gender-pill, .nav-btn, .load-btn').forEach(button => {
      button.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
      });
      
      button.addEventListener('touchend', function() {
        this.style.opacity = '1';
      });
    });
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
}

// Optimize scroll performance on mobile
function optimizeMobileScroll() {
  if (isMobileDevice()) {
    // Add passive: true to scroll listeners for better performance
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      const newOptions = options;
      if (type === 'touchstart' || type === 'touchmove') {
        if (typeof newOptions === 'object') {
          newOptions.passive = false;
        } else {
          newOptions = { passive: false };
        }
      }
      originalAddEventListener.call(this, type, listener, newOptions);
    };
  }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
  setupMobileMenu();
  optimizeMobileScroll();
  
  // Handle orientation changes
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      // Force resize event to recalculate layouts
      window.dispatchEvent(new Event('resize'));
      
      // Reinitialize charts if they exist
      if (typeof updateCharts === 'function') {
        setTimeout(updateCharts, 300);
      }
    }, 100);
  });
  
  // Adjust UI for mobile on load
  if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
    
    // Reduce animation intensity for better mobile performance
    if (app && app.gradientBackground && app.gradientBackground.uniforms) {
      app.gradientBackground.uniforms.uSpeed.value = 0.8;
      app.gradientBackground.uniforms.uGrainIntensity.value = 0.04;
    }
  }
});

// Enhanced touch handling for the interactive background
if (typeof app !== 'undefined' && app.onTouchMove) {
  // Override touch handling for better mobile performance
  const originalTouchMove = app.onTouchMove;
  app.onTouchMove = function(ev) {
    if (ev.touches && ev.touches.length > 0) {
      const touch = ev.touches[0];
      // Throttle touch events for better performance
      if (!this.lastTouchTime || Date.now() - this.lastTouchTime > 16) {
        this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        this.lastTouchTime = Date.now();
      }
      ev.preventDefault();
    }
  };
}

// Handle mobile keyboard appearance
window.addEventListener('resize', function() {
  if (isMobileDevice()) {
    const viewportHeight = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${viewportHeight * 0.01}px`);
  }
});
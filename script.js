// script.js

// Theme Management
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('pharma-theme') || 'light';
    setTheme(savedTheme);
    
    // Theme toggle button functionality
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    // Theme option dropdown functionality
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            
            // Update dropdown text
            const dropdownToggle = document.querySelector('#themeDropdown');
            const icon = dropdownToggle.querySelector('i');
            
            if (theme === 'light') {
                icon.className = 'fas fa-sun';
                dropdownToggle.innerHTML = '<i class="fas fa-sun"></i> Theme';
            } else if (theme === 'dark') {
                icon.className = 'fas fa-moon';
                dropdownToggle.innerHTML = '<i class="fas fa-moon"></i> Theme';
            } else if (theme === 'coffee') {
                icon.className = 'fas fa-coffee';
                dropdownToggle.innerHTML = '<i class="fas fa-coffee"></i> Theme';
            }
        });
    });
    
    // Initialize charts on dashboard preview
    initializeCharts();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update theme toggle button icon based on current theme
    updateThemeToggleIcon();
});

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pharma-theme', theme);
    
    // Update theme toggle button icon
    updateThemeToggleIcon();
}

// Function to update theme toggle button icon
function updateThemeToggleIcon() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const icon = themeToggleBtn.querySelector('i');
    
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    } else if (currentTheme === 'coffee') {
        icon.className = 'fas fa-moon';
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
        icon.className = 'fas fa-moon';
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    }
}

// Function to initialize charts
function initializeCharts() {
    // Check if Chart.js is available and we have canvas elements
    if (typeof Chart === 'undefined') return;
    
    const salesChartCanvas = document.getElementById('salesChart');
    const stockChartCanvas = document.getElementById('stockChart');
    
    if (salesChartCanvas) {
        // Sales Chart
        const salesCtx = salesChartCanvas.getContext('2d');
        
        // Get computed styles for theme colors
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--primary-color').trim();
        const secondaryColor = computedStyle.getPropertyValue('--secondary-color').trim();
        
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                    borderColor: primaryColor,
                    backgroundColor: `${primaryColor}20`,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }
    
    if (stockChartCanvas) {
        // Stock Chart
        const stockCtx = stockChartCanvas.getContext('2d');
        
        // Get computed styles for theme colors
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--primary-color').trim();
        const secondaryColor = computedStyle.getPropertyValue('--secondary-color').trim();
        const accentColor = computedStyle.getPropertyValue('--accent-color').trim();
        
        new Chart(stockCtx, {
            type: 'doughnut',
            data: {
                labels: ['Antibiotics', 'Pain Relief', 'Vitamins', 'First Aid', 'Other'],
                datasets: [{
                    data: [25, 20, 30, 15, 10],
                    backgroundColor: [
                        primaryColor,
                        secondaryColor,
                        accentColor,
                        '#4CAF50',
                        '#2196F3'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                    }
                }
            }
        });
    }
}

// Function to simulate loading for dashboard stats
function animateStats() {
    const statValues = document.querySelectorAll('.stat-info h3');
    
    statValues.forEach(stat => {
        const originalText = stat.textContent;
        let targetValue;
        
        // Extract numeric value
        if (originalText.includes('₹')) {
            targetValue = parseInt(originalText.replace(/[₹,]/g, ''));
        } else {
            targetValue = parseInt(originalText.replace(/,/g, ''));
        }
        
        // Animate from 0 to target value
        let current = 0;
        const increment = targetValue / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                clearInterval(timer);
                stat.textContent = originalText;
            } else {
                if (originalText.includes('₹')) {
                    stat.textContent = '₹ ' + Math.floor(current).toLocaleString();
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }
        }, 30);
    });
}

// Call animateStats when dashboard preview is in view
const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const dashboardPreview = document.getElementById('dashboard-preview');
if (dashboardPreview) {
    observer.observe(dashboardPreview);
}
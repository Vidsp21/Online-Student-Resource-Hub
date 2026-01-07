// ========================================
// THEME TOGGLE - Dark Mode / Light Mode
// ========================================

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply theme on page load
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon('☀️');
} else {
    updateThemeIcon('🌙');
}

// Theme toggle button
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Save preference
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        // Update icon
        updateThemeIcon(theme === 'dark' ? '☀️' : '🌙');
    });
}

// Update theme icon
function updateThemeIcon(icon) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = icon;
    }
}

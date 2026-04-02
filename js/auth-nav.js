// Navigation sidebar et formulaires
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    const navFormBtns = document.querySelectorAll('.nav-form-btn');
    const forms = {
        login: document.getElementById('loginForm'),
        register: document.getElementById('registerForm'),
        reset: document.getElementById('resetForm')
    };
    
    // Mode nuit
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Ouvrir sidebar
    if(sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.add('open');
            overlay.classList.add('active');
        });
    }
    
    // Fermer sidebar
    function closeSidebarFunc() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
    
    if(closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if(overlay) overlay.addEventListener('click', closeSidebarFunc);
    
    // Navigation entre formulaires via sidebar
    navFormBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const formId = this.getAttribute('data-form');
            if(formId && forms[formId]) {
                Object.values(forms).forEach(form => {
                    if(form) form.classList.remove('active');
                });
                forms[formId].classList.add('active');
            }
            closeSidebarFunc();
        });
    });
    
    // Lien "Mot de passe oublié"
    const forgotLink = document.getElementById('forgotPasswordLink');
    if(forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            Object.values(forms).forEach(form => {
                if(form) form.classList.remove('active');
            });
            if(forms.reset) forms.reset.classList.add('active');
            closeSidebarFunc();
        });
    }
    
    // Mode nuit
    if(darkModeToggle) {
        const isDark = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = isDark;
        applyDarkMode(isDark);
        
        darkModeToggle.addEventListener('change', function() {
            const isChecked = this.checked;
            localStorage.setItem('darkMode', isChecked);
            applyDarkMode(isChecked);
        });
    }
    
    function applyDarkMode(enabled) {
        const header = document.querySelector('.header');
        
        if(enabled) {
            document.body.style.background = "linear-gradient(to bottom, #1e1e2f 50%, #2a2a3b 50%)";
            document.body.style.color = "#eee";
            document.querySelectorAll('.form').forEach(f => {
                f.style.background = "rgba(30,30,47,0.85)";
                f.style.border = "1px solid rgba(0,210,255,0.2)";
            });
            document.querySelectorAll('.form h2, .form input, .checkbox-container, .forgot-link').forEach(el => {
                el.style.color = "#eee";
            });
            document.querySelectorAll('.form input').forEach(inp => {
                inp.style.background = "rgba(50,50,70,0.9)";
                inp.style.color = "#fff";
                inp.style.border = "1px solid #444";
            });
            if(document.querySelector('.sidebar')) {
                document.querySelector('.sidebar').style.background = "#1a1a2e";
            }
            document.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.style.color = "#eee";
            });
            // Header mode nuit : ombre réduite
            if(header) {
                header.style.background = "#d1d6e0";
                header.style.boxShadow = "1px 1px 2px #a3b1c6, -1px -1px 2px #ffffff";
            }
        } else {
            document.body.style.background = "linear-gradient(to bottom, #ffffff 50%, #e8ecf1 50%)";
            document.body.style.color = "#333";
            document.querySelectorAll('.form').forEach(f => {
                f.style.background = "rgba(255,255,255,0.85)";
                f.style.border = "1px solid rgba(0,210,255,0.3)";
            });
            document.querySelectorAll('.form h2, .form input, .checkbox-container, .forgot-link').forEach(el => {
                el.style.color = "#16213e";
            });
            document.querySelectorAll('.form input').forEach(inp => {
                inp.style.background = "rgba(255,255,255,0.95)";
                inp.style.color = "#333";
                inp.style.border = "1px solid #ddd";
            });
            if(document.querySelector('.sidebar')) {
                document.querySelector('.sidebar').style.background = "#1a1a2e";
            }
            document.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.style.color = "#eee";
            });
            // Header mode jour : ombre normale
            if(header) {
                header.style.background = "#e0e5ec";
                header.style.boxShadow = "9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff";
            }
        }
    }
    
    // Boutons pages annexes
    const aboutBtn = document.getElementById('aboutBtn');
    const contactBtn = document.getElementById('contactBtn');
    const privacyBtn = document.getElementById('privacyBtn');
    
    if(aboutBtn) aboutBtn.addEventListener('click', () => window.location.href = 'about.html');
    if(contactBtn) contactBtn.addEventListener('click', () => window.location.href = 'contact.html');
    if(privacyBtn) privacyBtn.addEventListener('click', () => window.location.href = 'privacy.html');
    
    // Bouton installer
    const installBtn = document.getElementById('installBtn');
    if(installBtn) {
        installBtn.addEventListener('click', function() {
            alert("Fonction d'installation définie plus tard.");
        });
    }
});
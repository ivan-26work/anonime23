// Navigation pour index.html
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlaySidebar = document.getElementById('overlaySidebar');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Ouvrir sidebar
    if(hamburger) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.add('open');
            overlaySidebar.classList.add('active');
        });
    }
    
    // Fermer sidebar
    function closeSidebarFunc() {
        sidebar.classList.remove('open');
        overlaySidebar.classList.remove('active');
    }
    
    if(closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if(overlaySidebar) overlaySidebar.addEventListener('click', closeSidebarFunc);
    
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
        if(enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
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
    
    // Bouton partage de lien
    const shareLinkBtn = document.getElementById('shareLinkBtn');
    if(shareLinkBtn) {
        shareLinkBtn.addEventListener('click', function() {
            const link = window.location.origin + '/envoi.html';
            navigator.clipboard.writeText(link);
            if(navigator.share) {
                navigator.share({
                    title: 'Anonima23',
                    text: 'Message anonyme',
                    url: link
                }).catch(() => {});
            } else {
                alert('Lien copié : ' + link);
            }
        });
    }
    
    // Message démo (carte exemple)
    const messagesContainer = document.getElementById('messagesContainer');
    if(messagesContainer && messagesContainer.children.length === 0) {
        const demoCard = document.createElement('div');
        demoCard.className = 'message-card';
        demoCard.setAttribute('data-id', 'demo1');
        demoCard.innerHTML = `
            <div class="card-left">
                <div class="card-title">Nouveau message !</div>
                <div class="card-time">Il y a 2 min</div>
            </div>
            <button class="reply-btn-small" data-reply="demo1">
                <i class="fas fa-reply"></i>
            </button>
        `;
        messagesContainer.appendChild(demoCard);
        
        // Stocker message démo
        window.demoMessage = {
            id: 'demo1',
            content: 'Ceci est un message de démonstration. Bienvenue sur Anonima23 !',
            date: new Date(),
            timeAgo: 'Il y a 2 min'
        };
    }
});
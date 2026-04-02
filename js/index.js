// Ne pas déclarer supabase - utiliser window.supabaseClient directement

let currentUser = null;
let messages = [];
let currentMessageId = null;
let currentProfilePhoto = null;

// Éléments DOM
const messagesContainer = document.getElementById('messagesContainer');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlaySidebar = document.getElementById('overlaySidebar');
const closeSidebar = document.getElementById('closeSidebar');
const darkModeToggle = document.getElementById('darkModeToggle');
const shareLinkBtn = document.getElementById('shareLinkBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const aboutBtn = document.getElementById('aboutBtn');
const contactBtn = document.getElementById('contactBtn');
const privacyBtn = document.getElementById('privacyBtn');
const installBtn = document.getElementById('installBtn');
const profilePic = document.getElementById('profilePic');
const uploadPhoto = document.getElementById('uploadPhoto');
const profileEmail = document.getElementById('profileEmail');

// Overlays
const messageOverlay = document.getElementById('messageOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayDate = document.getElementById('overlayDate');
const overlayContent = document.getElementById('overlayContent');
const closeOverlayBtn = document.getElementById('closeOverlayBtn');
const replyFooter = document.getElementById('replyFooter');
const sendReplyBtn = document.getElementById('sendReplyBtn');
const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
const shareSnapBtn = document.getElementById('shareSnapBtn');
const shareInstaBtn = document.getElementById('shareInstaBtn');

const replyOverlay = document.getElementById('replyOverlay');
const originalMessageSpan = document.getElementById('originalMessage');
const replyText = document.getElementById('replyText');
const submitReplyBtn = document.getElementById('submitReplyBtn');
const cancelReplyBtn = document.getElementById('cancelReplyBtn');
const replyInputArea = document.getElementById('replyInputArea');

document.addEventListener('DOMContentLoaded', function() {
    init();
});

async function init() {
    if (!window.supabaseClient) {
        console.error('Supabase non initialisé');
        return;
    }
    
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    currentUser = user;
    profileEmail.textContent = user.email.split('@')[0];
    
    loadProfilePhoto();
    loadMessages();
    setupRealtime();
}

// Photo de profil
function loadProfilePhoto() {
    const savedPhoto = localStorage.getItem(`profile_photo_${currentUser.id}`);
    if (savedPhoto) {
        profilePic.src = savedPhoto;
        currentProfilePhoto = savedPhoto;
    } else {
        profilePic.src = 'icons/profil.png';
        currentProfilePhoto = 'icons/profil.png';
    }
}

uploadPhoto.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgData = event.target.result;
            profilePic.src = imgData;
            currentProfilePhoto = imgData;
            localStorage.setItem(`profile_photo_${currentUser.id}`, imgData);
        };
        reader.readAsDataURL(file);
    }
});

// Charger messages
async function loadMessages() {
    const { data, error } = await window.supabaseClient
        .from('messages')
        .select('*')
        .eq('receiver_id', currentUser.id)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error(error);
        return;
    }
    messages = data;
    renderMessages();
}

// Afficher cartes
function renderMessages() {
    if (!messagesContainer) return;
    if (messages.length === 0) {
        messagesContainer.innerHTML = '<div class="empty-state">Aucun message</div>';
        return;
    }
    
    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message-card" data-id="${msg.id}" data-content="${escapeHtml(msg.content)}" data-date="${msg.created_at}" data-sender="${msg.sender_id}">
            <div class="message-info">
                <div class="message-title">Nouveau message !</div>
                <div class="message-date">${formatDate(msg.created_at)}</div>
            </div>
            <button class="reply-btn-card" data-id="${msg.id}" data-sender="${msg.sender_id}">Répondre</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.message-card').forEach(card => {
        const msgId = card.dataset.id;
        const msg = messages.find(m => m.id == msgId);
        
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('reply-btn-card')) return;
            openMessageOverlay(msg);
        });
        
        let pressTimer;
        card.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                if (confirm('Supprimer ce message ?')) {
                    deleteMessage(msg.id);
                }
            }, 1000);
        });
        card.addEventListener('mouseup', () => clearTimeout(pressTimer));
        card.addEventListener('mouseleave', () => clearTimeout(pressTimer));
        
        const replyBtn = card.querySelector('.reply-btn-card');
        replyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openReplyOverlay(msg);
        });
    });
}

function openMessageOverlay(msg) {
    overlayTitle.textContent = 'Nouveau message !';
    overlayDate.textContent = formatDate(msg.created_at);
    overlayContent.textContent = msg.content;
    currentMessageId = msg.id;
    replyFooter.style.display = 'flex';
    messageOverlay.style.display = 'flex';
}

closeOverlayBtn.addEventListener('click', () => {
    messageOverlay.style.display = 'none';
    replyFooter.style.display = 'none';
});

// Répondre
function openReplyOverlay(msg) {
    originalMessageSpan.textContent = msg.content;
    const profilePhotoUrl = currentProfilePhoto || 'icons/profil.png';
    replyInputArea.style.backgroundImage = `url(${profilePhotoUrl})`;
    replyInputArea.style.backgroundSize = 'cover';
    replyInputArea.style.backgroundPosition = 'center';
    replyOverlay.style.display = 'flex';
    
    submitReplyBtn.onclick = async () => {
        const replyContent = replyText.value.trim();
        if (!replyContent) {
            alert('Écrivez votre réponse');
            return;
        }
        await window.supabaseClient.from('messages').insert({
            sender_id: currentUser.id,
            receiver_id: msg.sender_id,
            content: replyContent,
            created_at: new Date().toISOString()
        });
        replyOverlay.style.display = 'none';
        replyText.value = '';
        alert('Message envoyé');
        loadMessages();
    };
}

cancelReplyBtn.addEventListener('click', () => {
    replyOverlay.style.display = 'none';
    replyText.value = '';
});

// Partage lien - Version GitHub Pages
// Partage lien - version courte sans photo
shareLinkBtn.addEventListener('click', async () => {
    const baseUrl = 'https://ivan-26work.github.io/anonime23';
    const link = `${baseUrl}/envoi.html?from=${currentUser.id}`;
    
    await navigator.clipboard.writeText(link);
    
    if (navigator.share) {
        navigator.share({
            title: 'Anonima23',
            text: 'Message anonyme',
            url: link
        });
    } else {
        alert('Lien copié : ' + link);
    }
});
// Supprimer tous
deleteAllBtn.addEventListener('click', async () => {
    if (confirm('Supprimer TOUS les messages ?')) {
        await window.supabaseClient.from('messages').delete().eq('receiver_id', currentUser.id);
        loadMessages();
    }
});

async function deleteMessage(id) {
    await window.supabaseClient.from('messages').delete().eq('id', id);
    loadMessages();
}

// Boutons partage (simulation)
sendReplyBtn.addEventListener('click', () => {
    alert('Message envoyé (simulation)');
});
shareWhatsappBtn.addEventListener('click', () => {
    alert('Partage WhatsApp - capture carte');
});
shareSnapBtn.addEventListener('click', () => {
    alert('Partage Snapchat - capture carte');
});
shareInstaBtn.addEventListener('click', () => {
    alert('Partage Instagram - capture carte');
});

// Mode nuit
const savedDarkMode = localStorage.getItem('darkMode') === 'true';
if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    localStorage.setItem('darkMode', e.target.checked);
});

// Sidebar
hamburger.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlaySidebar.classList.add('active');
});
function closeSidebarFunc() {
    sidebar.classList.remove('open');
    overlaySidebar.classList.remove('active');
}
closeSidebar.addEventListener('click', closeSidebarFunc);
overlaySidebar.addEventListener('click', closeSidebarFunc);

// Pages légales
aboutBtn.addEventListener('click', () => window.location.href = 'about.html');
contactBtn.addEventListener('click', () => window.location.href = 'contact.html');
privacyBtn.addEventListener('click', () => window.location.href = 'privacy.html');

installBtn.addEventListener('click', () => alert('Installation PWA à configurer'));

// Realtime
function setupRealtime() {
    window.supabaseClient
        .channel('messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            if (payload.new.receiver_id === currentUser.id) {
                loadMessages();
            }
        })
        .subscribe();
}

function formatDate(iso) {
    const date = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    if (diff < 1) return 'à l\'instant';
    if (diff < 60) return `il y a ${diff} min`;
    if (diff < 1440) return `il y a ${Math.floor(diff / 60)} h`;
    return date.toLocaleDateString();
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
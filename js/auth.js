// Éviter la déclaration multiple de Supabase
if (typeof window.supabaseClient === 'undefined') {
    const SUPABASE_URL = 'https://rdfdkfzrzatkidkrkrxl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZmRrZnpyemF0a2lka3JrcnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTk3OTgsImV4cCI6MjA5MDY5NTc5OH0.YQYV7NJ8DxxQp6PNz83yAtX-r-a4AAJ4EdpMybPj-iQ';
    
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function showMessage(message, type = 'error') {
    const notificationArea = document.getElementById('notificationArea');
    if (notificationArea) {
        notificationArea.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => {
            notificationArea.innerHTML = '';
        }, 5000);
    }
}

function setButtonLoading(btn, isLoading) {
    const textSpan = btn.querySelector('.btn-text');
    const spinnerSpan = btn.querySelector('.btn-spinner');
    if (!textSpan || !spinnerSpan) return;
    
    if (isLoading) {
        btn.disabled = true;
        textSpan.style.display = 'none';
        spinnerSpan.style.display = 'inline';
    } else {
        btn.disabled = false;
        textSpan.style.display = 'inline';
        spinnerSpan.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const resetBtn = document.getElementById('resetBtn');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const resetEmail = document.getElementById('resetEmail');
    const acceptPolicies = document.getElementById('acceptPolicies');
    
    // PAS de redirection automatique ici
    
    // Inscription
    if (registerBtn) {
        registerBtn.addEventListener('click', async function() {
            const email = registerEmail.value.trim();
            const password = registerPassword.value;
            const confirm = confirmPassword.value;
            
            if (!email || !password || !confirm) {
                showMessage('Tous les champs sont requis', 'error');
                return;
            }
            
            if (password !== confirm) {
                showMessage('Les mots de passe ne correspondent pas', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
                return;
            }
            
            setButtonLoading(registerBtn, true);
            
            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password
            });
            
            setButtonLoading(registerBtn, false);
            
            if (error) {
                showMessage('Erreur : ' + error.message, 'error');
                return;
            }
            
            if (data.user) {
                showMessage('Inscription réussie ! Vérifiez votre email.', 'success');
                const loginForm = document.getElementById('loginForm');
                const registerForm = document.getElementById('registerForm');
                if (loginForm && registerForm) {
                    registerForm.classList.remove('active');
                    loginForm.classList.add('active');
                    document.getElementById('loginEmail').value = email;
                }
            }
        });
    }
    
    // Connexion - UNIQUE redirection ici
    if (loginBtn) {
        loginBtn.addEventListener('click', async function() {
            const email = loginEmail.value.trim();
            const password = loginPassword.value;
            const accepted = acceptPolicies ? acceptPolicies.checked : true;
            
            if (!email || !password) {
                showMessage('Email et mot de passe requis', 'error');
                return;
            }
            
            if (!accepted) {
                showMessage('Vous devez accepter les politiques', 'error');
                return;
            }
            
            setButtonLoading(loginBtn, true);
            
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            setButtonLoading(loginBtn, false);
            
            if (error) {
                showMessage('Erreur : ' + error.message, 'error');
                return;
            }
            
            if (data.session) {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Mot de passe oublié
    if (resetBtn) {
        resetBtn.addEventListener('click', async function() {
            const email = resetEmail.value.trim();
            
            if (!email) {
                showMessage('Email requis', 'error');
                return;
            }
            
            setButtonLoading(resetBtn, true);
            
            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password.html'
            });
            
            setButtonLoading(resetBtn, false);
            
            if (error) {
                showMessage('Erreur : ' + error.message, 'error');
            } else {
                showMessage('Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.', 'success');
            }
        });
    }
});
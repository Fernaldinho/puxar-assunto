// ==========================================
// LANDING PAGE INTERACTIVITY & ANIMATIONS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Countdown Timer
    initTimer();

    // Initialize Scroll Animations
    initScrollAnimations();

    // Initialize Chat Simulation
    initChatSimulator();

    // Initialize Checkout Modals
    initModals();
});

/* ==========================================
   1. COUNTDOWN TIMER
   ========================================== */
function initTimer() {
    const countdownEl = document.getElementById('countdown');
    const defaultTime = 14 * 60 + 59; // 14:59 in seconds
    let timeRemaining;

    // Check localStorage to persist user timer
    if (localStorage.getItem('promo_timer')) {
        const savedTime = parseInt(localStorage.getItem('promo_timer'), 10);
        const savedAt = parseInt(localStorage.getItem('promo_timer_start'), 10);
        const elapsed = Math.floor((Date.now() - savedAt) / 1000);
        
        if (elapsed < savedTime) {
            timeRemaining = savedTime - elapsed;
        } else {
            timeRemaining = defaultTime; // Reset if expired
            localStorage.setItem('promo_timer_start', Date.now().toString());
        }
    } else {
        timeRemaining = defaultTime;
        localStorage.setItem('promo_timer', timeRemaining.toString());
        localStorage.setItem('promo_timer_start', Date.now().toString());
    }

    function updateTimer() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        if (countdownEl) {
            countdownEl.textContent = `${formattedMinutes}:${formattedSeconds}`;
        }

        if (timeRemaining <= 0) {
            timeRemaining = defaultTime; // loop timer
            localStorage.setItem('promo_timer_start', Date.now().toString());
        } else {
            timeRemaining--;
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ==========================================
   2. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const animElements = document.querySelectorAll('.animate-on-scroll, .pain-card');
    animElements.forEach(el => {
        observer.observe(el);
    });
}

/* ==========================================
   3. CHAT SIMULATOR (CERTO VS ERRADO)
   ========================================== */
const chatData = {
    wrong: {
        messages: [
            { sender: 'user', text: 'Oi Mariana, tudo bem?' },
            { sender: 'mariana', text: 'Oi, td bem.' },
            { sender: 'user', text: 'Vi seu perfil e achei legal. O que vc faz?' },
            { sender: 'mariana', text: 'Ah, estudo adm.' },
            { sender: 'user', text: 'Que legal. E gosta?' },
            { sender: 'mariana', text: 'Sim, é legal.' }
        ],
        commentary: '❌ <strong>Abordagem Fracassada:</strong> A conversa esfriou rapidamente porque faltou emoção, perguntas magnéticas e um gancho real de interesse. A resposta dela foi curta e a interação morreu.',
        systemAlert: 'Conversa encerrada. Mariana não respondeu à última mensagem.'
    },
    right: {
        messages: [
            { sender: 'user', text: 'Mariana! Vi que você também curte café especial e viagens aleatórias. Qual foi o café mais exótico que você já tomou?' },
            { sender: 'mariana', text: 'Nossa, que legal que reparou! Haha. Acho que foi um com notas de frutas amarelas em Minas. E você?' },
            { sender: 'user', text: 'Excelente escolha! Eu provei um fermentado uma vez que parecia suco de maracujá. E sobre as viagens, qual o próximo destino na sua lista?' },
            { sender: 'mariana', text: 'Que massa! Quero muito conhecer a Chapada dos Veadeiros no próximo feriado!' }
        ],
        commentary: '✅ <strong>Abordagem Magnética:</strong> Ao invés de clichês, a abordagem focou em interesses em comum (café e viagens) usando uma pergunta aberta de alto impacto. Ela respondeu animada e a conversa fluiu naturalmente!',
        systemAlert: 'Mariana está online e engajada na conversa.'
    }
};

let currentChatTimeout = null;

function playConversation(type) {
    const container = document.getElementById('chat-body-container');
    const commentaryEl = document.getElementById('chat-commentary-text');
    const statusEl = document.querySelector('.chat-status');

    if (!container) return;

    // Reset container and commentary
    container.innerHTML = '';
    if (commentaryEl) {
        commentaryEl.innerHTML = '';
        commentaryEl.classList.remove('visible');
    }
    if (statusEl) statusEl.textContent = 'Online';

    const data = chatData[type];
    let index = 0;

    function printNext() {
        if (index < data.messages.length) {
            const msg = data.messages[index];
            
            if (msg.sender === 'mariana') {
                if (statusEl) statusEl.textContent = 'Digitando...';
                
                const typingBubble = document.createElement('div');
                typingBubble.className = 'typing-bubble';
                typingBubble.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
                container.appendChild(typingBubble);
                container.scrollTop = container.scrollHeight;

                currentChatTimeout = setTimeout(() => {
                    if (typingBubble.parentNode) {
                        typingBubble.parentNode.removeChild(typingBubble);
                    }
                    if (statusEl) statusEl.textContent = 'Online';

                    const bubble = document.createElement('div');
                    bubble.className = `chat-bubble left ${type === 'wrong' ? 'wrong-bubble' : ''}`;
                    bubble.textContent = msg.text;
                    container.appendChild(bubble);

                    const seen = document.createElement('div');
                    seen.className = 'seen-status';
                    seen.textContent = 'Visualizado';
                    container.appendChild(seen);

                    container.scrollTop = container.scrollHeight;

                    index++;
                    currentChatTimeout = setTimeout(printNext, 1200);
                }, 1500);
            } else {
                const bubble = document.createElement('div');
                bubble.className = `chat-bubble right ${type === 'wrong' ? 'wrong-bubble' : ''}`;
                bubble.textContent = msg.text;
                container.appendChild(bubble);
                container.scrollTop = container.scrollHeight;

                index++;
                currentChatTimeout = setTimeout(printNext, 1200);
            }
        } else {
            if (data.systemAlert) {
                const alert = document.createElement('div');
                alert.className = 'chat-bubble system-alert';
                alert.textContent = data.systemAlert;
                container.appendChild(alert);
                container.scrollTop = container.scrollHeight;
            }

            if (commentaryEl) {
                commentaryEl.innerHTML = data.commentary;
                commentaryEl.classList.add('visible');
            }
        }
    }

    printNext();
}

function switchChat(type) {
    const buttons = document.querySelectorAll('.chat-toggle-btn');
    buttons.forEach(btn => {
        if ((type === 'wrong' && btn.textContent.includes('FRACASSADA')) ||
            (type === 'right' && btn.textContent.includes('MAGNÉTICA'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (currentChatTimeout) {
        clearTimeout(currentChatTimeout);
    }

    playConversation(type);
}

// Bind to window for HTML inline onclick attributes
window.switchChat = switchChat;

function initChatSimulator() {
    playConversation('wrong');
}

/* ==========================================
   4. CHECKOUT MODALS
   ========================================== */
function initModals() {
    const checkoutModal = document.getElementById('checkout-modal');
    const successModal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const checkoutBtn = document.getElementById('btn-checkout-final');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (checkoutModal) checkoutModal.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (checkoutModal) checkoutModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });

    // Payment options selector styling
    const payOptions = document.querySelectorAll('.pay-option');
    payOptions.forEach(opt => {
        opt.addEventListener('click', function() {
            payOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const checkoutModal = document.getElementById('checkout-modal');
    const successModal = document.getElementById('success-modal');
    const submitBtn = event.target.querySelector('.modal-submit');
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="typing-dot" style="display:inline-block;animation:dotPulse 1s infinite alternate"></span> Processando...';
    }

    setTimeout(() => {
        if (checkoutModal) checkoutModal.classList.remove('active');
        if (successModal) successModal.classList.add('active');
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'CONCLUIR COMPRA POR R$ 17,90';
        }
    }, 1500);
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.classList.remove('active');
    }
}

// Bind to window for inline HTML onclick/onsubmit attributes
window.handleFormSubmit = handleFormSubmit;
window.closeSuccessModal = closeSuccessModal;

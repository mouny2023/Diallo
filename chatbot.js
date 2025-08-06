// Contenido para el nuevo archivo: chatbot.js (VERSIÓN EN FRANCÉS)

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const chatWidget = document.getElementById('chat-widget');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const messagesContainer = document.getElementById('chat-messages');
    const inputArea = document.getElementById('chat-input-area');

    // --- CEREBRO DEL BOT: PREGUNTAS Y RESPUESTAS (EN FRANCÉS) ---
    const preguntasYRespuestas = {
        "horaires": "Quelles sont vos heures d'ouverture ?",
        "emplacement": "Où êtes-vous situés ?",
        "livraison": "Faites-vous la livraison à domicile ?",
        "paiement": "Quels sont les moyens de paiement acceptés ?"
    };

    const reponses = {
        "horaires": "Nous sommes ouverts du Lundi au Samedi, de 12h00 à 23h00.",
        "emplacement": "Nous sommes situés au Rond Point PK-Télé – Parakou. On vous attend !",
        "livraison": "Oui, nous livrons à domicile dans la zone. Vous pouvez finaliser votre commande pour voir les détails.",
        "paiement": "Nous acceptons Moov Money, Céltiis, MTN MoMo, paiement par QR et espèces à la livraison."
    };

    // --- FUNCIONES ---

    function toggleChat() {
        chatWidget.classList.toggle('visible');
        if (chatWidget.classList.contains('visible')) {
            showWelcomeMessage();
            displayQuestions();
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function displayQuestions() {
        inputArea.innerHTML = '';
        for (const key in preguntasYRespuestas) {
            const button = document.createElement('button');
            button.className = 'question-btn';
            button.textContent = preguntasYRespuestas[key];
            button.dataset.key = key;
            inputArea.appendChild(button);
        }
    }
    
    function showWelcomeMessage() {
        messagesContainer.innerHTML = '';
        addMessage("Bonjour ! Je suis l'assistant virtuel de Café Resto Chez Diallo. Comment puis-je vous aider ?", 'bot');
    }

    // --- EVENTOS ---

    chatToggleBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', toggleChat);

    inputArea.addEventListener('click', (event) => {
        if (event.target.classList.contains('question-btn')) {
            const questionKey = event.target.dataset.key;
            const questionText = preguntasYRespuestas[questionKey];
            const answerText = reponses[questionKey];

            addMessage(questionText, 'user');

            setTimeout(() => {
                addMessage(answerText, 'bot');
            }, 500);
        }
    });
});
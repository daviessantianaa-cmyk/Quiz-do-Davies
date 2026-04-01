// ====================================
// DADOS DO QUIZ
// ====================================
const quizData = [
    {
        question: "Qual é o dia do meu aniversário?",
        options: ["28 de Agosto", "19 de Agosto", "18 de Agosto"],
        correct: "19 de Agosto"
    },
    {
        question: "Qual é a minha cor favorita?",
        options: ["Azul Escuro", "Preto", "Branco"],
        correct: "Azul Escuro"
    },
    {
        question: "Qual é o meu tipo de música favorita?",
        options: ["Rock", "Funk", "Pop"],
        correct: "Rock"
    },
    {
        question: "Qual é minha série favorita de todos os tempos?",
        options: ["Dexter", "Brooklyn Nine-Nine", "Game of Thrones"],
        correct: "Dexter"
    },
    {
        question: "Qual é meu hobby favorito?",
        options: ["Programação", "Musculação", "Video games"],
        correct: "Musculação"
    },
    {
        question: "Qual comida eu mais gosto?",
        options: ["Pizza", "Sushi", "Hambúrguer"],
        correct: "Pizza"
    },
    {
        question: "Onde meu lugar favorito para relaxar?",
        options: ["Praia", "Montanha", "Cidade"],
        correct: "Cidade"
    },
    {
        question: "Qual linguagem de programação eu domino melhor?",
        options: ["JavaScript", "Python", "Java"],
        correct: "JavaScript"
    },
    {
        question: "Qual é meu livro ou série de livros favorito?",
        options: ["Harry Potter", "Star Wars", "O Senhor dos Anéis"],
        correct: "Star Wars"
    },
    {
        question: "Se eu pudesse viajar para qualquer lugar, seria?",
        options: ["Japão", "Itália", "New York"],
        correct: "Itália" 
    }
];

// ====================================
// VARIÁVEIS GLOBAIS
// ====================================
let currentQuestion = 0;
let score = 0;
const answers = new Array(quizData.length).fill(null);
let userName = '';
let quizStarted = false;
let answered = false;

// ====================================
// TELA DE ENTRADA - IDENTIFICAÇÃO
// ====================================
function showNameScreen() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>🐺 Quiz Interativo 🐺</h1>
            <p class="subtitle">Bem-vindo ao meu quiz!</p>
        </header>

        <div class="name-input-container">
            <div class="name-input-box">
                <div class="input-icon">👤</div>
                <input 
                    type="text" 
                    id="nameInput" 
                    class="name-input" 
                    placeholder="Digite seu nome..."
                    maxlength="30"
                    autocomplete="off"
                >
            </div>
            
            <p class="name-description">Qual é o seu nome? Preciso saber com quem estou falando! 😊</p>
            
            <button class="btn-start" id="startBtn" onclick="startQuizWithName()" disabled>
                Começar o Quiz →
            </button>
        </div>

        <footer>
            <p>Teste seus conhecimentos sobre mim com 10 perguntas interessantes!</p>
        </footer>
    `;

    const nameInput = document.getElementById('nameInput');
    const startBtn = document.getElementById('startBtn');

    nameInput.addEventListener('input', (e) => {
        startBtn.disabled = e.target.value.trim() === '';
    });

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !startBtn.disabled) {
            startQuizWithName();
        }
    });

    setTimeout(() => nameInput.focus(), 100);
}

function startQuizWithName() {
    const nameInput = document.getElementById('nameInput');
    userName = nameInput.value.trim();

    if (userName === '') {
        alert('Por favor, digite seu nome!');
        return;
    }

    quizStarted = true;
    initQuiz();
}

// ====================================
// FUNÇÕES PRINCIPAIS
// ====================================
function initQuiz() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>Quiz Interativo</h1>
            <p class="subtitle" id="userGreeting">Bem-vindo, <strong>${userName}</strong>! 🎮</p>
            <div class="live-score" id="liveScore">Pontuação: <strong>0 / 10</strong></div>
        </header>

        <div class="progress-container">
            <div class="progress-label">
                <span>Progresso</span>
                <span id="questionCounter">1 / 10</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>

        <div class="questions-wrapper" id="questionsWrapper">
            <!-- Questões serão inseridas aqui -->
        </div>

        <div class="result-container" id="resultContainer">
            <div class="score-circle">
                <div>
                    <div class="score-text" id="finalScore">-</div>
                    <div class="score-label">/ 10</div>
                </div>
            </div>
            <div class="user-result-name" id="userResultName"></div>
            <div class="stars" id="starsContainer"></div>
            <div class="result-message" id="resultMessage"></div>
            <div class="result-description" id="resultDescription"></div>
            <div class="result-final-score" id="resultFinalScore"></div>
        </div>

        <div class="button-group" id="buttonGroup">
            <button class="btn-prev" id="prevBtn" onclick="previousQuestion()" style="display: none;">← Anterior</button>
            <button class="btn-next" id="nextBtn" onclick="nextQuestion()" disabled>Próxima →</button>
        </div>

        <footer>
            <p>Divirta-se e descubra quanto você realmente sabe sobre mim!</p>
        </footer>
    `;

    renderQuestion();
    updateProgress();
    setupButtonAnimations();
}

function renderQuestion() {
    const wrapper = document.getElementById('questionsWrapper');
    wrapper.innerHTML = '';

    const section = document.createElement('section');
    section.className = 'question-section active';
    section.innerHTML = `
        <span class="question-number">Pergunta ${currentQuestion + 1}</span>
        <h2 class="question-title">${quizData[currentQuestion].question}</h2>
        <div class="options-list">
            ${quizData[currentQuestion].options.map((option, index) => `
                <div class="option">
                    <input type="radio" name="question" id="option${index}" value="${index}" ${answers[currentQuestion] === index ? 'checked' : ''} onchange="selectAnswer(${index})" ${answered ? 'disabled' : ''}>
                    <label for="option${index}" class="option-label">${option}</label>
                </div>
            `).join('')}
        </div>
        <div class="answer-feedback" id="answerFeedback"></div>
    `;
    wrapper.appendChild(section);
    updateButtonStates();
    setupOptionAnimations();
}

function selectAnswer(index) {
    if (answered) return;

    answers[currentQuestion] = index;
    answered = true;

    const selectedOption = quizData[currentQuestion].options[index];
    const correctOption = quizData[currentQuestion].correct;
    const isCorrect = selectedOption.toLowerCase() === correctOption.toLowerCase();

    // Mostrar feedback visual
    showAnswerFeedback(index, isCorrect, selectedOption, correctOption);

    // Incrementar score se acertou
    if (isCorrect) {
        score++;
    }

    // Atualizar score em tempo real
    updateLiveScore();

    // Habilitar botão de próxima
    document.getElementById('nextBtn').disabled = false;

    // Animação ao selecionar
    const label = document.querySelector(`label[for="option${index}"]`);
    if (isCorrect) {
        createSuccessAnimation(label);
    } else {
        createErrorAnimation(label);
    }
    triggerHaptic();
}

function showAnswerFeedback(selectedIndex, isCorrect, selectedOption, correctOption) {
    // Desabilitar todos os inputs
    const inputs = document.querySelectorAll('input[name="question"]');
    inputs.forEach(input => input.disabled = true);

    // Colorir opções
    const labels = document.querySelectorAll('.option-label');
    labels.forEach((label, index) => {
        const option = quizData[currentQuestion].options[index];
        
        if (isCorrect && index === selectedIndex) {
            // Resposta correta - verde
            label.classList.add('correct-answer');
            createSuccessAnimation(label);
        } else if (!isCorrect && index === selectedIndex) {
            // Resposta incorreta - vermelho
            label.classList.add('wrong-answer');
            createErrorAnimation(label);
        } else if (option.toLowerCase() === correctOption.toLowerCase()) {
            // Mostrar a resposta correta
            label.classList.add('correct-answer', 'show-correct');
        }
    });

    // Mostrar mensagem de feedback
    const feedbackDiv = document.getElementById('answerFeedback');
    if (isCorrect) {
        feedbackDiv.innerHTML = `
            <div class="feedback-message correct">
                <span class="feedback-icon">✓</span>
                <span class="feedback-text">Parabéns! Você acertou! 🎉</span>
            </div>
        `;
    } else {
        feedbackDiv.innerHTML = `
            <div class="feedback-message wrong">
                <span class="feedback-icon">✗</span>
                <span class="feedback-text">Que pena! A resposta correta é: <strong>${correctOption}</strong></span>
            </div>
        `;
    }
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        const section = document.querySelector('.question-section');
        section.classList.add('exit');
        
        setTimeout(() => {
            currentQuestion++;
            answered = false;
            updateProgress();
            renderQuestion();
        }, 300);
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        const section = document.querySelector('.question-section');
        section.classList.add('exit');
        
        setTimeout(() => {
            currentQuestion--;
            answered = false;
            updateProgress();
            renderQuestion();
        }, 300);
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
    document.getElementById('questionCounter').textContent = `${currentQuestion + 1} / ${quizData.length}`;

    if (currentQuestion > 0) {
        document.getElementById('prevBtn').style.display = 'block';
    } else {
        document.getElementById('prevBtn').style.display = 'none';
    }
}

function updateButtonStates() {
    const nextBtn = document.getElementById('nextBtn');
    const isAnswered = answers[currentQuestion] !== null;
    nextBtn.disabled = !isAnswered;

    if (currentQuestion === quizData.length - 1) {
        nextBtn.textContent = 'Finalizar →';
    } else {
        nextBtn.textContent = 'Próxima →';
    }
}

function showResults() {
    calculateScore();
    animateResults();
}

function calculateScore() {
    score = answers.filter((answer, index) => {
        const selectedOption = quizData[index].options[answer];
        const correctOption = quizData[index].correct;
        return selectedOption.toLowerCase() === correctOption.toLowerCase();
    }).length;
}

function animateResults() {
    const wrapper = document.getElementById('questionsWrapper');
    wrapper.style.display = 'none';
    const buttonGroup = document.getElementById('buttonGroup');
    buttonGroup.style.display = 'none';

    const resultContainer = document.getElementById('resultContainer');
    resultContainer.classList.add('show');

    document.getElementById('finalScore').textContent = score;
    document.getElementById('userResultName').textContent = `Resultado de ${userName}`;

    const messages = [
        { message: "Parabéns! 🎉", description: `${userName}, você me conhece de verdade!` },
        { message: "Muito bem! 👏", description: `Parabéns ${userName}, você sabe bastante sobre mim!` },
        { message: "Bom desempenho! 😊", description: `Até que foi bem, ${userName}!` },
        { message: "Continue tentando! 💪", description: `${userName}, continue estudando sobre mim!` },
        { message: "Não desista! 🚀", description: `${userName}, na próxima você consegue melhor!` }
    ];

    let messageIndex;
    if (score === 10) messageIndex = 0;
    else if (score >= 8) messageIndex = 0;
    else if (score >= 6) messageIndex = 1;
    else if (score >= 4) messageIndex = 2;
    else messageIndex = 3;

    document.getElementById('resultMessage').textContent = messages[messageIndex].message;
    document.getElementById('resultDescription').textContent = messages[messageIndex].description;

    // Exibir score final de forma destacada
    const scorePercentage = Math.round((score / 10) * 100);
    const finalScoreDiv = document.getElementById('resultFinalScore');
    finalScoreDiv.innerHTML = `
        <div class="score-breakdown">
            <p class="score-percentage">${scorePercentage}%</p>
            <p class="score-details">Você acertou ${score} de 10 questões</p>
        </div>
    `;

    generateStars();
    createConfetti();
}

function generateStars() {
    const container = document.getElementById('starsContainer');
    const starCount = Math.min(Math.ceil(score / 2), 5);
    container.innerHTML = '<div class="stars">';
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        container.querySelector('.stars').appendChild(star);
    }
    container.innerHTML += '</div>';
}

function updateLiveScore() {
    const liveScoreElement = document.getElementById('liveScore');
    if (liveScoreElement) {
        liveScoreElement.innerHTML = `Pontuação: <strong>${score} / 10</strong>`;
    }
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.background = ['#0033cc', '#0066ff', '#000000', '#0a0e27'][Math.floor(Math.random() * 4)];
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

function restartQuiz() {
    // Quiz com única chance - não permitir reiniciar
    alert('Você teve sua única chance! Obrigado por participar do meu quiz.');
}

// ====================================
// ANIMAÇÕES INTERATIVAS DOS BOTÕES
// ====================================
function setupButtonAnimations() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        // Remover listeners antigos
        button.removeEventListener('mouseenter', handleButtonHover);
        button.removeEventListener('mouseleave', handleButtonHoverOut);
        button.removeEventListener('mousedown', handleButtonPress);
        button.removeEventListener('mouseup', handleButtonRelease);
        button.removeEventListener('mousemove', handleButtonMouseMove);

        // Adicionar novos listeners
        button.addEventListener('mouseenter', handleButtonHover);
        button.addEventListener('mouseleave', handleButtonHoverOut);
        button.addEventListener('mousedown', handleButtonPress);
        button.addEventListener('mouseup', handleButtonRelease);
        button.addEventListener('mousemove', handleButtonMouseMove);
    });
}

function handleButtonHover(e) {
    const button = e.currentTarget;
    
    // Criar brilho ao redor
    createGlow(button);
    
    // Adicionar classe de hover
    button.classList.add('button-hovering');
    button.style.transform = 'translateY(-4px) scale(1.05)';
    
    // Criar ondas de energia
    createEnergyWaves(button);
}

function handleButtonHoverOut(e) {
    const button = e.currentTarget;
    button.classList.remove('button-hovering');
    button.style.transform = 'translateY(0) scale(1)';
    
    // Remover brilhos
    const glows = button.querySelectorAll('.button-glow');
    glows.forEach(glow => glow.remove());
}

function handleButtonPress(e) {
    const button = e.currentTarget;
    
    if (!button.disabled) {
        button.style.transform = 'translateY(-1px) scale(0.95)';
        
        // Criar explosão de partículas
        createButtonExplosion(button);
        
        // Vibração ao clicar
        triggerHaptic();
    }
}

function handleButtonRelease(e) {
    const button = e.currentTarget;
    button.style.transform = 'translateY(-4px) scale(1.05)';
}

function handleButtonMouseMove(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Criar efeito de luz seguindo o cursor
    const light = document.createElement('div');
    light.style.position = 'absolute';
    light.style.width = '30px';
    light.style.height = '30px';
    light.style.background = 'radial-gradient(circle, rgba(0, 102, 255, 0.5) 0%, transparent 70%)';
    light.style.left = x + 'px';
    light.style.top = y + 'px';
    light.style.transform = 'translate(-50%, -50%)';
    light.style.pointerEvents = 'none';
    light.style.borderRadius = '50%';
    light.style.animation = 'lightFade 0.5s ease-out forwards';
    
    button.appendChild(light);
    
    setTimeout(() => light.remove(), 500);
}

// ====================================
// EFEITOS VISUAIS
// ====================================
function createGlow(element) {
    const glow = document.createElement('div');
    glow.className = 'button-glow';
    glow.style.position = 'absolute';
    glow.style.width = '100%';
    glow.style.height = '100%';
    glow.style.borderRadius = 'inherit';
    glow.style.boxShadow = '0 0 30px rgba(0, 102, 255, 0.8)';
    glow.style.pointerEvents = 'none';
    glow.style.animation = 'glowPulse 1s ease-in-out infinite';
    
    element.style.position = 'relative';
    element.appendChild(glow);
}

function createEnergyWaves(element) {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const wave = document.createElement('div');
            wave.style.position = 'absolute';
            wave.style.width = '100%';
            wave.style.height = '100%';
            wave.style.border = '2px solid rgba(0, 102, 255, 0.5)';
            wave.style.borderRadius = 'inherit';
            wave.style.pointerEvents = 'none';
            wave.style.animation = 'energyWave 0.8s ease-out forwards';
            
            element.style.position = 'relative';
            element.appendChild(wave);
            
            setTimeout(() => wave.remove(), 800);
        }, i * 150);
    }
}

function createButtonExplosion(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.background = '#0066ff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = '0 0 10px rgba(0, 102, 255, 0.8)';
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 8;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let x = centerX;
        let y = centerY;
        let life = 1;
        
        const animate = setInterval(() => {
            x += vx;
            y += vy;
            life -= 0.03;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = life;
            
            if (life <= 0) {
                clearInterval(animate);
                particle.remove();
            }
        }, 16);
    }
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.background = '#0033cc';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = '0 0 8px rgba(0, 51, 204, 0.8)';
        
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 6;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let x = centerX;
        let y = centerY;
        let life = 1;
        
        const animate = setInterval(() => {
            x += vx;
            y += vy;
            life -= 0.04;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = life;
            
            if (life <= 0) {
                clearInterval(animate);
                particle.remove();
            }
        }, 16);
    }
}

// ====================================
// ANIMAÇÕES DE FEEDBACK
// ====================================
function createSuccessAnimation(element) {
    // Criar partículas verdes
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.background = '#22c55e';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.8)';

        const angle = (i / 12) * Math.PI * 2;
        const velocity = 8;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        document.body.appendChild(particle);

        let x = centerX;
        let y = centerY;
        let life = 1;

        const animate = setInterval(() => {
            x += vx;
            y += vy;
            life -= 0.03;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = life;

            if (life <= 0) {
                clearInterval(animate);
                particle.remove();
            }
        }, 16);
    }
}

function createErrorAnimation(element) {
    // Criar partículas vermelhas
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.background = '#ef4444';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.8)';

        const angle = (i / 12) * Math.PI * 2;
        const velocity = 8;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        document.body.appendChild(particle);

        let x = centerX;
        let y = centerY;
        let life = 1;

        const animate = setInterval(() => {
            x += vx;
            y += vy;
            life -= 0.03;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = life;

            if (life <= 0) {
                clearInterval(animate);
                particle.remove();
            }
        }, 16);
    }
}

// ====================================
// ANIMAÇÕES DE OPÇÕES
// ====================================
function setupOptionAnimations() {
    const options = document.querySelectorAll('.option-label');
    
    options.forEach((label) => {
        label.removeEventListener('mouseenter', handleOptionHover);
        label.removeEventListener('mouseleave', handleOptionHoverOut);
        
        label.addEventListener('mouseenter', handleOptionHover);
        label.addEventListener('mouseleave', handleOptionHoverOut);
    });
}

function handleOptionHover(e) {
    const label = e.currentTarget;
    label.style.transform = 'translateX(8px) scale(1.02)';
    
    // Criar brilho
    const shine = document.createElement('div');
    shine.style.position = 'absolute';
    shine.style.width = '100%';
    shine.style.height = '100%';
    shine.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)';
    shine.style.left = '0';
    shine.style.top = '0';
    shine.style.borderRadius = 'inherit';
    shine.style.animation = 'shineEffect 0.6s ease-in-out';
    shine.style.pointerEvents = 'none';
    
    label.style.position = 'relative';
    label.appendChild(shine);
    
    setTimeout(() => shine.remove(), 600);
}

function handleOptionHoverOut(e) {
    const label = e.currentTarget;
    label.style.transform = 'translateX(0) scale(1)';
}

// ====================================
// FEEDBACK HÁPTICO
// ====================================
function triggerHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// ====================================
// EFEITOS CSS DINÂMICOS
// ====================================
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glowPulse {
            0%, 100% {
                box-shadow: 0 0 30px rgba(0, 102, 255, 0.8);
            }
            50% {
                box-shadow: 0 0 50px rgba(0, 102, 255, 1);
            }
        }

        @keyframes energyWave {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(1.3);
                opacity: 0;
            }
        }

        @keyframes lightFade {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
        }

        @keyframes shineEffect {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }

        button {
            position: relative;
            overflow: hidden;
        }

        .button-hovering {
            box-shadow: 0 10px 30px rgba(0, 102, 255, 0.6) !important;
        }

        .option-label {
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
        }

        .correct-answer {
            background: #22c55e !important;
            color: white !important;
            border-color: #22c55e !important;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6) !important;
        }

        .show-correct {
            animation: correctPulse 0.6s ease-out;
        }

        .wrong-answer {
            background: #ef4444 !important;
            color: white !important;
            border-color: #ef4444 !important;
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.6) !important;
            animation: wrongShake 0.5s ease-in-out;
        }

        @keyframes correctPulse {
            0% {
                transform: scale(1) rotate(0deg);
            }
            50% {
                transform: scale(1.05) rotate(2deg);
            }
            100% {
                transform: scale(1) rotate(0deg);
            }
        }

        @keyframes wrongShake {
            0%, 100% {
                transform: translateX(0);
            }
            25% {
                transform: translateX(-5px);
            }
            75% {
                transform: translateX(5px);
            }
        }

        .feedback-message {
            margin-top: 20px;
            padding: 15px 20px;
            border-radius: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: feedbackSlide 0.5s ease-out;
        }

        .feedback-message.correct {
            background: rgba(34, 197, 94, 0.15);
            border: 2px solid #22c55e;
            color: #22c55e;
        }

        .feedback-message.wrong {
            background: rgba(239, 68, 68, 0.15);
            border: 2px solid #ef4444;
            color: #ef4444;
        }

        .feedback-icon {
            font-size: 1.5em;
            font-weight: bold;
        }

        @keyframes feedbackSlide {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .name-input-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            animation: containerEntry 0.8s ease-out;
        }

        .name-input-box {
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .input-icon {
            font-size: 1.5em;
        }

        .name-input {
            padding: 15px 20px;
            font-size: 1.1em;
            border: none;
            border-bottom: 2px solid rgba(0, 102, 255, 0.3);
            background: transparent;
            color: var(--light-text);
            font-family: inherit;
            transition: all 0.3s ease;
            min-width: 300px;
        }

        .name-input:focus {
            outline: none;
            border-bottom: 2px solid #0066ff;
            box-shadow: 0 0 20px rgba(0, 102, 255, 0.3);
        }

        .name-input::placeholder {
            color: rgba(240, 240, 240, 0.5);
        }

        .name-description {
            color: #a0a0ff;
            font-size: 0.95em;
            margin-top: 5px;
        }

        .btn-start {
            background: linear-gradient(135deg, #0033cc 0%, #0066ff 100%);
            color: white;
            margin-top: 20px;
        }

        .btn-start:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .user-result-name {
            color: #0099ff;
            font-size: 1.3em;
            font-weight: 600;
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);
}

// ====================================
// INICIALIZAÇÃO
// ====================================
window.addEventListener('load', () => {
    injectDynamicStyles();
    showNameScreen();
});

// ===== Healthy Lifestyle Hub — Main Script =====

// Local Storage Keys
const STORAGE = {
    progress: 'hlh_progress',
    points: 'hlh_points',
    badges: 'hlh_badges'
};

// Initialize state on page load
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    updatePoints();
    setupTestHandlers();
    setupNavigation();
});

// ===== Progress tracking =====
function getProgress() {
    return JSON.parse(localStorage.getItem(STORAGE.progress) || '{}');
}

function markLessonComplete(lessonNumber) {
    const progress = getProgress();
    progress[`lesson${lessonNumber}`] = true;
    localStorage.setItem(STORAGE.progress, JSON.stringify(progress));
    addPoints(10);
    showBadge(`Lesson ${lessonNumber} completed!`);
}

function updateProgress() {
    const progress = getProgress();
    const completed = Object.values(progress).filter(v => v).length;
    const total = 10;
    const percent = Math.round((completed / total) * 100);

    const bar = document.getElementById('progress-bar');
    if (bar) {
        bar.style.width = percent + '%';
        bar.textContent = `${completed}/${total} уроков (${percent}%)`;
    }
}

// ===== Health Points =====
function getPoints() {
    return parseInt(localStorage.getItem(STORAGE.points) || '0');
}

function addPoints(amount) {
    const current = getPoints();
    const newTotal = current + amount;
    localStorage.setItem(STORAGE.points, newTotal.toString());
    updatePoints();
}

function updatePoints() {
    const el = document.getElementById('hp-counter');
    if (el) {
        el.textContent = getPoints();
    }
}

// ===== Tests =====
function setupTestHandlers() {
    const tests = document.querySelectorAll('.test-form');
    tests.forEach(form => {
        const submitBtn = form.querySelector('.test-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                checkTest(form);
            });
        }
    });
}

function checkTest(form) {
    const questions = form.querySelectorAll('.test-question');
    let correct = 0;
    let total = questions.length;

    questions.forEach(q => {
        const correctAnswer = q.dataset.answer;
        const selected = q.querySelector('input[type="radio"]:checked');
        const options = q.querySelectorAll('.test-option');

        options.forEach(opt => {
            opt.classList.remove('correct', 'incorrect');
            const input = opt.querySelector('input');
            if (input && input.value === correctAnswer) {
                opt.classList.add('correct');
            }
        });

        if (selected) {
            if (selected.value === correctAnswer) {
                correct++;
            } else {
                selected.closest('.test-option').classList.add('incorrect');
            }
        }
    });

    showResult(form, correct, total);
    addPoints(correct);
}

function showResult(form, correct, total) {
    const percent = Math.round((correct / total) * 100);
    let grade, color, message;

    if (percent >= 90) {
        grade = '🏆 Отлично! (10)';
        color = '#27AE60';
        message = 'Превосходный результат!';
    } else if (percent >= 75) {
        grade = '🥇 Хорошо (8–9)';
        color = '#2ECC71';
        message = 'Хороший результат, можно лучше!';
    } else if (percent >= 60) {
        grade = '🥈 Удовлетворительно (5–7)';
        color = '#F39C12';
        message = 'Повтори тему ещё раз.';
    } else {
        grade = '🔄 Нужно повторить';
        color = '#E74C3C';
        message = 'Не сдавайся! Изучи материал и попробуй снова.';
    }

    let result = form.querySelector('.result-box');
    if (!result) {
        result = document.createElement('div');
        result.className = 'result-box';
        form.appendChild(result);
    }

    result.innerHTML = `
        <h3 style="color: ${color}">${grade}</h3>
        <div class="result-score" style="color: ${color}">${correct}/${total}</div>
        <p>${percent}% правильных ответов</p>
        <p>${message}</p>
        <p>+${correct} Health Points 💚</p>
        <button class="btn" onclick="location.reload()">Пройти ещё раз</button>
    `;

    result.scrollIntoView({ behavior: 'smooth' });
}

// ===== Badges =====
function showBadge(text) {
    const badge = document.createElement('div');
    badge.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #2ECC71, #27AE60);
        color: white; padding: 1rem 1.5rem; border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 1000; font-weight: bold;
        animation: slideIn 0.5s ease-out;
    `;
    badge.textContent = '🏆 ' + text;
    document.body.appendChild(badge);

    setTimeout(() => {
        badge.style.opacity = '0';
        badge.style.transition = 'opacity 0.5s';
        setTimeout(() => badge.remove(), 500);
    }, 3000);
}

// ===== Navigation =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Track navigation
            const target = link.getAttribute('href');
            if (target && target.startsWith('#')) {
                e.preventDefault();
                const el = document.querySelector(target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== Reset Progress (for testing) =====
function resetProgress() {
    if (confirm('Сбросить весь прогресс курса?')) {
        localStorage.removeItem(STORAGE.progress);
        localStorage.removeItem(STORAGE.points);
        localStorage.removeItem(STORAGE.badges);
        location.reload();
    }
}

// Animation styles
const styleEl = document.createElement('style');
styleEl.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(styleEl);

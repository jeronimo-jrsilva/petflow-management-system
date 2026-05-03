// --- ESTADO GLOBAL E UTILITÁRIOS ---
function getPetFlowData() {
    return JSON.parse(localStorage.getItem('petflow_data'));
}

function savePetFlowData(data) {
    localStorage.setItem('petflow_data', JSON.stringify(data));
}

// Lógica de Calendário (Pula Fim de Semana)
function getNextBusinessDays(count) {
    const days = [];
    let current = new Date();
    while (days.length < count) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) { 
            days.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }
    return days;
}

// --- NAVEGAÇÃO E UI ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) selectedPage.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(pageId)) item.classList.add('active');
    });

    if (pageId === 'dashboard') renderDashboard();
    if (pageId === 'agenda') renderAgenda();
    if (pageId === 'pets') renderPets();
}

function openModal(modalId) { 
    const m = document.getElementById(modalId);
    if(m) m.classList.add('active'); 
    else alert("Funcionalidade em desenvolvimento para o MVP!");
}

function closeModal(modalId) { 
    const m = document.getElementById(modalId);
    if(m) m.classList.remove('active'); 
}

function toggleDarkMode() {
    const html = document.documentElement;
    const btn = document.getElementById('dark-mode-toggle');
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        btn.innerText = 'Ativar';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        btn.innerText = 'Desativar';
        localStorage.setItem('theme', 'dark');
    }
}

function showMap() {
    alert("📍 Gerando rota otimizada para o Google Maps...\nBairros: Aldeota, Meireles e Dionísio Torres.");
}

// --- RENDERIZAÇÃO ---
function renderCalendar() {
    const strip = document.getElementById('calendar-strip');
    const days = getNextBusinessDays(3);
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    strip.innerHTML = days.map((date, index) => `
        <div class="day-bubble ${index === 0 ? 'active' : ''}">
            <span>${index === 0 ? 'Hoje' : dayNames[date.getDay()]}</span>
            <strong>${date.getDate().toString().padStart(2, '0')}</strong>
        </div>
    `).join('');
}

function renderDashboard() {
    const data = getPetFlowData();
    const list = document.getElementById('dashboard-route-list');
    const count = document.getElementById('today-count');
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = data.agendamentos.filter(a => a.data === todayStr);

    count.innerText = todayAppointments.length;
    
    if (todayAppointments.length === 0) {
        list.innerHTML = '<li class="route-item"><div class="info">Nenhum atendimento para hoje.</div></li>';
        return;
    }

    list.innerHTML = todayAppointments.map(a => `
        <li class="route-item">
            <span class="time">${a.hora}</span>
            <div class="info">
                <span class="pet-name">${a.pet_nome}</span>
                <span class="service">${a.servico}</span>
            </div>
            <span class="status">Pendente</span>
        </li>
    `).join('');
}

function renderAgenda() {
    const list = document.getElementById('agenda-timeline');
    const data = getPetFlowData();
    const days = getNextBusinessDays(3);
    
    list.innerHTML = days.map(day => {
        const dateStr = day.toISOString().split('T')[0];
        const dayApps = data.agendamentos.filter(a => a.data === dateStr);
        const dayName = day.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

        return `
            <div style="margin-top: 1.5rem;">
                <h3 style="font-size: 0.9rem; color: var(--text-muted); text-transform: capitalize; margin-bottom: 0.5rem;">${dayName}</h3>
                ${dayApps.length === 0 ? '<p>Sem agendamentos.</p>' : dayApps.map(a => `
                    <div class="card" style="margin-top: 0.5rem; padding: 0.75rem;">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <span class="time" style="font-size: 0.9rem;">${a.hora}</span>
                            <div>
                                <strong style="font-size: 1rem;">${a.pet_nome}</strong>
                                <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">${a.servico}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

function renderPets(filter = '') {
    const data = getPetFlowData();
    const list = document.getElementById('pet-list');
    list.innerHTML = '';

    const filtered = data.pets.filter(p => 
        p.nome.toLowerCase().includes(filter.toLowerCase()) || 
        p.tutor.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        list.innerHTML = '<p style="padding: 1rem; color: var(--text-muted);">Nenhum pet encontrado.</p>';
        return;
    }

    filtered.forEach(pet => {
        const item = document.createElement('div');
        item.className = 'card';
        item.style.marginBottom = '1rem';
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="font-size: 1.1rem;">${pet.nome} 🐶</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Tutor: <strong>${pet.tutor}</strong></p>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Pelo: ${pet.pelo}</p>
                </div>
                <button class="btn-action" onclick="alert('Iniciando conversa com ${pet.tutor}...')">Zap</button>
            </div>
        `;
        list.appendChild(item);
    });
}

function searchPets() {
    const val = document.getElementById('pet-search').value;
    renderPets(val);
}

// --- CADASTRO E GERADOR DE DADOS ---
function seedInitialData() {
    const days = getNextBusinessDays(3);
    const pets = [
        { id: 1, nome: "Max", pelo: "longo", tutor: "Jeronimo" },
        { id: 2, nome: "Luna", pelo: "medio", tutor: "Elaine" },
        { id: 3, nome: "Bidu", pelo: "curto", tutor: "Damaris" },
        { id: 4, nome: "Mel", pelo: "curto", tutor: "Daniela" },
        { id: 5, nome: "Thor", pelo: "longo", tutor: "Henrique" }
    ];

    const servicos = ["Banho", "Tosa Higiênica", "Banho + Hidratação", "Tosa Completa"];
    const horas = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"];
    
    const agendamentos = [];

    days.forEach(day => {
        const dateStr = day.toISOString().split('T')[0];
        // Gera 3 a 4 atendimentos por dia
        const dailyCount = 3 + Math.floor(Math.random() * 2);
        const shuffledHours = [...horas].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < dailyCount; i++) {
            const randomPet = pets[Math.floor(Math.random() * pets.length)];
            const randomService = servicos[Math.floor(Math.random() * servicos.length)];
            agendamentos.push({
                pet_nome: randomPet.nome,
                data: dateStr,
                hora: shuffledHours[i],
                servico: randomService
            });
        }
    });

    const initialData = {
        tutores: [],
        pets: pets,
        agendamentos: agendamentos.sort((a, b) => a.hora.localeCompare(b.hora))
    };
    savePetFlowData(initialData);
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Carrega Tema
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const btn = document.getElementById('dark-mode-toggle');
        if (btn) btn.innerText = 'Desativar';
    }

    // Sempre regera os dados dinâmicos para garantir que "Hoje" seja hoje
    seedInitialData();

    // Vincula o formulário
    const form = document.getElementById('form-pet');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = getPetFlowData();
            const newPet = {
                id: Date.now(),
                nome: document.getElementById('new-pet-name').value,
                pelo: document.getElementById('new-pet-hair').value,
                tutor: document.getElementById('new-tutor-name').value
            };
            data.pets.push(newPet);
            savePetFlowData(data);
            alert('Pet cadastrado! 🐾');
            closeModal('modal-pet');
            renderPets();
        });
    }

    renderCalendar();
    renderDashboard();
    
    // Vincula botão de Mapa (que estava quebrado por não ter ID ou onclick no HTML antigo)
    const mapBtn = document.querySelector('.routes-card button');
    if(mapBtn) mapBtn.onclick = showMap;
});

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

// Dark Mode
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

// Modais
function openModal(modalId) { document.getElementById(modalId).classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId).classList.remove('active'); }

// Lógica de Calendário (Pula Fim de Semana)
function getNextBusinessDays(count) {
    const days = [];
    let current = new Date();
    while (days.length < count) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) { // Pula Domingo (0) e Sábado (6)
            days.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }
    return days;
}

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

// Renderização de Dados
function renderDashboard() {
    const data = JSON.parse(localStorage.getItem('petflow_data'));
    const list = document.getElementById('dashboard-route-list');
    const count = document.getElementById('today-count');
    
    const todayAppointments = data.agendamentos.filter(a => {
        const d = new Date(a.data_hora);
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    });

    count.innerText = todayAppointments.length;
    
    if (todayAppointments.length === 0) {
        list.innerHTML = '<li class="route-item"><div class="info">Nenhum atendimento para hoje.</div></li>';
        return;
    }

    list.innerHTML = todayAppointments.map(a => `
        <li class="route-item">
            <span class="time">${a.data_hora.split('T')[1]}</span>
            <div class="info">
                <span class="pet-name">${a.pet_nome}</span>
                <span class="service">${a.servico}</span>
            </div>
        </li>
    `).join('');
}

function renderPets(filter = '') {
    const data = JSON.parse(localStorage.getItem('petflow_data'));
    const list = document.getElementById('pet-list');
    list.innerHTML = '';

    const filtered = data.pets.filter(p => 
        p.nome.toLowerCase().includes(filter.toLowerCase()) || 
        p.tutor.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(pet => {
        const item = document.createElement('div');
        item.className = 'card';
        item.innerHTML = `<h3>${pet.nome} 🐶</h3><p>Pelo: ${pet.pelo} | Tutor: ${pet.tutor}</p>`;
        list.appendChild(item);
    });
}

function searchPets() {
    const val = document.getElementById('pet-search').value;
    renderPets(val);
}

function renderAgenda() {
    const list = document.getElementById('agenda-timeline');
    const data = JSON.parse(localStorage.getItem('petflow_data'));
    
    if (data.agendamentos.length === 0) {
        list.innerHTML = '<p style="padding: 1rem; color: var(--text-muted);">Nenhum agendamento futuro.</p>';
        return;
    }

    list.innerHTML = data.agendamentos.map(a => `
        <div class="card">
            <div style="display: flex; gap: 1rem;">
                <span class="time">${a.data_hora.split('T')[1]}</span>
                <div>
                    <strong>${a.pet_nome}</strong>
                    <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">${a.servico}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Cadastro
document.getElementById('form-pet').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('petflow_data'));
    
    const newPet = {
        id: Date.now(),
        nome: document.getElementById('new-pet-name').value,
        pelo: document.getElementById('new-pet-hair').value,
        tutor: document.getElementById('new-tutor-name').value
    };

    data.pets.push(newPet);
    
    // Simula um agendamento automático para teste do Dashboard
    const now = new Date();
    const mockAgendamento = {
        pet_nome: newPet.nome,
        data_hora: now.toISOString().split('T')[0] + 'T14:00',
        servico: "Banho (Primeira Vez)"
    };
    data.agendamentos.push(mockAgendamento);

    localStorage.setItem('petflow_data', JSON.stringify(data));
    
    alert('Pet cadastrado! Um atendimento de boas-vindas foi gerado para hoje às 14:00. 🐾');
    closeModal('modal-pet');
    renderPets();
    renderDashboard();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('PetFlow Web App Iniciado 🚀');
    
    // Carrega Tema
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const btn = document.getElementById('dark-mode-toggle');
        if (btn) btn.innerText = 'Desativar';
    }

    if (!localStorage.getItem('petflow_data')) {
        const today = new Date().toISOString().split('T')[0];
        const initialData = {
            tutores: [],
            pets: [
                { id: 1, nome: "Max", pelo: "longo", tutor: "Jeronimo" },
                { id: 2, nome: "Luna", pelo: "medio", tutor: "Elaine" }
            ],
            agendamentos: [
                { pet_nome: "Max", data_hora: `${today}T09:00`, servico: "Banho + Hidratação" },
                { pet_nome: "Luna", data_hora: `${today}T10:30`, servico: "Tosa Higiênica" }
            ]
        };
        localStorage.setItem('petflow_data', JSON.stringify(initialData));
    }

    renderCalendar();
    renderDashboard();
});

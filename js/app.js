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
}

function closeModal(modalId) { 
    const m = document.getElementById(modalId);
    if(m) m.classList.remove('active'); 
}

function toggleDarkMode() {
    const html = document.documentElement;
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

function showMap() {
    alert("📍 Gerando rota otimizada para o Google Maps...\nBairros atendidos hoje: Aldeota e Meireles.");
}

// --- RENDERIZAÇÃO ---
function renderCalendar() {
    const strip = document.getElementById('calendar-strip');
    if(!strip) return;
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
    if(!list) return;
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
    if(!list) return;
    list.innerHTML = '';

    const filtered = data.pets.filter(p => 
        p.nome.toLowerCase().includes(filter.toLowerCase()) || 
        p.tutor.toLowerCase().includes(filter.toLowerCase()) ||
        p.endereco.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(pet => {
        // Cálculo de contagem regressiva (simulado)
        const diff = Math.floor(Math.random() * 15); // Dias restantes
        let cdClass = 'cd-ok';
        if (diff < 3) cdClass = 'cd-urgent';
        else if (diff < 7) cdClass = 'cd-soon';

        const item = document.createElement('div');
        item.className = 'card pet-card';
        item.onclick = () => openPetProfile(pet.id);
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="font-size: 1.1rem;">${pet.nome} 🐶</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">${pet.endereco}</p>
                </div>
                <span class="countdown-badge ${cdClass}">${diff} dias</span>
            </div>
        `;
        list.appendChild(item);
    });
}

function openPetProfile(petId) {
    const data = getPetFlowData();
    const pet = data.pets.find(p => p.id === petId);
    const content = document.getElementById('pet-profile-content');
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 4rem;">🐶</div>
            <h1 style="font-size: 2rem;">${pet.nome}</h1>
            <span class="badge">${pet.pelo}</span>
        </div>
        
        <div class="card">
            <h2>Dados do Tutor</h2>
            <p><strong>Nome:</strong> ${pet.tutor}</p>
            <p><strong>Endereço:</strong> ${pet.endereco}</p>
            <button class="btn-action" style="width: 100%; margin-top: 1rem;" onclick="alert('Chamando no Zap...')">Chamar no WhatsApp</button>
        </div>

        <div class="card">
            <h2>Histórico Recente</h2>
            <ul class="price-list">
                <li><span>20/04 - Banho</span> <strong>R$ 50,00</strong></li>
                <li><span>05/04 - Tosa Completa</span> <strong>R$ 90,00</strong></li>
            </ul>
        </div>

        <div class="card">
            <h2>Próxima Sugestão</h2>
            <p>Com base no ciclo de 15 dias, sugerimos novo banho para:</p>
            <strong style="color: var(--primary); font-size: 1.2rem;">05/05/2026</strong>
        </div>
    `;
    openModal('modal-profile');
}

function searchPets() {
    const val = document.getElementById('pet-search').value;
    renderPets(val);
}

// --- CADASTRO E GERADOR DE DADOS ---
function seedInitialData() {
    const days = getNextBusinessDays(3);
    const pets = [
        { id: 1, nome: "Max", pelo: "longo", tutor: "Jeronimo", endereco: "Rua Silva Paulet, 120 - Aldeota" },
        { id: 2, nome: "Luna", pelo: "medio", tutor: "Elaine", endereco: "Av. Dom Luís, 500 - Meireles" },
        { id: 3, nome: "Bidu", pelo: "curto", tutor: "Damaris", endereco: "Rua Maria Tomásia, 300 - Aldeota" },
        { id: 4, nome: "Mel", pelo: "curto", tutor: "Daniela", endereco: "Rua Ana Bilhar, 1000 - Meireles" },
        { id: 5, nome: "Thor", pelo: "longo", tutor: "Henrique", endereco: "Av. Beira Mar, 2500 - Meireles" }
    ];

    const servicos = ["Banho", "Tosa Higiênica", "Banho + Hidratação", "Tosa Completa"];
    const horas = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"];
    
    const agendamentos = [];

    days.forEach(day => {
        const dateStr = day.toISOString().split('T')[0];
        const dailyCount = 3;
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
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    seedInitialData();

    const form = document.getElementById('form-pet');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = getPetFlowData();
            const newPet = {
                id: Date.now(),
                nome: document.getElementById('new-pet-name').value,
                pelo: document.getElementById('new-pet-hair').value,
                tutor: document.getElementById('new-tutor-name').value,
                endereco: document.getElementById('new-pet-address').value
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
    
    const mapBtn = document.querySelector('.routes-card button');
    if(mapBtn) mapBtn.onclick = showMap;
});

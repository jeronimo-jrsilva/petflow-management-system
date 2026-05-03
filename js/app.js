// --- ESTADO GLOBAL ---
function getPetFlowData() {
    return JSON.parse(localStorage.getItem('petflow_data'));
}

function savePetFlowData(data) {
    localStorage.setItem('petflow_data', JSON.stringify(data));
}

// Lógica de Calendário
function getNextBusinessDays(count) {
    const days = [];
    let current = new Date();
    while (days.length < count) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return days;
}

// --- UI E NAVEGAÇÃO ---
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

function openModal(modalId) { document.getElementById(modalId).classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId).classList.remove('active'); }

function toggleDarkMode() {
    const html = document.documentElement;
    html.getAttribute('data-theme') === 'dark' ? html.removeAttribute('data-theme') : html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', html.getAttribute('data-theme') || 'light');
}

// --- LOGÍSTICA E OPERAÇÃO ---
function onMyWay(petName, tutor) {
    alert(`📢 Notificação enviada para ${tutor}:\n"Olá! O PetFlow está a caminho para o atendimento do ${petName}. Chegamos em instantes! 🐾"`);
}

function completeAppointment(id, petName, service) {
    const prices = { "Banho": 50, "Tosa Higiênica": 70, "Tosa Completa": 90, "Banho + Hidratação": 65 };
    const amount = prices[service] || 50;
    
    document.getElementById('pix-amount').innerText = `Total: R$ ${amount.toFixed(2)}`;
    document.getElementById('modal-pix').setAttribute('data-current-id', id);
    openModal('modal-pix');
}

function confirmPayment() {
    const id = document.getElementById('modal-pix').getAttribute('data-current-id');
    const data = getPetFlowData();
    const appIndex = data.agendamentos.findIndex(a => a.id == id);
    
    if (appIndex > -1) {
        data.agendamentos[appIndex].status = 'concluido';
        savePetFlowData(data);
    }

    alert("✅ Pagamento confirmado! Atendimento finalizado.");
    closeModal('modal-pix');
    renderDashboard();
}

// --- RENDERIZAÇÃO ---
function renderDashboard() {
    const data = getPetFlowData();
    const list = document.getElementById('dashboard-route-list');
    const todayStr = new Date().toISOString().split('T')[0];
    const todayApps = data.agendamentos.filter(a => a.data === todayStr && a.status === 'pendente');

    document.getElementById('today-count').innerText = todayApps.length;
    
    if (todayApps.length === 0) {
        list.innerHTML = '<li class="route-item">Nenhum atendimento pendente para hoje.</li>';
        return;
    }

    list.innerHTML = todayApps.map(a => `
        <li class="route-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <span class="time">${a.hora}</span>
                <div style="flex: 1; margin-left: 1rem;">
                    <strong class="pet-name">${a.pet_nome}</strong>
                    <span class="service">${a.servico} - ${a.bairro}</span>
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem; width: 100%; margin-top: 0.5rem;">
                <button class="btn-small" onclick="onMyWay('${a.pet_nome}', '${a.tutor}')">🚀 A caminho</button>
                <button class="btn-small" style="background: var(--success); color: white;" onclick="completeAppointment(${a.id}, '${a.pet_nome}', '${a.servico}')">✅ Concluir</button>
            </div>
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
        const dayName = day.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' });

        return `
            <div style="margin-top: 1.5rem;">
                <h3 style="font-size: 0.9rem; color: var(--text-muted); text-transform: capitalize; margin-bottom: 0.5rem;">${dayName}</h3>
                ${dayApps.map(a => `
                    <div class="card" style="padding: 0.75rem; border-left: 4px solid ${a.status === 'concluido' ? 'var(--success)' : 'var(--primary)'}">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span class="time">${a.hora}</span>
                                <strong>${a.pet_nome}</strong>
                                <p style="font-size: 0.8rem; color: var(--text-muted);">${a.servico} | ${a.bairro}</p>
                            </div>
                            ${a.status === 'concluido' ? '✅' : ''}
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
        p.tutor.toLowerCase().includes(filter.toLowerCase()) ||
        p.endereco.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(pet => {
        const diff = Math.floor(Math.random() * 15);
        let cdClass = diff < 3 ? 'cd-urgent' : (diff < 7 ? 'cd-soon' : 'cd-ok');

        const item = document.createElement('div');
        item.className = 'card pet-card';
        item.onclick = () => openPetProfile(pet.id);
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <div><h3>${pet.nome} 🐶</h3><p style="font-size: 0.8rem; color: var(--text-muted);">${pet.endereco}</p></div>
                <span class="countdown-badge ${cdClass}">${diff}d</span>
            </div>
        `;
        list.appendChild(item);
    });
}

function searchPets() { renderPets(document.getElementById('pet-search').value); }

function openPetProfile(petId) {
    const pet = getPetFlowData().pets.find(p => p.id === petId);
    document.getElementById('pet-profile-content').innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;"><div style="font-size: 3rem;">🐶</div><h1>${pet.nome}</h1><span class="badge">${pet.pelo}</span></div>
        <div class="card"><h2>Tutor</h2><p>${pet.tutor}</p><p>${pet.endereco}</p></div>
        <div class="card"><h2>Sugestão</h2><p>Próximo contato sugerido para o dia 15/05.</p></div>
    `;
    openModal('modal-profile');
}

// --- DADOS INICIAIS (15 PETS) ---
function seedInitialData() {
    const pets = [
        { id: 1, nome: "Max", pelo: "longo", tutor: "Jeronimo", endereco: "Rua Silva Paulet - Aldeota" },
        { id: 2, nome: "Luna", pelo: "medio", tutor: "Elaine", endereco: "Av. Dom Luís - Meireles" },
        { id: 3, nome: "Bidu", pelo: "curto", tutor: "Damaris", endereco: "Rua Maria Tomásia - Aldeota" },
        { id: 4, nome: "Mel", pelo: "curto", tutor: "Daniela", endereco: "Rua Ana Bilhar - Meireles" },
        { id: 5, nome: "Thor", pelo: "longo", tutor: "Henrique", endereco: "Av. Beira Mar - Meireles" },
        { id: 6, nome: "Pipoca", pelo: "medio", tutor: "Fátima", endereco: "Rua Barbosa de Freitas - Aldeota" },
        { id: 7, nome: "Amora", pelo: "curto", tutor: "Cláudio", endereco: "Rua Desembargador Leite Albuquerque - Aldeota" },
        { id: 8, nome: "Frederico", pelo: "longo", tutor: "Sônia", endereco: "Rua Norvinda Pires - Meireles" },
        { id: 9, nome: "Cookie", pelo: "medio", tutor: "Roberto", endereco: "Av. Santos Dumont - Aldeota" },
        { id: 10, nome: "Bolinha", pelo: "curto", tutor: "Márcia", endereco: "Rua Canuto de Aguiar - Meireles" },
        { id: 11, nome: "Rex", pelo: "curto", tutor: "Antônio", endereco: "Rua Vicente Leite - Aldeota" },
        { id: 12, nome: "Belinha", pelo: "medio", tutor: "Patrícia", endereco: "Rua Pe. Valdevino - Aldeota" },
        { id: 13, nome: "Floquinho", pelo: "longo", tutor: "Carlos", endereco: "Av. Abolição - Meireles" },
        { id: 14, nome: "Pandora", pelo: "medio", tutor: "Bruna", endereco: "Rua Joaquim Nabuco - Aldeota" },
        { id: 15, nome: "Zeca", pelo: "curto", tutor: "Sérgio", endereco: "Rua Tibúrcio Cavalcante - Meireles" }
    ];

    const days = getNextBusinessDays(3);
    const agendamentos = [];
    let appId = 1;

    days.forEach(day => {
        const dateStr = day.toISOString().split('T')[0];
        const dayHours = ["08:00", "10:00", "14:00", "16:00"];
        const dailyPets = [...pets].sort(() => 0.5 - Math.random()).slice(0, 4);

        dailyPets.forEach((pet, i) => {
            agendamentos.push({
                id: appId++,
                pet_nome: pet.nome,
                tutor: pet.tutor,
                bairro: pet.endereco.split(' - ')[1],
                data: dateStr,
                hora: dayHours[i],
                servico: ["Banho", "Tosa Higiênica", "Tosa Completa"][Math.floor(Math.random() * 3)],
                status: 'pendente'
            });
        });
    });

    savePetFlowData({ tutores: [], pets, agendamentos });
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    seedInitialData();
    
    const form = document.getElementById('form-pet');
    if(form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const data = getPetFlowData();
            data.pets.push({
                id: Date.now(),
                nome: document.getElementById('new-pet-name').value,
                pelo: document.getElementById('new-pet-hair').value,
                tutor: document.getElementById('new-tutor-name').value,
                endereco: document.getElementById('new-pet-address').value
            });
            savePetFlowData(data);
            alert('Pet cadastrado! 🐾');
            closeModal('modal-pet');
            renderPets();
        };
    }
    
    renderCalendar();
    renderDashboard();
    const mapBtn = document.querySelector('.routes-card button');
    if(mapBtn) mapBtn.onclick = () => alert("📍 Rota otimizada gerada para o dia!");
});

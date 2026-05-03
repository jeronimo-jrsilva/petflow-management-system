// --- ESTADO GLOBAL ---
function getPetFlowData() {
    let data = JSON.parse(localStorage.getItem('petflow_data'));
    if (!data || !data.agendamentos || data.agendamentos.length < 5) {
        data = seedInitialData();
    }
    return data;
}

function savePetFlowData(data) {
    localStorage.setItem('petflow_data', JSON.stringify(data));
}

// Lógica de Calendário (Pula Fim de Semana para Exibição)
function getBusinessDate(offset) {
    let current = new Date();
    let added = 0;
    while (added < offset) {
        current.setDate(current.getDate() + 1);
        if (current.getDay() !== 0 && current.getDay() !== 6) added++;
    }
    // Se cair no fim de semana na partida, pula para segunda
    if (current.getDay() === 0) current.setDate(current.getDate() + 1);
    if (current.getDay() === 6) current.setDate(current.getDate() + 2);
    
    return current;
}

// --- UI E NAVEGAÇÃO ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

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
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// --- OPERAÇÃO ---
function onMyWay(petName, tutor) {
    alert(`📢 WhatsApp para ${tutor}:\n"Oi! O PetFlow está a caminho para o atendimento do ${petName}!"`);
}

function completeAppointment(id) {
    const data = getPetFlowData();
    const app = data.agendamentos.find(a => a.id == id);
    const prices = { "Banho": 50, "Tosa Higiênica": 70, "Tosa Completa": 90, "Banho + Hidratação": 65 };
    
    document.getElementById('pix-amount').innerText = `Total: R$ ${(prices[app.servico] || 50).toFixed(2)}`;
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
    alert("✅ Pagamento confirmado!");
    closeModal('modal-pix');
    renderDashboard();
}

// --- RENDERIZAÇÃO ---
function renderDashboard() {
    const data = getPetFlowData();
    const list = document.getElementById('dashboard-route-list');
    // Dashboard mostra apenas o "Dia 0" (Hoje)
    const todayApps = data.agendamentos.filter(a => a.dayOffset === 0 && a.status === 'pendente');

    document.getElementById('today-count').innerText = todayApps.length;
    
    if (todayApps.length === 0) {
        list.innerHTML = '<li class="route-item" style="color: var(--text-muted)">Nenhum atendimento pendente para hoje. 🎉</li>';
        return;
    }

    list.innerHTML = todayApps.map(a => `
        <li class="route-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 1rem 0;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <span class="time">${a.hora}</span>
                <div style="flex: 1; margin-left: 1rem;">
                    <strong class="pet-name">${a.pet_nome}</strong>
                    <span class="service">${a.servico} - ${a.bairro}</span>
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem; width: 100%;">
                <button class="btn-small" onclick="onMyWay('${a.pet_nome}', '${a.tutor}')">🚀 A caminho</button>
                <button class="btn-small" style="background: var(--success); color: white;" onclick="completeAppointment(${a.id})">✅ Concluir</button>
            </div>
        </li>
    `).join('');
}

function renderAgenda() {
    const data = getPetFlowData();
    const list = document.getElementById('agenda-timeline');
    const offsets = [0, 1, 2];
    
    list.innerHTML = offsets.map(offset => {
        const date = getBusinessDate(offset);
        const dayApps = data.agendamentos.filter(a => a.dayOffset === offset);
        const dayLabel = offset === 0 ? "Hoje" : date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' });

        return `
            <div style="margin-top: 1.5rem;">
                <h3 style="font-size: 0.9rem; color: var(--text-muted); text-transform: capitalize; margin-bottom: 0.5rem;">${dayLabel}</h3>
                ${dayApps.map(a => `
                    <div class="card" style="padding: 0.75rem; border-left: 4px solid ${a.status === 'concluido' ? 'var(--success)' : 'var(--primary)'}">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span class="time">${a.hora}</span>
                                <strong>${a.pet_nome}</strong>
                                <p style="font-size: 0.8rem; color: var(--text-muted);">${a.servico} | ${a.bairro}</p>
                            </div>
                            <span>${a.status === 'concluido' ? '✅' : '⏳'}</span>
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
    const filtered = data.pets.filter(p => p.nome.toLowerCase().includes(filter.toLowerCase()) || p.tutor.toLowerCase().includes(filter.toLowerCase()));

    filtered.forEach(pet => {
        const diff = Math.floor(Math.random() * 15);
        let cdClass = diff < 3 ? 'cd-urgent' : (diff < 7 ? 'cd-soon' : 'cd-ok');
        const item = document.createElement('div');
        item.className = 'card pet-card';
        item.onclick = () => openPetProfile(pet.id);
        item.innerHTML = `<div style="display: flex; justify-content: space-between;"><div><h3>${pet.nome} 🐶</h3><p style="font-size: 0.8rem; color: var(--text-muted);">${pet.endereco}</p></div><span class="countdown-badge ${cdClass}">${diff}d</span></div>`;
        list.appendChild(item);
    });
}

function searchPets() { renderPets(document.getElementById('pet-search').value); }

function openPetProfile(petId) {
    const pet = getPetFlowData().pets.find(p => p.id === petId);
    document.getElementById('pet-profile-content').innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;"><div style="font-size: 3rem;">🐶</div><h1>${pet.nome}</h1><span class="badge">${pet.pelo}</span></div>
        <div class="card"><h2>Tutor</h2><p>${pet.tutor}</p><p>${pet.endereco}</p></div>
        <div class="card"><h2>Status</h2><p>Próximo contato sugerido para daqui a 5 dias.</p></div>
    `;
    openModal('modal-profile');
}

// --- DADOS INICIAIS (15 PETS FIXOS) ---
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

    const agendamentos = [
        // DIA 0 (Hoje)
        { id: 101, pet_nome: "Max", tutor: "Jeronimo", bairro: "Aldeota", dayOffset: 0, hora: "08:00", servico: "Banho + Hidratação", status: "pendente" },
        { id: 102, pet_nome: "Luna", tutor: "Elaine", bairro: "Meireles", dayOffset: 0, hora: "10:00", servico: "Tosa Higiênica", status: "pendente" },
        { id: 103, pet_nome: "Pipoca", tutor: "Fátima", bairro: "Aldeota", dayOffset: 0, hora: "14:00", servico: "Banho", status: "pendente" },
        // DIA 1 (Amanhã)
        { id: 104, pet_nome: "Bidu", tutor: "Damaris", bairro: "Aldeota", dayOffset: 1, hora: "09:00", servico: "Banho", status: "pendente" },
        { id: 105, pet_nome: "Thor", tutor: "Henrique", bairro: "Meireles", dayOffset: 1, hora: "11:00", servico: "Tosa Completa", status: "pendente" },
        { id: 106, pet_nome: "Amora", tutor: "Cláudio", bairro: "Aldeota", dayOffset: 1, hora: "15:00", servico: "Banho", status: "pendente" },
        // DIA 2 (Depois)
        { id: 107, pet_nome: "Mel", tutor: "Daniela", bairro: "Meireles", dayOffset: 2, hora: "08:30", servico: "Tosa Higiênica", status: "pendente" },
        { id: 108, pet_nome: "Rex", tutor: "Antônio", bairro: "Aldeota", dayOffset: 2, hora: "10:30", servico: "Banho", status: "pendente" },
        { id: 109, pet_nome: "Zeca", tutor: "Sérgio", bairro: "Meireles", dayOffset: 2, hora: "14:30", servico: "Banho", status: "pendente" }
    ];

    const data = { tutores: [], pets, agendamentos };
    savePetFlowData(data);
    return data;
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    
    // Sempre carrega os dados
    const data = getPetFlowData();
    
    const form = document.getElementById('form-pet');
    if(form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const currentData = getPetFlowData();
            currentData.pets.push({
                id: Date.now(),
                nome: document.getElementById('new-pet-name').value,
                pelo: document.getElementById('new-pet-hair').value,
                tutor: document.getElementById('new-tutor-name').value,
                endereco: document.getElementById('new-pet-address').value
            });
            savePetFlowData(currentData);
            alert('Pet cadastrado! 🐾');
            closeModal('modal-pet');
            renderPets();
        };
    }

    // Renderização inicial
    renderDashboard();
    
    // Configura botões globais
    const mapBtn = document.querySelector('.routes-card button');
    if(mapBtn) mapBtn.onclick = () => alert("📍 Rota otimizada gerada para o dia!");
});

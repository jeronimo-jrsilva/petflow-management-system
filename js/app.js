// --- ESTADO GLOBAL ---
function getPetFlowData() {
    let data = JSON.parse(localStorage.getItem('petflow_data'));
    const isOldFormat = data && data.agendamentos && data.agendamentos.length > 0 && !('dayOffset' in data.agendamentos[0]);
    if (!data || !data.agendamentos || data.agendamentos.length < 5 || isOldFormat) {
        data = seedInitialData();
    }
    return data;
}

function savePetFlowData(data) {
    localStorage.setItem('petflow_data', JSON.stringify(data));
}

// Lógica de Calendário
function getBusinessDate(offset) {
    let current = new Date();
    let added = 0;
    while (added < offset) {
        current.setDate(current.getDate() + 1);
        if (current.getDay() !== 0 && current.getDay() !== 6) added++;
    }
    if (current.getDay() === 0) current.setDate(current.getDate() + 1);
    if (current.getDay() === 6) current.setDate(current.getDate() + 2);
    return current;
}

// --- UI E NAVEGAÇÃO ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) selectedPage.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(pageId)) item.classList.add('active');
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
function onMyWay(petName, tutor, address) {
    const msg = encodeURIComponent(`Olá ${tutor}! 🐾 O PetFlow está a caminho para o atendimento do ${petName} no endereço: ${address}. Chegamos em breve! 🚀`);
    window.open(`https://wa.me/5585999999999?text=${msg}`, '_blank');
}

function sendRecall(petName, tutor) {
    const msg = encodeURIComponent(`Oi ${tutor}! 🐾 Notei que já faz um tempo que o ${petName} não toma banho com a gente. Que tal agendarmos para esta semana? Temos horários na Aldeota! 🛁`);
    window.open(`https://wa.me/5585999999999?text=${msg}`, '_blank');
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

function showMap() {
    const data = getPetFlowData();
    const todayApps = data.agendamentos.filter(a => a.dayOffset === 0 && a.status === 'pendente');
    if (todayApps.length === 0) { alert("Nenhum atendimento pendente."); return; }
    const destinations = todayApps.map(a => encodeURIComponent(`${a.endereco}, Fortaleza, CE`));
    window.open(`https://www.google.com/maps/dir/Meu+Local/${destinations.join('/')}`, '_blank');
}

function resetDemo() {
    if (confirm("Reiniciar demo?")) { localStorage.clear(); location.reload(); }
}

// --- RENDERIZAÇÃO ---
function renderDashboard() {
    const data = getPetFlowData();
    const list = document.getElementById('dashboard-route-list');
    const alertsList = document.getElementById('alerts-list');
    const countEl = document.getElementById('today-count');
    
    // 1. Rota de Hoje
    const todayApps = data.agendamentos.filter(a => a.dayOffset === 0 && a.status === 'pendente');
    countEl.innerText = todayApps.length;
    list.innerHTML = todayApps.length === 0 ? '<li style="padding:1rem;color:var(--text-muted)">Fila limpa! 🎉</li>' : todayApps.map(a => `
        <li class="route-item" style="flex-direction:column;align-items:flex-start;gap:0.75rem;padding:1.25rem 0;border-bottom:1px solid var(--border);">
            <div style="display:flex;justify-content:space-between;width:100%;">
                <span class="time">${a.hora}</span>
                <div style="flex:1;margin-left:1rem;"><strong>${a.pet_nome}</strong><br><span style="font-size:0.8rem">${a.servico} | ${a.bairro}</span></div>
            </div>
            <div style="display:flex;gap:0.5rem;width:100%;">
                <button class="btn-small" style="flex:1" onclick="onMyWay('${a.pet_nome}', '${a.tutor}', '${a.endereco}')">🚀 A caminho</button>
                <button class="btn-small" style="flex:1;background:var(--success);color:white;" onclick="completeAppointment(${a.id})">✅ Concluir</button>
            </div>
        </li>
    `).join('');

    // 2. LÓGICA DE ALERTAS (CRM)
    // Encontra pets sem agendamento futuro com retorno < 7 dias
    const petsScheduledIds = data.agendamentos.map(a => a.pet_id);
    const alertPets = data.pets.filter(p => !petsScheduledIds.includes(p.id) && p.returnDays < 7);

    alertsList.innerHTML = alertPets.length === 0 ? '<p style="padding:1rem;font-size:0.8rem">Nenhum pet pendente de retorno.</p>' : alertPets.map(p => `
        <div class="alert-item">
            <div>
                <strong style="display:block">${p.nome} 🐶</strong>
                <span style="font-size:0.75rem; color: #991b1b;">Sugerido há ${p.returnDays} dias</span>
            </div>
            <button class="btn-action" onclick="sendRecall('${p.nome}', '${p.tutor}')">Zap</button>
        </div>
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
        return `<div style="margin-top:1.5rem;"><h3 style="font-size:0.9rem;color:var(--text-muted);text-transform:capitalize;">${dayLabel}</h3>${dayApps.map(a => `<div class="card" style="padding:0.75rem;border-left:4px solid ${a.status==='concluido'?'var(--success)':'var(--primary)'}"><div style="display:flex;justify-content:space-between;align-items:center;"><div><span class="time">${a.hora}</span><strong>${a.pet_nome}</strong><p style="font-size:0.8rem;color:var(--text-muted);">${a.servico} | ${a.bairro}</p></div><span>${a.status==='concluido'?'✅':'⏳'}</span></div></div>`).join('')}</div>`;
    }).join('');
}

function renderPets(filter = '') {
    const data = getPetFlowData();
    const list = document.getElementById('pet-list');
    list.innerHTML = '';
    const filtered = data.pets.filter(p => p.nome.toLowerCase().includes(filter.toLowerCase()) || p.tutor.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(pet => {
        let cdClass = pet.returnDays < 3 ? 'cd-urgent' : (pet.returnDays < 7 ? 'cd-soon' : 'cd-ok');
        const item = document.createElement('div');
        item.className = 'card pet-card';
        item.onclick = () => openPetProfile(pet.id);
        item.innerHTML = `<div style="display:flex;justify-content:space-between;"><div><h3>${pet.nome} 🐶</h3><p style="font-size:0.8rem;color:var(--text-muted);">${pet.endereco}</p></div><span class="countdown-badge ${cdClass}">${pet.returnDays}d</span></div>`;
        list.appendChild(item);
    });
}

function openPetProfile(petId) {
    const pet = getPetFlowData().pets.find(p => p.id === petId);
    document.getElementById('pet-profile-content').innerHTML = `<div style="text-align:center;margin-bottom:1.5rem;"><div style="font-size:3rem;">🐶</div><h1>${pet.nome}</h1><span class="badge">${pet.pelo}</span></div><div class="card"><h2>Tutor</h2><p>${pet.tutor}</p><p>${pet.endereco}</p></div><div class="card"><h2>CRM</h2><p>Retorno sugerido em ${pet.returnDays} dias.</p></div>`;
    openModal('modal-profile');
}

function seedInitialData() {
    const pets = [
        { id: 1, nome: "Max", pelo: "longo", tutor: "Jeronimo", endereco: "Rua Silva Paulet, 120 - Aldeota", returnDays: 15 },
        { id: 2, nome: "Luna", pelo: "medio", tutor: "Elaine", endereco: "Av. Dom Luís, 500 - Meireles", returnDays: 12 },
        { id: 3, nome: "Bidu", pelo: "curto", tutor: "Damaris", endereco: "Rua Maria Tomásia, 300 - Aldeota", returnDays: 2 },
        { id: 4, nome: "Mel", pelo: "curto", tutor: "Daniela", endereco: "Rua Ana Bilhar, 1000 - Meireles", returnDays: 10 },
        { id: 5, nome: "Thor", pelo: "longo", tutor: "Henrique", endereco: "Av. Beira Mar, 2500 - Meireles", returnDays: 20 },
        { id: 6, nome: "Pipoca", pelo: "medio", tutor: "Fátima", endereco: "Rua Barbosa de Freitas, 40 - Aldeota", returnDays: 14 },
        { id: 7, nome: "Amora", pelo: "curto", tutor: "Cláudio", endereco: "Rua Leite Albuquerque, 15 - Aldeota", returnDays: 5 },
        { id: 8, nome: "Frederico", pelo: "longo", tutor: "Sônia", endereco: "Rua Norvinda Pires, 88 - Meireles", returnDays: 1 },
        { id: 9, nome: "Cookie", pelo: "medio", tutor: "Roberto", endereco: "Av. Santos Dumont, 2000 - Aldeota", returnDays: 25 },
        { id: 10, nome: "Bolinha", pelo: "curto", tutor: "Márcia", endereco: "Rua Canuto de Aguiar, 450 - Meireles", returnDays: 3 },
        { id: 11, nome: "Rex", pelo: "curto", tutor: "Antônio", endereco: "Rua Vicente Leite, 320 - Aldeota", returnDays: 30 },
        { id: 12, nome: "Belinha", pelo: "medio", tutor: "Patrícia", endereco: "Rua Pe. Valdevino, 900 - Aldeota", returnDays: 18 },
        { id: 13, nome: "Floquinho", pelo: "longo", tutor: "Carlos", endereco: "Av. Abolição, 3000 - Meireles", returnDays: 8 },
        { id: 14, nome: "Pandora", pelo: "medio", tutor: "Bruna", endereco: "Rua Joaquim Nabuco, 150 - Aldeota", returnDays: 4 },
        { id: 15, nome: "Zeca", pelo: "curto", tutor: "Sérgio", endereco: "Rua Tibúrcio Cavalcante, 600 - Meireles", returnDays: 22 }
    ];

    const agendamentos = [
        { id: 101, pet_id: 1, pet_nome: "Max", tutor: "Jeronimo", endereco: "Rua Silva Paulet, 120", bairro: "Aldeota", dayOffset: 0, hora: "08:00", servico: "Banho + Hidratação", status: "pendente" },
        { id: 102, pet_id: 2, pet_nome: "Luna", tutor: "Elaine", endereco: "Av. Dom Luís, 500", bairro: "Meireles", dayOffset: 0, hora: "10:00", servico: "Tosa Higiênica", status: "pendente" },
        { id: 103, pet_id: 6, pet_nome: "Pipoca", tutor: "Fátima", endereco: "Rua Barbosa de Freitas, 40", bairro: "Aldeota", dayOffset: 0, hora: "14:00", servico: "Banho", status: "pendente" },
        { id: 104, pet_id: 4, pet_nome: "Mel", tutor: "Daniela", endereco: "Rua Ana Bilhar, 1000", bairro: "Meireles", dayOffset: 1, hora: "09:00", servico: "Banho", status: "pendente" },
        { id: 105, pet_id: 5, pet_nome: "Thor", tutor: "Henrique", endereco: "Av. Beira Mar, 2500", bairro: "Meireles", dayOffset: 1, hora: "11:00", servico: "Tosa Completa", status: "pendente" }
    ];

    const data = { pets, agendamentos };
    savePetFlowData(data);
    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    getPetFlowData();
    renderDashboard();
    const mapBtn = document.querySelector('.routes-card button');
    if(mapBtn) mapBtn.onclick = showMap;
});

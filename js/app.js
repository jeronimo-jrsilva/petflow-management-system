// --- ESTADO GLOBAL ---
function getPetFlowData() {
    let data = JSON.parse(localStorage.getItem('petflow_data'));
    const isMissingFields = data && data.pets && data.pets.length > 0 && !('returnDays' in data.pets[0]);
    if (!data || isMissingFields || data.agendamentos.length < 9) {
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
    document.getElementById(pageId).classList.add('active');
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

function sendRecall(petName, tutor, days) {
    const msg = encodeURIComponent(`Oi ${tutor}! 🐾 Notei que o próximo banho do ${petName} é daqui a ${days} dias. Vamos agendar um horário para o Pet Móvel passar aí? 🛁`);
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
    localStorage.clear();
    location.reload();
}

// --- RENDERIZAÇÃO ---
function renderDashboard() {
    const data = getPetFlowData();
    const list = document.getElementById('dashboard-route-list');
    const alertsList = document.getElementById('alerts-list');
    const countEl = document.getElementById('today-count');
    if (!list || !alertsList || !countEl) return;

    const todayApps = data.agendamentos.filter(a => a.dayOffset === 0 && a.status === 'pendente');
    countEl.innerText = todayApps.length;
    list.innerHTML = todayApps.length === 0 ? '<li style="padding:1.5rem;color:var(--text-muted);text-align:center;">Fila limpa! 🎉</li>' : todayApps.map(a => `
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

    const scheduledPetIds = data.agendamentos.map(a => a.pet_id);
    const alertPets = data.pets.filter(p => !scheduledPetIds.includes(p.id) && p.returnDays < 7);
    alertsList.innerHTML = alertPets.length === 0 ? '<p style="padding:1rem;font-size:0.8rem;color:var(--text-muted)">Nenhum retorno pendente.</p>' : alertPets.map(p => `
        <div class="alert-item">
            <div><strong>${p.nome} 🐶</strong><br><span style="font-size:0.75rem; color: #991b1b;">Retorno daqui a ${p.returnDays} dias</span></div>
            <button class="btn-action" onclick="sendRecall('${p.nome}', '${p.tutor}', ${p.returnDays})">Zap</button>
        </div>
    `).join('');
}

function renderAgenda() {
    const data = getPetFlowData();
    const list = document.getElementById('agenda-timeline');
    if (!list) return;
    const offsets = [0, 1, 2];
    list.innerHTML = offsets.map(offset => {
        const date = getBusinessDate(offset);
        const dayApps = data.agendamentos.filter(a => a.dayOffset === offset);
        const dayLabel = offset === 0 ? "Hoje" : date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' });
        return `<div style="margin-top:1.5rem;"><h3 style="font-size:0.9rem;color:var(--text-muted);text-transform:capitalize;">${dayLabel}</h3>${dayApps.map(a => `<div class="card" style="padding: 0.75rem; border-left: 4px solid ${a.status==='concluido'?'var(--success)':'var(--primary)'}"><div style="display:flex;justify-content:space-between;align-items:center;"><div><span class="time">${a.hora}</span><strong>${a.pet_nome}</strong><p style="font-size:0.8rem;color:var(--text-muted);">${a.servico} | ${a.bairro}</p></div><span>${a.status==='concluido'?'✅':'⏳'}</span></div></div>`).join('')}</div>`;
    }).join('');
}

function renderPets(filter = '') {
    const data = getPetFlowData();
    const list = document.getElementById('pet-list');
    if (!list) return;
    list.innerHTML = '';
    const filtered = data.pets.filter(p => p.nome.toLowerCase().includes(filter.toLowerCase()) || p.tutor.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(pet => {
        const days = pet.returnDays || 0;
        let cdClass = days < 3 ? 'cd-urgent' : (days < 7 ? 'cd-soon' : 'cd-ok');
        const item = document.createElement('div');
        item.className = 'card pet-card';
        item.onclick = () => openPetProfile(pet.id);
        item.innerHTML = `<div style="display:flex;justify-content:space-between;"><div><h3>${pet.nome} 🐶</h3><p style="font-size:0.8rem;color:var(--text-muted);">${pet.endereco}</p></div><span class="countdown-badge ${cdClass}">${days}d</span></div>`;
        list.appendChild(item);
    });
}

function searchPets() { renderPets(document.getElementById('pet-search').value); }

function openPetProfile(petId) {
    const pet = getPetFlowData().pets.find(p => p.id === petId);
    document.getElementById('pet-profile-content').innerHTML = `<div style="text-align:center;margin-bottom:1.5rem;"><div style="font-size:3rem;">🐶</div><h1>${pet.nome}</h1><span class="badge">${pet.pelo}</span></div><div class="card"><h2>Tutor</h2><p>${pet.tutor}</p><p>${pet.endereco}</p></div><div class="card"><h2>Controle</h2><p>Sugerimos novo contato daqui a ${pet.returnDays} dias.</p></div>`;
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

    const agendamentos = [];
    const hours = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"];
    let appId = 1;

    [0, 1, 2].forEach(offset => {
        const dayPets = [...pets].sort(() => 0.5 - Math.random()).slice(0, 3);
        dayPets.forEach((pet, i) => {
            agendamentos.push({
                id: appId++,
                pet_id: pet.id,
                pet_nome: pet.nome,
                tutor: pet.tutor,
                endereco: pet.endereco,
                bairro: pet.endereco.split(' - ')[1],
                dayOffset: offset,
                hora: hours[i],
                servico: ["Banho", "Tosa Higiênica", "Banho + Hidratação"][Math.floor(Math.random()*3)],
                status: "pendente"
            });
        });
    });

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

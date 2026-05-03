function showPage(pageId) {
    // Esconde todas as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Mostra a página selecionada
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Atualiza o menu inferior
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(pageId)) {
            item.classList.add('active');
        }
    });

    if (pageId === 'agenda') renderAgenda();
    if (pageId === 'pets') renderPets();
}

// Modais
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Renderização
function renderPets() {
    const data = JSON.parse(localStorage.getItem('petflow_data'));
    const list = document.getElementById('pet-list');
    list.innerHTML = '';

    data.pets.forEach(pet => {
        const item = document.createElement('div');
        item.className = 'card';
        item.innerHTML = `
            <h3>${pet.nome} 🐶</h3>
            <p>Pelo: ${pet.pelo} | Tutor: ${pet.tutor}</p>
        `;
        list.appendChild(item);
    });
}

function renderAgenda() {
    const list = document.getElementById('agenda-timeline');
    list.innerHTML = `
        <div class="card">
            <span class="time">09:00</span>
            <strong>Max</strong> - Banho
        </div>
        <div class="card">
            <span class="time">10:30</span>
            <strong>Luna</strong> - Tosa
        </div>
    `;
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
    localStorage.setItem('petflow_data', JSON.stringify(data));
    
    alert('Pet cadastrado com sucesso! 🐾');
    closeModal('modal-pet');
    renderPets();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('PetFlow Web App Iniciado 🚀');
    
    if (!localStorage.getItem('petflow_data')) {
        const initialData = {
            tutores: [],
            pets: [
                { id: 1, nome: "Max", pelo: "longo", tutor: "Jeronimo" },
                { id: 2, nome: "Luna", pelo: "medio", tutor: "Elaine" }
            ],
            agendamentos: []
        };
        localStorage.setItem('petflow_data', JSON.stringify(initialData));
    }
});

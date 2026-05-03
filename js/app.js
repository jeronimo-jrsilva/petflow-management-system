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

    console.log(`Navegando para: ${pageId}`);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('PetFlow Web App Iniciado 🚀');
    
    // Simulação de carregamento de dados do LocalStorage
    if (!localStorage.getItem('petflow_data')) {
        const initialData = {
            tutores: [],
            pets: [],
            agendamentos: []
        };
        localStorage.setItem('petflow_data', JSON.stringify(initialData));
    }
});

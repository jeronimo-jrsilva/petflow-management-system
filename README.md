# 🐾 PetFlow: Sistema de Gestão para Clínicas & Pet Shops

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Banco%20de%20Dados-SQLite3-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS-E34F26?style=flat-square&logo=html5&logoColor=white" alt="Web Frontend"/>
  <img src="https://img.shields.io/badge/LGPD-Compliant-2ea44f?style=flat-square" alt="LGPD Compliant"/>
  <a href="https://github.com/jeronimo-jrsilva"><img src="https://img.shields.io/badge/Autor-Jeronimo%20Silva-181717?style=flat-square&logo=github&logoColor=white" alt="Autor"/></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="Licença MIT"/>
</p>

---

### 📌 1. Visão Geral & Problema de Negócio

O **PetFlow** é uma solução completa desenvolvida para solucionar gargalos logísticos e operacionais em clínicas veterinárias e pet shops com serviço móvel de atendimento a domicílio (*Pet Móvel*).

A aplicação gerencia o ciclo completo de atendimento: cadastro de tutores com consentimento expresso da **LGPD**, categorização zootécnica de animais por tipo de pelagem, precificação dinâmica e otimização de rotas de atendimento por bairro.

---

### 🏗️ 2. Arquitetura & Decisões Técnicas

O projeto foi construído seguindo rigorosa modelagem relacional (DER) e separação de camadas:

```mermaid
erDiagram
    TUTORES ||--o{ PETS : possui
    TUTORES ||--o{ AGENDAMENTOS : contrata
    PETS ||--o{ AGENDAMENTOS : recebe
    TABELA_PRECOS ||--o{ AGENDAMENTOS : precifica

    TUTORES {
        int id PK
        string nome
        string cpf UK
        string telefone
        string bairro "Otimizacao Logistica"
        int consentimento_lgpd
    }
    PETS {
        int id PK
        int tutor_id FK
        string nome
        string especie
        string tipo_pelo "Curto / Medio / Longo"
        float peso
    }
    TABELA_PRECOS {
        int id PK
        string servico
        string categoria_pelo
        float valor
    }
    AGENDAMENTOS {
        int id PK
        int tutor_id FK
        int pet_id FK
        datetime data_hora
        string status
        float valor_total
    }
```

#### Destaques de Engenharia:
- **Conformidade com a LGPD:** Registro explícito de termos de consentimento no momento do cadastro do tutor, garantindo rastreabilidade jurídica no tratamento de dados pessoais.
- **Logística Geográfica:** Estrutura orientada a bairros para agrupar atendimentos do veículo móvel por zona geográfica, reduzindo custos de deslocamento.
- **Precificação por Características Zootécnicas:** Integração automática entre tamanho/tipo de pelo e tabela de valores de procedimentos (banho, tosa, hidratação).

---

### 🛠️ 3. Tecnologias & Dependências

| Módulo | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Backend & Engine** | Python 3.10+ | Scripting de banco, migrations e regras de validação |
| **Persistência** | SQLite3 Relacional | Banco estruturado com chaves estrangeiras e integridade referencial (`ON DELETE CASCADE`) |
| **Interface de Usuário** | HTML5 Semântico, CSS3 & JavaScript Puro | Painel responsivo de agendamento e visualização de atendimentos |
| **Governança** | Git Flow & Semantic Commits | Controle de versão com rastreamento no `CHANGELOG.md` |

---

### 🚀 4. Como Executar Localmente

#### Pré-requisitos:
- Python 3.8 ou superior instalado.
- Navegador web moderno.

#### Passo a passo:
```bash
# 1. Clone o repositório
git clone https://github.com/jeronimo-jrsilva/petflow-management-system.git

# 2. Acesse o diretório
cd petflow-management-system

# 3. Inicialize e popule o banco de dados SQLite
python3 src/database_setup.py

# 4. Abra o painel no navegador
# No Linux:
xdg-open index.html
# Ou simplesmente abra o arquivo index.html no navegador de sua preferência
```

---

### 📂 5. Estrutura de Diretórios

```text
petflow-management-system/
├── css/
│   └── style.css            # Estilização responsiva e tema visual
├── data/
│   └── petflow.db           # Banco de dados SQLite persistido
├── docs/
│   ├── Projeto_PetFlow_AV1.md  # Documentação de requisitos de negócio
│   └── Projeto_PetFlow_AV1.pdf # Relatório técnico formal
├── js/
│   └── app.js               # Lógica de interface e manipulação do DOM
├── src/
│   └── database_setup.py    # DDL e DML de inicialização do schema relacional
├── CHANGELOG.md             # Histórico de versões
├── index.html               # Ponto de entrada da interface web
└── README.md
```

---

### 👤 Autor & Contato

<p align="left">
  <strong>Jeronimo Silva</strong><br>
  <em>Estagiário em Desenvolvimento de Software | Graduando ADS (SENAC Ceará)</em><br>
  Fortaleza - CE | Disponível para Presencial, Híbrido e Remoto
</p>

<p align="left">
  <a href="mailto:jeronimo.aulas@gmail.com"><img src="https://img.shields.io/badge/Email-jeronimo.aulas%40gmail.com-ea4335?style=flat-square&logo=gmail&logoColor=white" alt="Email"/></a>
  <a href="https://linkedin.com/in/jeronimojr-dev" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-Jeronimo%20Silva-0a66c2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>
  <a href="https://github.com/jeronimo-jrsilva"><img src="https://img.shields.io/badge/GitHub-jeronimo--jrsilva-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub"/></a>
</p>

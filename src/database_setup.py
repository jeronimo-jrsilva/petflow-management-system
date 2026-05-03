import sqlite3
import os

# Caminho para o banco de dados
DB_PATH = os.path.join('data', 'petflow.db')

def setup_database():
    """Cria as tabelas iniciais do sistema PetFlow."""
    
    # Garante que o diretório data existe
    os.makedirs('data', exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print(f"--- Inicializando Banco de Dados: {DB_PATH} ---")

    # 1. Tabela de Tutores (Pessoas Físicas - Foco LGPD e Rotas)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tutores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE,
            telefone TEXT NOT NULL,
            email TEXT,
            endereco TEXT,
            bairro TEXT, -- Essencial para logística de rotas do Pet Móvel
            consentimento_lgpd INTEGER DEFAULT 0,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. Tabela de Pets (Categorização por Pelagem)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tutor_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            especie TEXT NOT NULL,
            raca TEXT,
            tipo_pelo TEXT, -- curto, medio, longo
            data_nascimento DATE,
            peso REAL,
            observacoes TEXT,
            FOREIGN KEY (tutor_id) REFERENCES tutores (id) ON DELETE CASCADE
        )
    ''')

    # 3. Tabela de Serviços e Preços (Tabela de Valores)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tabela_precos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            servico TEXT NOT NULL, -- Banho, Tosa, Hidratação, etc.
            categoria_pelo TEXT, -- curto, medio, longo, universal
            valor REAL NOT NULL
        )
    ''')
    print("[OK] Tabela 'tabela_precos' criada.")

    # 4. Tabela de Agendamentos (Pagamento e Recorrência)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pet_id INTEGER NOT NULL,
            data_hora TIMESTAMP NOT NULL,
            servico_id INTEGER NOT NULL,
            valor_total REAL,
            status TEXT DEFAULT 'pendente', -- pendente, confirmado, concluido, cancelado
            pagamento_status TEXT DEFAULT 'aguardando', -- aguardando, pago, comprovante_enviado
            lembrete_enviado INTEGER DEFAULT 0,
            intervalo_recorrencia INTEGER, -- em dias (7, 15, 30, 45, 60)
            FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE,
            FOREIGN KEY (servico_id) REFERENCES tabela_precos (id)
        )
    ''')
    print("[OK] Tabela 'agendamentos' criados.")

    conn.commit()
    conn.close()
    print("\n--- Setup do Banco de Dados Concluído com Sucesso! ---")

if __name__ == "__main__":
    setup_database()

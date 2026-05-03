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

    # 1. Tabela de Tutores (Pessoas Físicas - Foco LGPD)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tutores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE,
            telefone TEXT NOT NULL,
            email TEXT,
            endereco TEXT,
            consentimento_lgpd INTEGER DEFAULT 0, -- 0: Não, 1: Sim
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    print("[OK] Tabela 'tutores' criada.")

    # 2. Tabela de Pets (Dependentes Animais)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tutor_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            especie TEXT NOT NULL,
            raca TEXT,
            data_nascimento DATE,
            peso REAL,
            observacoes TEXT,
            FOREIGN KEY (tutor_id) REFERENCES tutores (id) ON DELETE CASCADE
        )
    ''')
    print("[OK] Tabela 'pets' criada.")

    # 3. Tabela de Agendamentos (Foco em No-Show e Recorrência)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pet_id INTEGER NOT NULL,
            data_hora TIMESTAMP NOT NULL,
            servico TEXT NOT NULL, -- Banho, Tosa, Consulta, Vacina
            status TEXT DEFAULT 'pendente', -- pendente, confirmado, cancelado, concluido
            lembrete_enviado INTEGER DEFAULT 0, -- 0: Não, 1: Sim
            observacoes TEXT,
            FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE
        )
    ''')
    print("[OK] Tabela 'agendamentos' criados.")

    conn.commit()
    conn.close()
    print("\n--- Setup do Banco de Dados Concluído com Sucesso! ---")

if __name__ == "__main__":
    setup_database()

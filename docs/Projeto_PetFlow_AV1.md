---
titulo: "🚀 Projeto PetFlow - Documento de Extensão AV1 (Consolidado)"
tipo: projeto
disciplina: "Projeto Integrador"
semestre: "2026.1"
status: pronto_para_entrega_AV1
equipe: ["Dâmaris Maza", "Daniela Uchôa", "Elâine", "Jeronimo Silva"]
---

# Projeto PetFlow: Gestão Inteligente para Pet Shops

## 1. TIPO
(x) PROJETO (Projeto de Extensão)

## 2. TEMA
Gestão de processos e automação para o mercado pet, com foco em reduzir perdas financeiras e garantir a segurança de dados (LGPD).

## 3. TÍTULO
**PetFlow: Sistema de Gestão Inteligente para Otimização de Fluxos em Pet Shops**

## 4. IDENTIFICAÇÃO
- **Diretor Institucional:** Luiz Antonio Rabelo
- **Coordenador de curso:** Prof. Frederico (Fred)
- **Professor da disciplina:** Prof. Alexandre
- **Integrantes:** 
    - Dâmaris Maza
    - Daniela Uchôa
    - Elâine
    - Jeronimo Silva
- **Turma:** PI_01_202601

## 5. RESUMO
O PetFlow é um ecossistema de gestão inteligente voltado para a profissionalização de pet shops de pequeno e médio porte em Fortaleza. Além de automatizar o fluxo de agendamentos para mitigar o impacto financeiro do absenteísmo (*no-show*), o sistema integra a gestão centralizada do histórico de saúde animal e o controle rigoroso da periodicidade vacinal. Através de uma arquitetura segura e em conformidade com a LGPD, o PetFlow transforma o registro clínico em uma ferramenta estratégica de fidelização, garantindo o cuidado preventivo e a sustentabilidade do negócio.

## 6. INTRODUÇÃO (JUSTIFICATIVA)
Muitos pet shops em Fortaleza ainda operam sob processos fragmentados, utilizando meios analógicos ou sistemas limitados que não conectam a agenda ao histórico clínico do animal. Tal cenário acarreta um problema crítico: um elevado índice de absenteísmo (*no-show*), gerando ociosidade técnica e perda direta de receita financeira. 

Este projeto propõe solucionar esse gargalo através de um mecanismo de notificações automáticas proativas, diretamente atrelado ao calendário de serviços e saúde. O diferencial crítico e maior valor agregado do PetFlow reside na consolidação do histórico clínico como o principal ativo para o tutor. Ao garantir que o estabelecimento tenha o controle da periodicidade de vacinas e tratamentos, o sistema promove a fidelização e assegura que a sustentabilidade financeira esteja alicerçada na confiança e na continuidade do cuidado, operando sob os protocolos de segurança da LGPD.

## 7. OBJETIVOS
O objetivo primordial deste projeto consiste em desenvolver uma solução tecnológica capaz de otimizar a rentabilidade de estabelecimentos pet através da gestão inteligente de fluxos clínicos e operacionais, erradicando a ociosidade e elevando o padrão de atendimento preventivo.

**Objetivos Específicos:**
- Implementar um módulo de fidelização baseado no rastreio clínico exaustivo e controle automatizado de periodicidade vacinal.
- Consolidar a sustentabilidade financeira do negócio através de um sistema de notificações automáticas voltado à mitigação drástica do *no-show*.
- Otimizar a ocupação técnica do estabelecimento mediante uma agenda dinâmica integrada à gestão de prioridades e recorrência assistida de serviços.

## 8. METODOLOGIA
A execução do projeto fundamenta-se nas seguintes etapas operacionais:

1. **Levantamento de Requisitos:** Identificação dos principais gargalos operacionais em pet shops locais através de pesquisa e entrevistas.
2. **Modelagem de Dados:** Estruturação de um banco de dados utilizando SQLite (*Structured Query Language Lite*) para garantir a integridade do vínculo entre tutor e animal, permitindo a persistência do histórico clínico.
3. **Desenvolvimento do Protótipo:** Implementação da lógica de negócios utilizando a linguagem Python 3, priorizando a eficiência do algoritmo de agendamento e a interface via terminal (CLI).
4. **Conformidade Normativa:** Aplicação de protocolos de segurança baseados na LGPD, assegurando a privacidade e o tratamento ético das informações dos clientes.

## 9. PÚBLICO ALVO
- **Gestores do Setor Pet:** Microempreendedores que necessitam de uma gestão capaz de transformar o histórico clínico em recorrência e mitigar o impacto financeiro do absenteísmo.
- **Tutores de Animais:** Consumidores que valorizam a conveniência de lembretes preventivos (vacinas/saúde) e a agilidade no acesso a serviços organizados.

## 10. REVISÃO DA LITERATURA

**10.1. O Problema das Faltas (No-Show)**
O absenteísmo sem aviso prévio é um dos maiores desafios financeiros do setor. Segundo o estudo Radar Pet 2023 (SINDAN), a demanda por conveniência é um fator decisivo para os tutores modernos. A ausência de mecanismos de confirmação resulta em ociosidade técnica, o que é crítico dado que os custos fixos de manutenção representam cerca de 47% do orçamento (SEBRAE, 2024).

**10.2. Segurança de Dados (LGPD)**
Embora o paciente seja o animal, os dados sensíveis pertencem ao tutor. O PetFlow integra a Lei nº 13.709/2018 (LGPD) no núcleo do seu design. A conformidade legal deixa de ser um fardo burocrático e torna-se um diferencial competitivo de confiança (PANORAMA PETVET, 2025).

**10.3. Benchmarking de Soluções**
Sistemas robustos como o SimplesVet atendem grandes clínicas, mas possuem custos proibitivos para microempreendedores. O PetFlow posiciona-se como uma alternativa leve, focada na dor central do agendamento e na inteligência clínica, sem a complexidade de módulos excedentes.

## 11. CRONOGRAMA INTEGRAL DE ATIVIDADES

- **Fase 1: Planejamento (Março)**
    - Definição do escopo do projeto e rascunho dos objetivos estratégicos (01/03/2026 a 31/03/2026).
- **Fase 2: Pesquisa e Documentação (Abril)**
    - Detalhamento da metodologia, pesquisa de mercado e consolidação do documento AV1 (01/04/2026 a 17/04/2026).
- **Fase 3: Desenvolvimento do Protótipo (Maio)**
    - Validação de Requisitos — Entrevistas com microempreendedores para identificar gargalos específicos (18/04/2026 a 24/04/2026).
    - Modelagem de Dados — Estruturação do banco SQLite (Tutor-Pet) (25/04/2026 a 01/05/2026).
    - Arquitetura do Sistema — Lógica em Python 3 e prevenção de duplicidade (02/05/2026 a 08/05/2026).
    - Funcionalidades de Automação — Implementação de notificações e gestão de horários (09/05/2026 a 15/05/2026).
    - Segurança e LGPD — Aplicação prática das regras da Lei nº 13.709/2018 (16/05/2026 a 22/05/2026).
    - Testes e Refinamento — Execução de testes de fluxo e usabilidade (23/05/2026 a 29/05/2026).
- **Fase 4: Finalização e Entrega (Junho)**
    - Preparação da Apresentação — Consolidação de resultados e documentação técnica (30/05/2026 a 05/06/2026).
    - Apresentação Final — Defesa da AV2 e demonstração do protótipo funcional (06/06/2026 a 12/06/2026).

*Nota: A fase de escrita e documentação técnica do trabalho será realizada em concomitância com as fases de desenvolvimento e testes (Fases 3 e 4), garantindo a atualização contínua do dossiê do projeto.*

## 12. MATERIAL
- Estações de trabalho com VS Code e Python 3.
- Biblioteca SQLite3.
- Frameworks de testes (PyTest) para validação de fluxos.

## 13. REFERÊNCIAS

BRASIL. **Lei nº 13.709, de 14 de agosto de 2018**. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF, [2018]. Disponível em: http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm.

COMAC. **Radar Pet 2023: O Novo Perfil do Tutor Brasileiro**. São Paulo: Sindan, 2023. Disponível em: https://sindan.org.br/wp-content/uploads/2023/12/PET-Talks_Apresentacao-Radar-Pet-2023.pdf.

PANORAMA PETVET. **LGPD no mercado veterinário (Daniela Jambor)**. Curitiba, 2025. Disponível em: https://panoramapetvet.com.br/obrigacoes-e-boas-praticas-da-lgpd-no-mercado-veterinario/.

PEGN. **Como montar um Pet Shop: Guia de Ideias de Negócios**. Rio de Janeiro, 2024. Disponível em: https://revistapegn.globo.com/Como-montar/noticia/2015/02/como-montar-um-pet-shop.html.

SILVA, Danilson. **Gestão Financeira em Pet Shops**. Fortaleza: IIS, 2026. Disponível em: https://iiscientific.com/index.php/iis/article/view/54.

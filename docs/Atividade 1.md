# Atividade 1 — Definição do Projeto e Viabilidade

## Identificação da Equipe

- **Nome do Projeto:** GESTOR DE FERRAMENTAS CNC
- **Integrantes:** Matheus Moraes e Victor Baratta
- **Repositório GitHub:**  
  https://github.com/Victor-Bar/GESTOR-DE-FERRAMENTAS-CNC
- **Disciplina:** Desenvolvimento Web Avançado
- **Data:** 04/04/2026

---

## Descrição do Problema

Descreva claramente o problema que será resolvido pelo sistema.

O sistema busca resolver a falta de controle sobre o estado e a disponibilidade de ferramentas em centros de usinagem CNC. Essa falta de controle pode causar:

- atrasos na produção;
- interrupções em projetos;
- necessidade de fabricação emergencial de ferramentas, processo que pode levar bastante tempo.

A ausência de uma ferramenta específica pode causar atraso na entrega de um ferramental e comprometer o andamento da produção.

---

## Público-Alvo

Quem utilizará o sistema?

- Operadores CNC;
- Programadores CNC;
- Engenheiros desenvolvedores de projetos.

---

## Justificativa

Por que este sistema é importante? Qual o valor gerado?

Quando não existe um bom controle das ferramentas, o trabalho acaba ficando desorganizado. Muitas vezes, o engenheiro desenvolve um projeto que precisa de uma ferramenta que a empresa não possui disponível naquele momento.

O problema aparece na hora de colocar o projeto em prática — por exemplo, durante a fabricação de uma caixa de moldagem no CNC —, pois a ferramenta necessária pode não estar disponível. Nesses casos, é preciso interromper a usinagem e solicitar a compra de uma fresa adequada.

Além disso, é importante ter um sistema para controlar o desgaste das ferramentas. Com o tempo, elas sofrem desgaste natural e podem até quebrar. Quando isso acontece, torna-se necessário comprar uma nova ferramenta, cujo custo pode variar entre R$ 200 e R$ 1.300, dependendo do tipo de fresa.

Com um bom controle de uso, é possível acompanhar o desgaste da ferramenta e enviá-la para afiação antes que ela quebre. Isso é muito mais econômico, já que o custo da afiação gira em torno de R$ 20 por ferramenta.

---

## Escopo Inicial

Liste as principais funcionalidades previstas.

- Consulta de ferramentas disponíveis em estoque;
- Registro de uso das ferramentas;
- Controle de desgaste com base na utilização.

---

## Análise de Viabilidade

### Viabilidade Técnica

#### Backend
- Node.js

#### Framework
- Express.js (para criação da API)

#### Banco de Dados
- PostgreSQL

#### Frontend (interface)
- React ou uma interface mais simples utilizando HTML/CSS.

---

### Viabilidade Econômica

Existem custos relevantes? O projeto é viável nesse aspecto?

Sim, existem alguns custos envolvidos, como implementação, treinamento dos funcionários e possível integração com outros setores.

Porém, o projeto é viável, pois reduz prejuízos com atrasos, evita compras emergenciais e melhora a produtividade, gerando economia a médio e longo prazo.

---

### Viabilidade Operacional

O sistema será utilizável pelos usuários?

Sim, o sistema poderá ser utilizado facilmente pelos usuários, pois será desenvolvido com uma interface simples e intuitiva. Com um treinamento básico, operadores e engenheiros conseguirão utilizar o sistema para consultar, registrar e controlar as ferramentas no dia a dia.

---

## Riscos Iniciais

Liste possíveis riscos:

- Risco 1: Uso incorreto do sistema pelos funcionários;
- Risco 2: Falta de atualização ou registro das informações (uso, quebra e desgaste);
- Risco 3: Dados inconsistentes que comprometam a confiabilidade do sistema.

---

## Considerações Finais

Resumo da proposta.

O projeto propõe o desenvolvimento de um sistema de gestão de ferramentas para centros de usinagem CNC, com o objetivo de melhorar o controle sobre a disponibilidade, uso e desgaste das ferramentas.

A solução busca evitar atrasos na produção, interrupções em projetos e custos elevados com compras emergenciais.

Com a implementação do sistema, será possível organizar melhor o estoque, permitir consultas antecipadas pelos engenheiros, registrar o uso das ferramentas e acompanhar seu desgaste ao longo do tempo. Isso contribuirá diretamente para um planejamento mais eficiente, redução de custos operacionais e aumento da produtividade.

Apesar de existirem riscos relacionados ao uso incorreto e à falta de atualização dos dados, esses problemas podem ser minimizados com treinamento adequado e definição de processos claros.

Dessa forma, o projeto mostra-se técnica, econômica e operacionalmente viável, trazendo benefícios significativos para a empresa a curto, médio e longo prazo.
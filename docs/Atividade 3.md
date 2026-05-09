# Atividade 3 — Requisitos e Modelagem

## Requisitos Funcionais

Liste os requisitos:

- RF01: O sistema deve permitir o cadastro de ferramentas CNC.
- RF02: O sistema deve permitir a edição e exclusão de ferramentas cadastradas.
- RF03: O sistema deve registrar o uso das ferramentas.
- RF04: O sistema deve controlar a vida útil das ferramentas.
- RF05: O sistema deve registrar sinistros (quebra ou dano) das ferramentas.
- RF06: O sistema deve permitir o cadastro de tipos de ferramentas.
- RF07: O sistema deve permitir o cadastro de tipos de usuários.
- RF08: O sistema deve permitir consultar ferramentas disponíveis no estoque.
- RF09: O sistema deve permitir visualizar o histórico de uso das ferramentas.
- RF10: O sistema deve gerar alertas de desgaste ou baixa quantidade mínima.

---

## Requisitos Não Funcionais

- RNF01: O sistema deve possuir interface simples e intuitiva.
- RNF02: O sistema deve garantir armazenamento seguro das informações.
- RNF03: O sistema deve responder às consultas em tempo adequado.
- RNF04: O sistema deve ser acessível em navegadores modernos.
- RNF05: O sistema deve permitir manutenção e atualização futuras com facilidade.

---

## Casos de Uso

Descreva os principais casos:

- Caso 1: Cadastrar nova ferramenta no sistema.
- Caso 2: Registrar utilização de ferramenta.
- Caso 3: Atualizar vida útil da ferramenta.
- Caso 4: Consultar ferramentas disponíveis.
- Caso 5: Registrar quebra ou dano da ferramenta.
- Caso 6: Cadastrar tipo de ferramenta.
- Caso 7: Cadastrar tipo de usuário.
- Caso 8: Visualizar histórico de utilização.
- Caso 9: Consultar alertas de desgaste.

---

## Entidades do Sistema

| Entidade | Atributos |
|---|---|
| Ferramenta | id_ferramenta, nome, diametro_mm, altura_mm, material, vida_util, id_tipo |
| Tipo | id_tipo, descricao, qtdade_min, diametro_mm, altura_mm, material |
| Usuário | id_usuario, nome, login, senha, id_tipo_usuario |
| Tipo_Usuario | id_tipo_usuario, descricao |
| Vida_Util | id_vida_util, data, porcentagem_uso, id_usuario, id_ferramenta |
| Sinistro | id_sinistro, data, descricao, id_usuario, id_ferramenta |

---

## DER (Diagrama Entidade-Relacionamento)

![DER](assets/der.png)

---

## Regras de Negócio

- Regra 1: Toda ferramenta cadastrada deve possuir identificação única.
- Regra 2: Toda ferramenta deve estar vinculada a um tipo.
- Regra 3: O sistema deve atualizar automaticamente a vida útil conforme o uso registrado.
- Regra 4: Ferramentas com desgaste elevado devem gerar alerta automático.
- Regra 5: Não será permitido registrar uso de ferramentas indisponíveis.
- Regra 6: Toda quebra ou dano de ferramenta deve ser registrada como sinistro.
- Regra 7: Apenas usuários cadastrados poderão registrar movimentações no sistema.

---

## Considerações

A modelagem do sistema foi desenvolvida pensando em melhorar a organização e o controle das ferramentas utilizadas nos centros de usinagem CNC. Os requisitos definidos permitem que o sistema realize funções importantes, como cadastro de ferramentas, controle de desgaste, registro de uso e gerenciamento de sinistros, além de manter um histórico das movimentações realizadas.

Com essa estrutura, a empresa poderá ter um controle mais eficiente do estoque e da vida útil das ferramentas, ajudando a evitar atrasos na produção, reduzir custos com compras emergenciais e melhorar o planejamento dos processos de usinagem.

Além disso, a modelagem foi pensada de forma que o sistema possa receber futuras melhorias e expansões com mais facilidade, tornando a aplicação mais organizada, eficiente e preparada para novas funcionalidades.
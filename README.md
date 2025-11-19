# ProTracker – Dashboard Pessoal de Produtividade (DataWork)

Este projeto foi desenvolvido como parte da **Global Solution – 2º semestre de 2025** com o tema  
**“DataWork: Inteligência Analítica no Mundo Corporativo”**.

O **ProTracker** é um aplicativo simples de produtividade que permite ao usuário:

- Cadastrar tarefas
- Marcar o status como **Pendente**, **Em andamento** ou **Concluída**
- Visualizar um pequeno **dashboard de performance** com:
  - Total de tarefas
  - Quantas estão concluídas, em andamento e pendentes
  - Percentual de tarefas concluídas

Todos os dados são salvos localmente no dispositivo usando **AsyncStorage**, simulando um cenário de *DataWork pessoal* onde informações do próprio usuário são transformadas em indicadores de performance.

---

## 🛠 Tecnologias utilizadas

- React Native
- Expo
- Expo Router (layout em abas)
- @react-native-async-storage/async-storage
- TypeScript

---

## ⚙️ Como configurar o ambiente e rodar o projeto

### 1. Clonar o repositório


git clone https://github.com/SEU-USUARIO/protracker-datawork.git
cd protracker-datawork

### 2. Instalar dependências

npm install
# ou
yarn install

### 3. Rodar o app (modo desenvolvimento)

npx expo start


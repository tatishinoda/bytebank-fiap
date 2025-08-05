# ByteBank - Gerenciamento Financeiro

Este é o projeto Tech Challenge para a pós-graduação em **Front-end Engineering da FIAP**. O objetivo é desenvolver o frontend para uma aplicação de gerenciamento financeiro, aplicando conceitos modernos de desenvolvimento web e programação orientada a objetos.

## Proposta do Projeto

Nesta fase, o desafio consiste em desenvolver o frontend para uma aplicação de gerenciamento financeiro utilizando Next.js e um Design System. O objetivo é criar uma interface que permita aos usuários gerenciar suas transações financeiras de forma intuitiva e eficiente. Além disso, é fundamental aplicar os conceitos de Programação Orientada a Objetos (POO) na estruturação do código.

### Requisitos do Desafio

- **Home Page:**
  - Uma página inicial simples que dá boas-vindas aos usuários.
  - Exibir informações sobre o saldo da conta corrente e um extrato das últimas transações.
  - Incluir uma seção para iniciar uma nova transação, com opções para selecionar o tipo de transação e inserir o valor.
- **Listagem de Transações:**
  - Uma página que exibe a lista completa de transações realizadas, com opções para visualizar detalhes, editar e deletar cada transação.
- **Adicionar Nova Transação:**
  - Uma página ou modal para adicionar uma nova transação ao banco de dados.
  - O formulário deve incluir campos como tipo de transação (depósito, transferência, etc.), valor e data.
- **Editar Transação:**
  - Uma página ou modal para editar as informações de uma transação existente.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor (SSR) e geração de sites estáticos (SSG).
- **React**: Biblioteca para construção de interfaces de usuário.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **Tailwind CSS**: Framework CSS utility-first para estilização rápida e consistente.
- **json-server**: Utilizado para criar uma API REST mock para simular o backend.

## Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- **Node.js**: A versão exata está especificada no arquivo `.nvmrc`.
- **NVM** (Node Version Manager): Altamente recomendado para gerenciar a versão do Node.js do projeto.
- **Yarn** ou **npm**

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/karenkramek/bytebank-fiap.git
    cd bytebank-fiap
    ```

2.  **Use a versão correta do Node.js com NVM:**
    O arquivo `.nvmrc` na raiz do projeto especifica a versão do Node.js a ser utilizada. Execute o comando abaixo para ativar a versão correta:
    ```bash
    nvm use
    ```
    *Se você não tiver a versão especificada instalada, o NVM irá sugerir o comando para instalá-la (`nvm install`).*

3.  **Instale as dependências do projeto:**
    ```bash
    npm install
    # ou
    yarn install
    ```

4.  **Inicie a API Mock (json-server):**
    Para que a aplicação funcione, é necessário ter o servidor da API mock em execução. Em um terminal, execute:
    ```bash
    npm run server
    ```
    Isso iniciará um servidor na porta `3001`, observando o arquivo `db.json`.

5.  **Inicie o servidor de desenvolvimento:**
    Em **outro terminal**, inicie a aplicação Next.js:
    ```bash
    npm run dev
    ```

Abra http://localhost:3000 em seu navegador para ver o resultado.

## Integrantes do Grupo

| Nome                          | Email                              | RM     |
|-------------------------------|------------------------------------|--------|
| Karen Cristina Kramek         | [kakakramek@gmail.com](mailto:kakakramek@gmail.com)              | [361140](mailto:RM361140@fiap.com.br) |
| Tatiane Gabrielle Marçal Rodrigues da Costa | [tatiane.costa@alura.com.br](mailto:tatiane.costa@alura.com.br)       | [365215](mailto:RM365215@fiap.com.br) |
| Kaique Kenichi Furukawa Endo  | [kaiquefurukawa@gmail.com](mailto:kaiquefurukawa@gmail.com)          | [366448](mailto:RM366448@fiap.com.br) |
| Jean Villela dos Santos       | [villeladossantosjean@gmail.com](mailto:villeladossantosjean@gmail.com)    | [365189](mailto:RM365189@fiap.com.br) |

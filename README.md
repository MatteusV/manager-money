# Manager Money

## Descrição

O **Manager Money** é um aplicativo web desenvolvido para ajudar os usuários a gerenciar suas finanças pessoais. Com ele, você pode registrar suas transações, visualizar gráficos de desempenho financeiro e receber notificações semanais sobre seus gastos.

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter os seguintes itens instalados:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (ou outro banco de dados compatível com Prisma)
- [Prisma CLI](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres)

## Configuração do Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/MatteusV/manager-money.git
   cd manager-money
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

   ```env
   POSTGRES_PRISMA_URL="sua_url_do_banco_de_dados"
   NEXT_PUBLIC_JWT_SECRET="seu_segredo_jwt"
   NEXT_PUBLIC_VAPID_PUBLIC_KEY="sua_chave_publica_vapid"
   VAPID_PRIVATE_KEY="sua_chave_privada_vapidVAPID_PRIVATE_KEY"
   ```

4. **Execute as migrações do Prisma:**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

6. **Acesse o aplicativo:**

   Abra seu navegador e vá para `http://localhost:3000`.

## Funcionalidades

- Registro de transações (entradas e saídas)
- Visualização de gráficos de fluxo de caixa
- Notificações semanais sobre gastos
- Gerenciamento de categorias de despesas

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Para isso, crie um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License.


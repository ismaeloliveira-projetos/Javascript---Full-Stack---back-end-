📘 Encurtador de URL – Backend (NestJS + Prisma + PostgreSQL)

Este é o backend do sistema de encurtamento de URLs, desenvolvido em NestJS, usando Prisma ORM, PostgreSQL (Neon) e deploy em Render.

🚀 Funcionalidades

Encurtar URLs

Redirecionamento automático

Persistência via PostgreSQL

API Key para proteção de endpoints

Tratamento global de exceções

Middleware de autenticação

Testes end-to-end com Jest

<img width="671" height="639" alt="Captura de tela 2025-11-24 105050" src="https://github.com/user-attachments/assets/99fc0db6-9690-4b32-9236-2e0ef684a1f3" />

⚙️ Instalação
1️⃣ Instalar dependências
npm install

🔧 Variáveis de Ambiente (reais)

Crie um arquivo .env na raiz com:

DATABASE_URL="postgresql://neondb_owner:npg_3xUM9dNJOlco@ep-holy-glitter-acpofl9l-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

BASE_URL=https://shortener-backend-7qu0.onrender.com

API_KEY=f47ac10b-58cc-4372-a567-0e02b2c3d479

🗄️ Banco de Dados
Aplicar migrations:
npx prisma migrate deploy


ou em desenvolvimento:

npx prisma migrate dev

Acessar o prisma studio:
npx prisma studio


Banco utilizado: PostgreSQL (Neon)
Conexão já configurada via DATABASE_URL.

▶️ Rodar a aplicação
Desenvolvimento
npm run start:dev

Produção
npm run start


A API roda por padrão em:

http://localhost:1000

🧪 Testes (E2E)
npm run test:e2e

🔐 Autenticação (API Key)

Alguns endpoints utilizam API Key.

Enviar no header:

x-api-key: f47ac10b-58cc-4372-a567-0e02b2c3d479

🌐 URL de Produção

A API está online em:

https://shortener-backend-7qu0.onrender.com

📌 Rotas Principais
Criar URL encurtada

POST /shorten

Body:

{
  "originalUrl": "https://google.com"
}

Redirecionar (público)

GET /:code

🧱 Scripts úteis
Comando	Descrição
npm run start	Inicia a aplicação
npm run start:dev	Modo desenvolvimento
npm run build	Compila o projeto
npm run test:e2e	Testes end-to-end
npm run lint	Analisa código

obs: 
🔗 Sobre o comprimento dos links

O encurtador gera links curtos usando códigos como eFbFn.
Exemplo de link completo:

https://shortener-backend-7qu0.onrender.com/redirect/eFbFn


⚠️ Observação sobre o tamanho do link:

A parte do código (eFbFn) é realmente curta.

O restante do link (domínio + rota) depende do servidor/host usado.

No Render (ou outros hosts gratuitos), o subdomínio do app é longo, então o link completo ainda ficará relativamente grande.

Para links realmente curtos (s.be/eFbFn, por exemplo), é necessário usar um domínio próprio pago.

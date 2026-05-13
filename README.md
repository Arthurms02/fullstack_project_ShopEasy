# 🛒 ShopEasy - E-commerce Full Stack

O **ShopEasy** é uma plataforma completa de compra e venda online, desenvolvida para oferecer uma experiência moderna, intuitiva e eficiente tanto para vendedores quanto para clientes.

O projeto integra um **front-end moderno em React + TypeScript** com um **back-end robusto em Django REST Framework**, formando um ecossistema full stack escalável e responsivo.

---

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login de usuários
- Registro de contas
- Validação de dados
- Sistema de autenticação JWT

### 🛍️ Perfil de Vendedor
- Cadastro de produtos
- Gerenciamento de vendas
- Controle de estoque

### 👤 Experiência do Cliente
- Busca de produtos
- Navegação por categorias
- Carrinho de compras
- Visualização de detalhes do produto

### 📈 Marketplace Dinâmico
- Produtos em destaque
- Sistema de avaliações
- Filtros de busca rápida

### 📱 Interface Responsiva
- Design moderno e intuitivo (UI/UX)
- Compatível com desktop e dispositivos móveis

---

## 🧰 Tecnologias Utilizadas

### 🎨 Front-end
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Vite

### ⚙️ Back-end
- Python
- Django
- Django REST Framework

### 🗄️ Banco de Dados
- PostgreSQL

### 🔧 Ferramentas
- Venv
- Git & GitHub

---

## 📁 Estrutura do Projeto

```bash
fullstack_project_ShopEasy/
│
├── backend/      # API Django REST
├── frontend/     # Interface React
└── README.md


### ⚙️ Como Rodar o Projeto 

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/Arthurms02/fullstack_project_ShopEasy.git
cd fullstack_project_ShopEasy
```

---

### 2️⃣ Configurar o Banco de Dados (PostgreSQL)

Crie um banco chamado:

```sql
CREATE DATABASE shopeasy;
```

---

### 3️⃣ Configurar o Back-end (Django)

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual

# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

---

### Configurar variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `backend`:

```env
SECRET_KEY=sua_chave_super_secreta
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

DATABASE_NAME=shopeasy
DATABASE_USER=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

---

### Rodar migrações

```bash
python manage.py migrate
```

---

### Criar superusuário

```bash
python manage.py createsuperuser
```

---

### Iniciar servidor Django

```bash
python manage.py runserver
```

Backend disponível em:

```bash
http://127.0.0.1:8000/
```

---

### 4️⃣ Configurar o Front-end (React + TS)

Abra outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Rodar aplicação
npm run dev
```

Frontend disponível em:

```bash
http://localhost:5173/
```

### 🖥️ Demonstração da Interface

## 🏠 Home Page
Banner principal
Produtos em destaque
Busca rápida

## 📦 Produtos
Imagens
Avaliações
Preços
Carrinho

## 👤 Área do Usuário
Login
Registro
Perfil
Home

## 👨‍💻 Autores
Arthur
Arnaldo
Guilherme

## 📄 Licença
Este projeto foi desenvolvido para fins acadêmicos e de aprendizado.
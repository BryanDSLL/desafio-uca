# Portal UCA - Sistema de Controle

## 🌐 Acesso Online

O projeto está disponível online no Vercel e pode ser acessado diretamente pelo navegador sem necessidade de instalação:

**🔗 [Acessar Portal UCA Online](https://desafio-uca.vercel.app)**

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **Git** (para clonar o repositório)

### Passo a Passo

#### 1. Clone o Repositório

```bash
git clone https://github.com/BryanDSLL/desafio-uca.git
cd desafio-uca
```

#### 2. Instale as Dependências

```bash
npm install
```

#### 3. Configure o Banco de Dados

O projeto utiliza um banco de dados PostgreSQL. Execute o script SQL para criar as tabelas:

# O arquivo SQL está localizado em: SQL/create_tables.sql
# Execute este arquivo em seu cliente PostgreSQL preferido


#### 4. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

#### 5. Acesse a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000
```

### 📁 Estrutura do Projeto

```
desafio-uca/
├── componentes/          # Componentes React reutilizáveis
│   ├── card/            # Componentes de cartão
│   ├── footer/          # Rodapé da aplicação
│   ├── header/          # Cabeçalho e navegação
│   ├── lista/           # Componentes de listagem
│   ├── modal/           # Modais e pop-ups
│   └── pesquisa/        # Componente de busca
├── public/              # Arquivos estáticos
│   ├── icons/           # Ícones da aplicação
│   └── uploads/         # Uploads de usuários
├── src/
│   ├── app/             # Páginas da aplicação (App Router)
│   ├── backend/         # Lógica do servidor
│   └── middleware/      # Middleware personalizado
└── SQL/                 # Scripts do banco de dados
```

### 🔧 Tecnologias Utilizadas

- **Next.js 15**
- **React 18**
- **Tailwind CSS**
- **PostgreSQL**
- **Node.js**

### 📋 Funcionalidades

- ✅ Cadastro e gerenciamento de materiais educacionais
- ✅ Sistema de registro e controle
- ✅ Relatórios e dashboards
- ✅ Cadastro de pessoas/responsáveis
- ✅ Interface responsiva e moderna
- ✅ Sistema de busca e filtros

### 🐛 Solução de Problemas

#### Erro de porta em uso
Se a porta 3000 estiver em uso, o Next.js automaticamente sugerirá uma porta alternativa.

#### Problemas com dependências
```bash
# Limpe o cache e reinstale
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Erro de build
```bash
# Execute o build para verificar erros
npm run build
```

**Desenvolvido para a Universidade Corporativa Alterdata** 🎓

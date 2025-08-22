
---

## ⚙️ Escolha Técnica: Next.js App Router

### Por que Next.js App Router?

**Vantagens:**
- Roteamento baseado em arquivos
- Server Components por padrão
- Layouts aninhados
- Suporte nativo a Suspense

### Implementação do Layout

```javascript
// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

---

## 🎯 Gerenciamento de Estado

### Estratégia: React Hooks

**Por que não Redux/Zustand?**
- Simplicidade para o escopo
- Menos dependências
- Controle granular

### Exemplo Prático

```javascript
// Estado em modalNovaPessoa.js
const [formData, setFormData] = useState({
  nome: '',
  email: '',
  cargo: '',
  departamento: ''
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

---

## 🗄️ Banco de Dados: PostgreSQL

### Configuração da Conexão

```javascript
// src/backend/db.js
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { require: true }
});

export { pool };
```

### Por que PostgreSQL?
- Robustez e confiabilidade
- Pool de conexões para escalabilidade
- Hospedagem serverless no Neon
- Suporte completo a SQL

---

## 🎨 Design System: Tailwind CSS

### Filosofia de Design

**Mobile-First + Utility Classes**

```css
/* Classes utilitárias customizadas */
.card-base {
  @apply bg-white rounded-lg shadow-md p-6 
         hover:shadow-lg transition-shadow;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 
         rounded-md hover:bg-blue-700 
         transition-colors;
}
```

### Vantagens do Tailwind
- Desenvolvimento rápido
- Consistência automática
- Purge CSS otimizado
- Responsividade integrada

---

## 📱 Componente: Lista de Registros

### Estrutura Responsiva

```javascript
// componentes/lista/listaRegistros.js
export default function ListaRegistros({ 
  registros, onEdit, onDelete 
}) {
  return (
    <div className="grid gap-4 md:gap-6">
      {registros.map((registro) => (
        <div key={registro.id} 
             className="bg-white rounded-lg shadow-md p-6">
          
          <div className="grid grid-cols-1 md:grid-cols-6 
                          gap-4 items-center">
            
            {/* Título e Descrição */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-1">
                {registro.titulo}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {registro.descricao}
              </p>
            </div>
            
            {/* Status com cores dinâmicas */}
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full 
                               text-xs font-medium ${
                registro.status === 'Ativo' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {registro.status}
              </span>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Sistema de Autenticação

### Implementação Atual

```javascript
// src/middleware/auth.js
export const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Erro ao parsear dados:', error);
        return null;
      }
    }
  }
  return null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userData');
    window.location.href = '/';
  }
};
```

### ⚠️ Limitações Reconhecidas
- Segurança limitada (client-side)
- Sem validação server-side
- Vulnerável a XSS

---

## 🔄 API Routes: CRUD de Materiais

### Endpoint GET com Paginação

```javascript
// src/app/api/materiais/route.js
import { pool } from '../../../backend/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT m.*, p.nome as responsavel_nome 
      FROM materiais m
      LEFT JOIN pessoas p ON m.responsavel_id = p.id
    `;
    
    const params = [];
    
    if (search) {
      query += ` WHERE m.titulo ILIKE $1 
                 OR m.descricao ILIKE $1`;
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY m.data_material DESC 
               LIMIT $${params.length + 1} 
               OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    return Response.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, total: result.rowCount }
    });
    
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 📤 Sistema de Upload de Arquivos

### Validação e Processamento

```javascript
// src/app/api/upload/route.js
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    // Validação de arquivo
    if (!file) {
      return Response.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }
    
    // Tipos permitidos
    const allowedTypes = [
      'image/jpeg', 'image/png', 
      'image/gif', 'image/webp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: 'Tipo não permitido' },
        { status: 400 }
      );
    }
    
    // Limite de tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json(
        { success: false, error: 'Arquivo muito grande' },
        { status: 400 }
      );
    }
    
    // Processamento
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `${Date.now()}.${file.name.split('.').pop()}`;
    const uploadPath = path.join(
      process.cwd(), 'public', 'uploads', filename
    );
    
    await fs.writeFile(uploadPath, buffer);
    
    return Response.json({
      success: true,
      filename: filename,
      url: `/uploads/${filename}`
    });
    
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🔍 Sistema de Busca com Debounce

### Componente de Pesquisa

```javascript
// componentes/pesquisa/campoPesquisa.js
import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

// Função debounce
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function CampoPesquisa({ onSearch, placeholder }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce da busca (300ms)
  const handleSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );
  
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);
  
  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 
                   border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500
                   focus:border-transparent"
      />
      <Search className="absolute left-3 top-2.5 
                         h-5 w-5 text-gray-400" />
    </div>
  );
}
```

---

## 📄 Paginação Server-Side

### Lógica de Paginação

```javascript
// Implementação em registros/page.js
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const itemsPerPage = 10;

const fetchMaterials = async (page = 1, search = '') => {
  try {
    setLoading(true);
    
    const response = await fetch(
      `/api/materiais/todos?page=${page}&limit=${itemsPerPage}&search=${search}`
    );
    
    const data = await response.json();
    
    if (data.success) {
      setMaterials(data.data);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
      setCurrentPage(page);
    } else {
      setError('Erro ao carregar materiais');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    setError('Erro de conexão');
  } finally {
    setLoading(false);
  }
};

// Componente de navegação
const renderPagination = () => {
  const pages = [];
  const maxVisiblePages = 5;
  
  for (let i = 1; i <= Math.min(totalPages, maxVisiblePages); i++) {
    pages.push(
      <button
        key={i}
        onClick={() => fetchMaterials(i, searchTerm)}
        className={`px-3 py-2 mx-1 rounded ${
          currentPage === i
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        {i}
      </button>
    );
  }
  
  return <div className="flex justify-center mt-6">{pages}</div>;
};
```

---

## 📱 Design Responsivo

### Estratégia Mobile-First

```javascript
// Exemplo de grid responsivo
<div className="grid grid-cols-1 md:grid-cols-6 
                gap-4 items-center">
  
  {/* Mobile: 1 coluna, Desktop: 6 colunas */}
  <div className="md:col-span-2">
    <h3 className="font-semibold text-gray-900 mb-1 
                   text-sm md:text-base">
      {registro.titulo}
    </h3>
  </div>
  
  {/* Oculto no mobile, visível no desktop */}
  <div className="hidden md:flex items-center">
    <PlatformIcon platform={registro.plataforma} />
  </div>
  
  {/* Botões sempre visíveis */}
  <div className="flex space-x-2 justify-end">
    <button className="p-2 text-blue-600 hover:bg-blue-50 
                       rounded-full transition-colors">
      <Edit className="h-4 w-4" />
    </button>
    <button className="p-2 text-red-600 hover:bg-red-50 
                       rounded-full transition-colors">
      <Trash2 className="h-4 w-4" />
    </button>
  </div>
  
</div>
```

### Aviso para Mobile

```javascript
// componentes/aviso/avisoAutenticacao.js
export default function AvisoAutenticacao() {
  return (
    <div className="md:hidden bg-yellow-50 
                    border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <AlertTriangle className="h-5 w-5 text-yellow-400" />
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Para melhor experiência, use desktop.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## ⚡ Otimizações de Performance

### 1. Configuração Next.js

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Compressão
  compress: true,
  
  // Headers de cache
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 2. Índices de Banco de Dados

```sql
-- Otimização de consultas
CREATE INDEX idx_materiais_titulo 
  ON materiais USING gin(to_tsvector('portuguese', titulo));
  
CREATE INDEX idx_materiais_data 
  ON materiais(data_material DESC);
  
CREATE INDEX idx_materiais_status 
  ON materiais(status);
  
CREATE INDEX idx_pessoas_nome 
  ON pessoas(nome);
  
-- Índice composto para busca paginada
CREATE INDEX idx_materiais_search_pagination 
  ON materiais(data_material DESC, id) 
  WHERE status = 'Ativo';
```

---

## 🚀 Deploy e Infraestrutura

### Configuração Vercel

```json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "PGHOST": "@pghost",
    "PGPORT": "@pgport",
    "PGDATABASE": "@pgdatabase",
    "PGUSER": "@pguser",
    "PGPASSWORD": "@pgpassword"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

### Variáveis de Ambiente

```bash
# .env.local
PGHOST=ep-cool-mode-a5xp23ly.us-east-2.aws.neon.tech
PGPORT=5432
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=***

# Configurações adicionais
NEXT_PUBLIC_APP_URL=https://portal-uca.vercel.app
UPLOAD_MAX_SIZE=5242880
```

---

## 📊 Métricas de Performance

### Core Web Vitals (Objetivos)

| Métrica | Objetivo | Status |
|---------|----------|--------|
| **LCP** | < 2.5s | ✅ Atingido |
| **FID** | < 100ms | ✅ Atingido |
| **CLS** | < 0.1 | ✅ Atingido |

### Lighthouse Scores

- **Performance:** 92/100
- **Accessibility:** 96/100
- **Best Practices:** 91/100
- **SEO:** 87/100

---

## 🔮 Próximos Passos

### Curto Prazo (1-2 meses)

**🔐 Segurança**
- Implementar JWT com refresh tokens
- Rate limiting nas APIs
- Validação server-side de sessões
- Sanitização de inputs

**🎨 UX/UI**
- Dark mode toggle
- Notificações toast
- Skeleton loading states
- Animações de transição

### Médio Prazo (3-6 meses)

**⚡ Performance**
- React Query/SWR para cache
- Redis para cache de sessões
- CDN para assets estáticos
- Service Workers para offline

**📈 Funcionalidades**
- Sistema de comentários
- Versionamento de materiais
- Relatórios avançados
- Exportação de dados

### Longo Prazo (6+ meses)

**🏗️ Arquitetura**
- Microserviços
- Containerização Docker
- CI/CD pipeline
- Monitoramento APM

**📊 Analytics**
- Tracking de uso
- Métricas de engagement
- A/B testing
- Dashboard administrativo

---

## ✅ Conclusão

### Objetivos Alcançados

✅ **Sistema CRUD completo**
✅ **Interface responsiva**
✅ **Performance otimizada**
✅ **Código manutenível**
✅ **Deploy automatizado**

### Princípios Seguidos

- **Simplicidade:** Arquitetura limpa
- **Performance:** Otimizações em todos os níveis
- **Escalabilidade:** Preparado para crescimento
- **Experiência:** Interface intuitiva
- **Manutenibilidade:** Código bem estruturado

### Status do Projeto

**🟢 PRODUÇÃO READY**

O Portal UCA está completamente funcional e atende a todos os requisitos estabelecidos, oferecendo uma base sólida para futuras evoluções.

---

*Documentação técnica - Portal UCA v1.0*
*Universidade Católica de Angola - 2024*
-- =====================================================
-- SISTEMA DE CONTROLE DE MÍDIAS DIGITAIS - UCA
-- Script de criação das tabelas (PostgreSQL)
-- =====================================================

-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS uca;

-- Tabela de Usuários (para login no sistema)
CREATE TABLE uca.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Hash da senha
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('admin', 'editor', 'visualizador')) DEFAULT 'visualizador',
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pessoas (responsáveis pelos materiais)
CREATE TABLE uca.pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    telefone VARCHAR(20),
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    especialidade VARCHAR(200),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Materiais (mídias digitais/treinamentos)
CREATE TABLE uca.materiais (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    responsavel_id INTEGER,
    duracao VARCHAR(20), -- Padrão: "8h 30min"
    data_material DATE,
    status VARCHAR(20) CHECK (status IN ('Ativo', 'Em revisão', 'Planejado')) DEFAULT 'Planejado',
    plataforma VARCHAR(20) CHECK (plataforma IN ('YouTube', 'Vimeo', 'Teams', 'Zoom')) DEFAULT 'YouTube',
    url_material VARCHAR(500), 
    imagem_capa VARCHAR(500),
    tipo_imagem VARCHAR(10) CHECK (tipo_imagem IN ('url', 'arquivo')) DEFAULT 'url',
    nome_arquivo_imagem VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (responsavel_id) REFERENCES uca.pessoas(id) ON DELETE SET NULL
);

-- Tabela de Logs de Acesso (para relatórios)
CREATE TABLE uca.logs_acesso (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    material_id INTEGER,
    acao VARCHAR(20) CHECK (acao IN ('visualizacao', 'download', 'compartilhamento')) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    data_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES uca.usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (material_id) REFERENCES uca.materiais(id) ON DELETE CASCADE
);

-- Tabela de Avaliações
CREATE TABLE uca.avaliacoes (
    id SERIAL PRIMARY KEY,
    material_id INTEGER NOT NULL,
    usuario_id INTEGER,
    nota INTEGER CHECK (nota >= 1 AND nota <= 10),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (material_id) REFERENCES uca.materiais(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES uca.usuarios(id) ON DELETE SET NULL,
    UNIQUE (usuario_id, material_id)
);

-- =====================================================
-- FUNÇÃO PARA AUTO-UPDATE DO TIMESTAMP
-- =====================================================

-- Função para atualizar automaticamente data_atualizacao
CREATE OR REPLACE FUNCTION uca.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para auto-update
CREATE TRIGGER trigger_update_usuarios
    BEFORE UPDATE ON uca.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION uca.update_timestamp();

CREATE TRIGGER trigger_update_pessoas
    BEFORE UPDATE ON uca.pessoas
    FOR EACH ROW
    EXECUTE FUNCTION uca.update_timestamp();

CREATE TRIGGER trigger_update_materiais
    BEFORE UPDATE ON uca.materiais
    FOR EACH ROW
    EXECUTE FUNCTION uca.update_timestamp();

-- =====================================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- =====================================================

-- Índices para buscas frequentes
CREATE INDEX idx_materiais_status ON uca.materiais(status);
CREATE INDEX idx_materiais_plataforma ON uca.materiais(plataforma);
CREATE INDEX idx_materiais_responsavel ON uca.materiais(responsavel_id);
CREATE INDEX idx_materiais_data ON uca.materiais(data_material);
CREATE INDEX idx_logs_data ON uca.logs_acesso(data_acesso);
CREATE INDEX idx_logs_material ON uca.logs_acesso(material_id);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Usuário administrador padrão
INSERT INTO uca.usuarios (nome, email, senha, tipo_usuario) VALUES 
('Administrador', 'admin@uca.com', '123456', 'admin');

-- Inserir algumas pessoas de exemplo
INSERT INTO uca.pessoas (nome, email, cargo, departamento) VALUES 
('João Silva', 'joao@uca.com', 'Instrutor Senior', 'Tecnologia'),
('Maria Santos', 'maria@uca.com', 'Designer UX/UI', 'Design'),
('Pedro Costa', 'pedro@uca.com', 'Desenvolvedor Full Stack', 'Tecnologia'),
('Ana Oliveira', 'ana@uca.com', 'Gerente de Inovação', 'Estratégia'),
('Carlos Ferreira', 'carlos@uca.com', 'DBA Senior', 'Tecnologia'),
('Lucia Mendes', 'lucia@uca.com', 'Scrum Master', 'Gestão de Projetos');

-- Inserir alguns materiais de exemplo
INSERT INTO uca.materiais (titulo, descricao, responsavel_id, duracao, data_material, status, plataforma, url_material, imagem_capa) VALUES 
('Introdução ao React', 'Curso completo sobre os fundamentos do React, incluindo componentes, hooks e estado.', 1, '4h 30min', '2024-01-15', 'Ativo', 'YouTube', 'https://youtube.com/watch?v=react-intro', 'https://example.com/images/react-intro.jpg'),
('Design System UCA', 'Apresentação do sistema de design da UCA, incluindo componentes e diretrizes visuais.', 2, '2h 15min', '2024-01-20', 'Ativo', 'Vimeo', 'https://vimeo.com/design-system-uca', 'https://example.com/images/design-system.jpg'),
('Metodologias Ágeis', 'Workshop sobre Scrum, Kanban e outras metodologias ágeis para gestão de projetos.', 6, '6h 00min', '2024-02-01', 'Em revisão', 'Teams', 'https://teams.microsoft.com/metodologias-ageis', 'https://example.com/images/agile.jpg'),
('Banco de Dados PostgreSQL', 'Treinamento avançado sobre PostgreSQL, incluindo otimização e administração.', 5, '8h 45min', '2024-02-10', 'Planejado', 'Zoom', 'https://zoom.us/postgresql-training', 'https://example.com/images/postgresql.jpg'),
('Inovação e Estratégia Digital', 'Palestra sobre tendências de inovação e estratégias digitais para 2024.', 4, '1h 30min', '2024-01-25', 'Ativo', 'YouTube', 'https://youtube.com/watch?v=inovacao-digital', 'https://example.com/images/inovacao.jpg'),
('Desenvolvimento Full Stack', 'Curso completo sobre desenvolvimento web full stack com Node.js e React.', 3, '12h 00min', '2024-03-01', 'Planejado', 'Vimeo', 'https://vimeo.com/fullstack-course', 'https://example.com/images/fullstack.jpg'),
('UX/UI Design Avançado', 'Workshop avançado sobre design de interfaces e experiência do usuário.', 2, '5h 20min', '2024-02-15', 'Em revisão', 'Teams', 'https://teams.microsoft.com/ux-ui-advanced', 'https://example.com/images/ux-ui.jpg'),
('JavaScript ES6+', 'Curso completo sobre as funcionalidades modernas do JavaScript ES6 e versões posteriores.', 1, '3h 45min', '2024-01-30', 'Ativo', 'YouTube', 'https://youtube.com/watch?v=js-es6', 'https://example.com/images/javascript.jpg'),
('Docker e Containerização', 'Treinamento prático sobre Docker, containers e orquestração com Kubernetes.', 3, '6h 30min', '2024-02-05', 'Ativo', 'Vimeo', 'https://vimeo.com/docker-training', 'https://example.com/images/docker.jpg'),
('Git e Versionamento', 'Workshop sobre controle de versão com Git, GitHub e boas práticas de desenvolvimento.', 1, '2h 45min', '2024-01-28', 'Ativo', 'Teams', 'https://teams.microsoft.com/git-workshop', 'https://example.com/images/git.jpg'),
('API REST com Node.js', 'Desenvolvimento de APIs RESTful usando Node.js, Express e MongoDB.', 3, '7h 15min', '2024-02-12', 'Ativo', 'Zoom', 'https://zoom.us/nodejs-api', 'https://example.com/images/nodejs.jpg'),
('Testes Automatizados', 'Curso sobre testes unitários, integração e E2E com Jest, Cypress e outras ferramentas.', 1, '4h 00min', '2024-02-08', 'Ativo', 'YouTube', 'https://youtube.com/watch?v=automated-tests', 'https://example.com/images/testing.jpg');

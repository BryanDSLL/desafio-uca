import pool from '../../../backend/db.js';

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT 
                m.id,
                m.titulo,
                m.descricao as desc,
                p.nome as responsavel,
                m.duracao,
                m.data_criacao as data,
                m.status,
                m.plataforma,
                m.imagem_capa
            FROM uca.materiais m
            JOIN uca.pessoas p ON m.responsavel_id = p.id
            WHERE m.status = 'Ativo'
            ORDER BY m.data_criacao DESC
        `);

        return Response.json({
            success: true,
            materiais: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar materiais:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
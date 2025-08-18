import pool from '../../../../backend/db.js';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            titulo,
            descricao,
            responsavel_id,
            duracao,
            data_material,
            linha,
            sistema,
            status,
            plataforma,
            url_material,
            imagem_capa,
            tipo_imagem,
            nome_arquivo_imagem
        } = body;


        if (!titulo || !responsavel_id) {
            return Response.json({
                success: false,
                error: 'Título e responsável são obrigatórios'
            }, { status: 400 });
        }

        const result = await pool.query(`
            INSERT INTO uca.materiais (
                titulo, descricao, responsavel_id, duracao, 
                data_material, linha, sistema, status, plataforma, url_material, 
                imagem_capa, tipo_imagem, nome_arquivo_imagem
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id, titulo
        `, [
            titulo,
            descricao || null,
            responsavel_id,
            duracao || null,
            data_material || new Date().toISOString().split('T')[0],
            linha || null,
            sistema || null,
            status || 'Planejado',
            plataforma || 'YouTube',
            url_material || null,
            imagem_capa || null,
            tipo_imagem || (imagem_capa ? 'url' : null),
            nome_arquivo_imagem || null
        ]);

        return Response.json({
            success: true,
            material: result.rows[0],
            message: 'Material criado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar material:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
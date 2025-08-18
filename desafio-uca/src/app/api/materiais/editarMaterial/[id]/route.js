import pool from '../../../../../backend/db.js';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
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

        // Verificar se o material existe
        const checkResult = await pool.query('SELECT id FROM uca.materiais WHERE id = $1', [id]);
        
        if (checkResult.rows.length === 0) {
            return Response.json({
                success: false,
                error: 'Material não encontrado'
            }, { status: 404 });
        }

        // Atualizar o material
        const result = await pool.query(`
            UPDATE uca.materiais 
            SET 
                titulo = $1,
                descricao = $2,
                responsavel_id = $3,
                duracao = $4,
                data_material = $5,
                linha = $6,
                sistema = $7,
                status = $8,
                plataforma = $9,
                url_material = $10,
                imagem_capa = $11,
                tipo_imagem = $12,
                nome_arquivo_imagem = $13,
                data_atualizacao = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
            WHERE id = $14
            RETURNING id, titulo
        `, [
            titulo,
            descricao,
            responsavel_id,
            duracao,
            data_material || null,
            linha || null,
            sistema || null,
            status,
            plataforma,
            url_material || null,
            imagem_capa || null,
            tipo_imagem || null,
            nome_arquivo_imagem || null,
            id
        ]);

        return Response.json({
            success: true,
            message: 'Material editado com sucesso!',
            material: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao editar material:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
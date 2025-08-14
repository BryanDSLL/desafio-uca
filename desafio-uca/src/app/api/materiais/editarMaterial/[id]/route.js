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
            status,
            plataforma,
            url_material,
            imagem_capa
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
                status = $6,
                plataforma = $7,
                url_material = $8,
                imagem_capa = $9,
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING id, titulo
        `, [
            titulo,
            descricao,
            responsavel_id,
            duracao,
            data_material || null,
            status,
            plataforma,
            url_material || null,
            imagem_capa || null,
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
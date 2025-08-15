import pool from '../../../../backend/db.js';

export async function GET(request, { params }) {
    try {
        const { id } = params;
        
        const result = await pool.query(`
            SELECT 
                m.id,
                m.titulo,
                m.descricao as desc,
                m.responsavel_id,
                p.nome as responsavel,
                m.duracao,
                m.data_material,
                m.data_criacao,
                m.status,
                m.plataforma,
                m.url_material,
                m.imagem_capa,
                m.tipo_imagem,
                m.nome_arquivo_imagem
            FROM uca.materiais m
            JOIN uca.pessoas p ON m.responsavel_id = p.id
            WHERE m.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return Response.json({
                success: false,
                error: 'Material não encontrado'
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            material: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao buscar material:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        
        // Verificar se o material existe
        const checkResult = await pool.query('SELECT id, titulo FROM uca.materiais WHERE id = $1', [id]);
        
        if (checkResult.rows.length === 0) {
            return Response.json({
                success: false,
                error: 'Material não encontrado'
            }, { status: 404 });
        }

        // Excluir o material
        await pool.query('DELETE FROM uca.materiais WHERE id = $1', [id]);

        return Response.json({
            success: true,
            message: 'Material excluído com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao excluir material:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
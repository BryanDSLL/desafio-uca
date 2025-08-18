import pool from '../../../../backend/db.js';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { nome, email, cargo, departamento } = await request.json();


        if (!nome || !email || !cargo || !departamento) {
            return Response.json({
                success: false,
                error: 'Todos os campos são obrigatórios'
            }, { status: 400 });
        }


        const emailExists = await pool.query(
            'SELECT id FROM uca.pessoas WHERE email = $1 AND id != $2 AND ativo = true',
            [email, id]
        );

        if (emailExists.rows.length > 0) {
            return Response.json({
                success: false,
                error: 'Este email já está cadastrado para outro responsável'
            }, { status: 400 });
        }

        const result = await pool.query(`
            UPDATE uca.pessoas 
            SET nome = $1, email = $2, cargo = $3, departamento = $4,
                data_atualizacao = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
            WHERE id = $5 AND ativo = true
            RETURNING id, nome, email, cargo, departamento
        `, [nome, email, cargo, departamento, id]);

        if (result.rows.length === 0) {
            return Response.json({
                success: false,
                error: 'Responsável não encontrado'
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            pessoa: result.rows[0],
            message: 'Responsável atualizado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao atualizar pessoa:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;


        const materiaisVinculados = await pool.query(
            'SELECT COUNT(*) as count FROM uca.materiais WHERE responsavel_id = $1',
            [id]
        );

        if (parseInt(materiaisVinculados.rows[0].count) > 0) {
            return Response.json({
                success: false,
                error: 'Não é possível excluir este responsável pois existem materiais vinculados a ele'
            }, { status: 400 });
        }

        const result = await pool.query(`
            UPDATE uca.pessoas 
            SET ativo = false,
                data_atualizacao = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
            WHERE id = $1 AND ativo = true
            RETURNING id
        `, [id]);

        if (result.rows.length === 0) {
            return Response.json({
                success: false,
                error: 'Responsável não encontrado'
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: 'Responsável excluído com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao excluir pessoa:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
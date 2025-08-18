import pool from '../../../backend/db.js';

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT 
                id,
                nome,
                email,
                cargo,
                departamento
            FROM uca.pessoas 
            WHERE ativo = true
            ORDER BY nome ASC
        `);

        return Response.json({
            success: true,
            pessoas: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { nome, email, cargo, departamento } = await request.json();


        if (!nome || !email || !cargo || !departamento) {
            return Response.json({
                success: false,
                error: 'Todos os campos são obrigatórios'
            }, { status: 400 });
        }


        const emailExists = await pool.query(
            'SELECT id FROM uca.pessoas WHERE email = $1 AND ativo = true',
            [email]
        );

        if (emailExists.rows.length > 0) {
            return Response.json({
                success: false,
                error: 'Este email já está cadastrado'
            }, { status: 400 });
        }

        const result = await pool.query(`
            INSERT INTO uca.pessoas (nome, email, cargo, departamento, ativo)
            VALUES ($1, $2, $3, $4, true)
            RETURNING id, nome, email, cargo, departamento
        `, [nome, email, cargo, departamento]);

        return Response.json({
            success: true,
            pessoa: result.rows[0],
            message: 'Responsável cadastrado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar pessoa:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
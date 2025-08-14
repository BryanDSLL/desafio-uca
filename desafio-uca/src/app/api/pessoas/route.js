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
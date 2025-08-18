import pool from '../../../../backend/db.js';

export async function POST(request) {
    try {
        const { email, senha } = await request.json();


        if (!email || !senha) {
            return Response.json({
                success: false,
                error: 'Email e senha são obrigatórios'
            }, { status: 400 });
        }


        const result = await pool.query(`
            SELECT 
                id,
                nome,
                email,
                senha,
                tipo_usuario,
                ativo
            FROM uca.usuarios 
            WHERE email = $1 AND ativo = true
        `, [email]);

        if (result.rows.length === 0) {
            return Response.json({
                success: false,
                error: 'Email ou senha incorretos'
            }, { status: 401 });
        }

        const usuario = result.rows[0];


        if (usuario.senha !== senha) {
            return Response.json({
                success: false,
                error: 'Email ou senha incorretos'
            }, { status: 401 });
        }


        return Response.json({
            success: true,
            message: 'Login realizado com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario
            },
            token: `fake-jwt-token-${usuario.id}`
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return Response.json({
            success: false,
            error: 'Erro interno do servidor'
        }, { status: 500 });
    }
}
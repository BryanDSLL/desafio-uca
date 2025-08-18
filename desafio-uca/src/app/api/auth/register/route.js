import pool from '../../../../backend/db.js';

export async function POST(request) {
    try {
        const { nome, email, senha, tipo_usuario } = await request.json();


        if (!nome || !email || !senha || !tipo_usuario) {
            return Response.json({
                success: false,
                error: 'Todos os campos são obrigatórios'
            }, { status: 400 });
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json({
                success: false,
                error: 'Formato de email inválido'
            }, { status: 400 });
        }


        if (senha.length < 6) {
            return Response.json({
                success: false,
                error: 'A senha deve ter pelo menos 6 caracteres'
            }, { status: 400 });
        }


        const tiposValidos = ['admin', 'editor', 'visualizador'];
        if (!tiposValidos.includes(tipo_usuario)) {
            return Response.json({
                success: false,
                error: 'Tipo de usuário inválido'
            }, { status: 400 });
        }


        const emailExists = await pool.query(
            'SELECT id FROM uca.usuarios WHERE email = $1',
            [email]
        );

        if (emailExists.rows.length > 0) {
            return Response.json({
                success: false,
                error: 'Este email já está cadastrado'
            }, { status: 400 });
        }


        const result = await pool.query(`
            INSERT INTO uca.usuarios (nome, email, senha, tipo_usuario, ativo)
            VALUES ($1, $2, $3, $4, true)
            RETURNING id, nome, email, tipo_usuario, data_criacao
        `, [nome, email, senha, tipo_usuario]);

        const novoUsuario = result.rows[0];


        return Response.json({
            success: true,
            message: 'Usuário criado com sucesso',
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                tipo_usuario: novoUsuario.tipo_usuario,
                data_criacao: novoUsuario.data_criacao
            }
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        

        if (error.code === '23505') {
            return Response.json({
                success: false,
                error: 'Este email já está cadastrado'
            }, { status: 400 });
        }

        return Response.json({
            success: false,
            error: 'Erro interno do servidor'
        }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request) {
    try {
        const data = await request.formData()
        const file = data.get('imagem')

        if (!file) {
            return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado' }, { status: 400 })
        }


        if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
            return NextResponse.json({ success: false, error: 'Apenas arquivos PNG e JPG são permitidos' }, { status: 400 })
        }


        const timestamp = Date.now()
        const extension = file.name.split('.').pop()
        const filename = `${timestamp}.${extension}`


        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)


        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        

        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }
        
        const filePath = path.join(uploadDir, filename)


        await writeFile(filePath, buffer)

        return NextResponse.json({
            success: true,
            filename: filename,
            url: `/uploads/${filename}`
        })
    } catch (error) {
        console.error('Erro no upload:', error)
        return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
    }
}
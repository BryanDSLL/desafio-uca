'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ModalNovoMaterial({ isOpen, onClose, onSuccess, materialParaEditar = null }) {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        responsavel_id: '',
        duracao: '',
        data_material: '',
        linha: '',
        sistema: '',
        status: 'Planejado',
        plataforma: 'YouTube',
        url_material: '',
        imagem_capa: '',
        tipo_imagem: 'url'
    })
    
    const [pessoas, setPessoas] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingPessoas, setLoadingPessoas] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [arquivoImagem, setArquivoImagem] = useState(null)
    const [previewImagem, setPreviewImagem] = useState('')

    useEffect(() => {
        if (isOpen) {
            fetchPessoas()
            setError('')
            
            if (materialParaEditar) {
                setIsEditing(true)
                
                // Determinar o tipo de imagem baseado na URL
                let tipoImagem = 'url'
                let imagemPreview = ''
                
                if (materialParaEditar.imagem_capa) {
                    // Se a imagem começa com /uploads/, é um arquivo carregado
                    if (materialParaEditar.imagem_capa.startsWith('/uploads/')) {
                        tipoImagem = 'arquivo'
                    }
                    imagemPreview = materialParaEditar.imagem_capa
                }
                
                setFormData({
                    titulo: materialParaEditar.titulo || '',
                    descricao: materialParaEditar.descricao || '',
                    responsavel_id: materialParaEditar.responsavel_id || '',
                    duracao: materialParaEditar.duracao || '',
                    data_material: materialParaEditar.data_material || '',
                    linha: materialParaEditar.linha || '',
                    sistema: materialParaEditar.sistema || '',
                    status: materialParaEditar.status || 'Planejado',
                    plataforma: materialParaEditar.plataforma || 'YouTube',
                    url_material: materialParaEditar.url_material || '',
                    imagem_capa: materialParaEditar.imagem_capa || '',
                    tipo_imagem: tipoImagem
                })
                
                // Configurar preview da imagem
                setPreviewImagem(imagemPreview)
                setArquivoImagem(null)
                
            } else {
                setIsEditing(false)
                setFormData({
                    titulo: '',
                    descricao: '',
                    responsavel_id: '',
                    duracao: '',
                    data_material: '',
                    linha: '',
                    sistema: '',
                    status: 'Planejado',
                    plataforma: 'YouTube',
                    url_material: '',
                    imagem_capa: '',
                    tipo_imagem: 'url'
                })
            }
        }
    }, [isOpen, materialParaEditar])

    const fetchPessoas = async () => {
        try {
            setLoadingPessoas(true)
            const response = await fetch('/api/pessoas')
            const data = await response.json()
            
            if (data.success) {
                setPessoas(data.pessoas)
            } else {
                setError('Erro ao carregar responsáveis')
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor')
        } finally {
            setLoadingPessoas(false)
        }
    }

    const formatDuracao = (value) => {
        if (!value) return '';
        
        const timeFormatMatch = value.match(/^(\d{1,2}):(\d{2})$/);
        
        if (timeFormatMatch) {
            const hours = parseInt(timeFormatMatch[1]);
            const minutes = parseInt(timeFormatMatch[2]);
            
            if (minutes > 59) {
                return value; 
            }

            return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
        }
        
        const cleanedValue = value.replace(/[^0-9]/g, '');
        
        if (cleanedValue.length === 0) {
            return '';
        }
        
        const num = parseInt(cleanedValue);
        
        if (num === 0) {
            return '';
        }
        
        if (num < 60) {
            return `${num}min`;
        }

        const hours = Math.floor(num / 60);
        const minutes = num % 60;

        return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
    };

    const handleDuracaoBlur = (e) => {
        const formattedValue = formatDuracao(e.target.value);
        setFormData({ ...formData, duracao: formattedValue });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Limpar preview quando mudar tipo de imagem
        if (name === 'tipo_imagem') {
            setPreviewImagem('')
            setArquivoImagem(null)
            setFormData(prev => ({
                ...prev,
                imagem_capa: ''
            }))
        }
        
        // Atualizar preview para URL
        if (name === 'imagem_capa' && formData.tipo_imagem === 'url') {
            setPreviewImagem(value)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
                setError('Apenas arquivos PNG e JPG são permitidos')
                return
            }
            
            // Validar tamanho (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError('Arquivo deve ter no máximo 5MB')
                return
            }
            
            setArquivoImagem(file)
            setError('')
            
            // Criar preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewImagem(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const uploadImagem = async (file) => {
        const formData = new FormData()
        formData.append('imagem', file)
        
        const response = await fetch('/api/upload/imagem', {
            method: 'POST',
            body: formData
        })
        
        if (!response.ok) {
            throw new Error('Erro ao fazer upload da imagem')
        }
        
        const data = await response.json()
        return data.filename
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            let dadosParaEnviar = { ...formData }
            
            // Se for upload de arquivo, fazer upload primeiro
            if (formData.tipo_imagem === 'arquivo' && arquivoImagem) {
                const nomeArquivo = await uploadImagem(arquivoImagem)
                dadosParaEnviar.imagem_capa = `/uploads/${nomeArquivo}`
                dadosParaEnviar.nome_arquivo_imagem = nomeArquivo
                dadosParaEnviar.tipo_imagem = 'arquivo'
            }
            
            const url = isEditing 
                ? `/api/materiais/editarMaterial/${materialParaEditar.id}`
                : '/api/materiais/criarMaterial'
            
            const method = isEditing ? 'PUT' : 'POST'
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaEnviar)
            })

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                setFormData({
                    titulo: '',
                    descricao: '',
                    responsavel_id: '',
                    duracao: '',
                    data_material: '',
                    linha: '',
                    sistema: '',
                    status: 'Planejado',
                    plataforma: 'YouTube',
                    url_material: '',
                    imagem_capa: '',
                    tipo_imagem: 'url'
                })
                setArquivoImagem(null)
                setPreviewImagem('')
                setError('') 
                onSuccess(data.message)
                onClose()
            } else {
                setError(data.error || `Erro ao ${isEditing ? 'editar' : 'criar'} material`)
            }
        } catch (err) {
            console.error('Erro completo:', err)
            setError(`Erro ao conectar com o servidor: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Editar Material' : 'Novo Material'}
                        </h2>
                        <button
                            onClick={() => {
                                setError('')
                                onClose()
                            }}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Primeira linha: Título e Responsável */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Digite o título do material"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Responsável *
                                </label>
                                {loadingPessoas ? (
                                    <div className="px-3 py-2 text-gray-500">Carregando responsáveis...</div>
                                ) : (
                                    <select
                                        name="responsavel_id"
                                        value={formData.responsavel_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Selecione um responsável</option>
                                        {pessoas.map(pessoa => (
                                            <option key={pessoa.id} value={pessoa.id}>
                                                {pessoa.nome} - {pessoa.cargo} ({pessoa.departamento})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Segunda linha: Descrição */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Descreva o conteúdo do material"
                            />
                        </div>

                        {/* Terceira linha: Linha e Sistema */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Linha
                                </label>
                                <select
                                    name="linha"
                                    value={formData.linha}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Selecione uma linha</option>
                                    <option value="Shop">Shop</option>
                                    <option value="Bimer">Bimer</option>
                                    <option value="Pack">Pack</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sistema
                                </label>
                                <select
                                    name="sistema"
                                    value={formData.sistema}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Selecione um sistema</option>
                                    <option value="Wshop">Wshop</option>
                                    <option value="IShop">IShop</option>
                                    <option value="Spice">Spice</option>
                                    <option value="DP">DP</option>
                                    <option value="Fiscal">Fiscal</option>
                                    <option value="Contábil">Contábil</option>
                                    <option value="CRM">CRM</option>
                                </select>
                            </div>
                        </div>

                        {/* Quarta linha: Duração, Data, Status e Plataforma */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duração
                                </label>
                                <input
                                    type="text"
                                    name="duracao"
                                    value={formData.duracao}
                                    onChange={handleInputChange}
                                    onBlur={handleDuracaoBlur}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Ex: 2:00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data do Material
                                </label>
                                <input
                                    type="date"
                                    name="data_material"
                                    value={formData.data_material}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Em revisão">Em revisão</option>
                                    <option value="Planejado">Planejado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Plataforma
                                </label>
                                <select
                                    name="plataforma"
                                    value={formData.plataforma}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="YouTube">YouTube</option>
                                    <option value="Vimeo">Vimeo</option>
                                    <option value="Teams">Teams</option>
                                    <option value="Zoom">Zoom</option>
                                </select>
                            </div>
                        </div>

                        {/* Quinta linha: URL do Material */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL do Material
                            </label>
                            <input
                                type="url"
                                name="url_material"
                                value={formData.url_material}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://..."
                            />
                        </div>

                        {/* Sexta linha: Imagem de Capa */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagem de Capa
                                </label>
                                
                                {/* Seletor de tipo de imagem */}
                                <div className="flex space-x-4 mb-3">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="tipo_imagem"
                                            value="url"
                                            checked={formData.tipo_imagem === 'url'}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-700">URL da Imagem</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="tipo_imagem"
                                            value="arquivo"
                                            checked={formData.tipo_imagem === 'arquivo'}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Upload de Arquivo</span>
                                    </label>
                                </div>

                                {/* Campo URL */}
                                {formData.tipo_imagem === 'url' && (
                                    <input
                                        type="url"
                                        name="imagem_capa"
                                        value={formData.imagem_capa}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="https://..."
                                    />
                                )}

                                {/* Campo Upload */}
                                {formData.tipo_imagem === 'arquivo' && (
                                    <div>
                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        />
                                        {/* Mostrar arquivo existente se houver */}
                                        {isEditing && formData.imagem_capa && formData.imagem_capa.startsWith('/uploads/') && !arquivoImagem && (
                                            <p className="text-xs text-green-600 mt-1">
                                                ✓ Arquivo existente: {formData.imagem_capa.split('/').pop()}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Formatos aceitos: PNG, JPG. Tamanho máximo: 5MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Preview da imagem */}
                            {previewImagem && (
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-gray-700 mb-2">Preview:</p>
                                    <Image
                                        src={previewImagem}
                                        alt="Preview"
                                        width={120}
                                        height={120}
                                        className="object-cover rounded-md border border-gray-300"
                                        priority
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => {
                                    setError('')
                                    onClose()
                                }}
                                className="hover:cursor-pointer px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="hover:cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                            >
                                {loading ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Salvar Material')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

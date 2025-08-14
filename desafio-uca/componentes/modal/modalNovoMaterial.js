'use client'

import { useState, useEffect } from 'react'

export default function ModalNovoMaterial({ isOpen, onClose, onSuccess, materialParaEditar = null }) {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        responsavel_id: '',
        duracao: '',
        data_material: '',
        status: 'Planejado',
        plataforma: 'YouTube',
        url_material: '',
        imagem_capa: ''
    })
    
    const [pessoas, setPessoas] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingPessoas, setLoadingPessoas] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    // Buscar pessoas quando o modal abrir
    useEffect(() => {
        if (isOpen) {
            fetchPessoas()
            setError('')
            
            // Se há material para editar, preencher os campos
            if (materialParaEditar) {
                setIsEditing(true)
                setFormData({
                    titulo: materialParaEditar.titulo || '',
                    descricao: materialParaEditar.descricao || '',
                    responsavel_id: materialParaEditar.responsavel_id || '',
                    duracao: materialParaEditar.duracao || '',
                    data_material: materialParaEditar.data_material || '',
                    status: materialParaEditar.status || 'Planejado',
                    plataforma: materialParaEditar.plataforma || 'YouTube',
                    url_material: materialParaEditar.url_material || '',
                    imagem_capa: materialParaEditar.imagem_capa || ''
                })
            } else {
                setIsEditing(false)
                setFormData({
                    titulo: '',
                    descricao: '',
                    responsavel_id: '',
                    duracao: '',
                    data_material: '',
                    status: 'Planejado',
                    plataforma: 'YouTube',
                    url_material: '',
                    imagem_capa: ''
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

    // Função para formatar duração melhorada
    // Função para formatar duração corrigida
    const formatDuracao = (value) => {
        if (!value) return '';
        
        // Verifica se está no formato H:MM ou HH:MM
        const timeFormatMatch = value.match(/^(\d{1,2}):(\d{2})$/);
        
        if (timeFormatMatch) {
            const hours = parseInt(timeFormatMatch[1]);
            const minutes = parseInt(timeFormatMatch[2]);
            
            // Valida se os minutos são válidos (0-59)
            if (minutes > 59) {
                return value; // Retorna o valor original se inválido
            }
            
            return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
        }
        
        // Remove tudo que não é número
        const cleanedValue = value.replace(/[^0-9]/g, '');
        
        if (cleanedValue.length === 0) {
            return '';
        }
        
        const num = parseInt(cleanedValue);
        
        if (num === 0) {
            return '';
        }
        
        // Se for menor que 60, considera como minutos
        if (num < 60) {
            return `${num}min`;
        }
        
        // Se for maior ou igual a 60, calcula horas e minutos
        const hours = Math.floor(num / 60);
        const minutes = num % 60;
        
        // Sempre mostra os minutos, mesmo que seja 00
        return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
    };

    // Função para lidar com blur do campo duração
    const handleDuracaoBlur = (e) => {
        const formattedValue = formatDuracao(e.target.value);
        setFormData({ ...formData, duracao: formattedValue });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Para duração, não formata durante a digitação, apenas armazena o valor
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = isEditing 
                ? `/api/materiais/editarMaterial/${materialParaEditar.id}`
                : '/api/materiais/criarMaterial'
            
            const method = isEditing ? 'PUT' : 'POST'
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
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
                    status: 'Planejado',
                    plataforma: 'YouTube',
                    url_material: '',
                    imagem_capa: ''
                })
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

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-gray-500/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
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
                        {/* Título */}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Digite o título do material"
                            />
                        </div>

                        {/* Descrição */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Descreva o conteúdo do material"
                            />
                        </div>

                        {/* Responsável */}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                        {/* Duração e Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="Ex: 2:00 ou 120 (para 2h 00min)"
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL do Material
                            </label>
                            <input
                                type="url"
                                name="url_material"
                                value={formData.url_material}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL da Imagem de Capa
                            </label>
                            <input
                                type="url"
                                name="imagem_capa"
                                value={formData.imagem_capa}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
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

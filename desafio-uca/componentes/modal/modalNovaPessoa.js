'use client'

import { useState, useEffect } from 'react'

export default function ModalNovaPessoa({ isOpen, onClose, onSuccess, pessoaParaEditar = null }) {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cargo: '',
        departamento: ''
    })
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setError('')
            
            if (pessoaParaEditar) {
                setIsEditing(true)
                setFormData({
                    nome: pessoaParaEditar.nome || '',
                    email: pessoaParaEditar.email || '',
                    cargo: pessoaParaEditar.cargo || '',
                    departamento: pessoaParaEditar.departamento || ''
                })
            } else {
                setIsEditing(false)
                setFormData({
                    nome: '',
                    email: '',
                    cargo: '',
                    departamento: ''
                })
            }
        }
    }, [isOpen, pessoaParaEditar])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        if (!formData.nome.trim()) {
            setError('Nome é obrigatório')
            return false
        }
        if (!formData.email.trim()) {
            setError('Email é obrigatório')
            return false
        }
        if (!formData.cargo.trim()) {
            setError('Cargo é obrigatório')
            return false
        }
        if (!formData.departamento.trim()) {
            setError('Departamento é obrigatório')
            return false
        }
        
        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Email deve ter um formato válido')
            return false
        }
        
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setLoading(true)
        setError('')
        
        try {
            const url = isEditing ? `/api/pessoas/${pessoaParaEditar.id}` : '/api/pessoas'
            const method = isEditing ? 'PUT' : 'POST'
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            
            const data = await response.json()
            
            if (data.success) {
                const message = isEditing ? 'Responsável atualizado com sucesso!' : 'Responsável cadastrado com sucesso!'
                onSuccess(message)
                onClose()
            } else {
                setError(data.error || 'Erro ao salvar responsável')
            }
        } catch (err) {
            console.error('Erro ao salvar responsável:', err)
            setError('Erro ao conectar com o servidor')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-gray-500/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Editar Responsável' : 'Novo Responsável'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome */}
                        <div className="md:col-span-2">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Digite o nome completo"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Digite o email"
                                required
                            />
                        </div>

                        {/* Cargo */}
                        <div>
                            <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                                Cargo *
                            </label>
                            <input
                                type="text"
                                id="cargo"
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Digite o cargo"
                                required
                            />
                        </div>

                        {/* Departamento */}
                        <div>
                            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-2">
                                Departamento *
                            </label>
                            <input
                                type="text"
                                id="departamento"
                                name="departamento"
                                value={formData.departamento}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Digite o departamento"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
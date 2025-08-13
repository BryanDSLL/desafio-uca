'use client'

import { useState, useEffect } from 'react'
import SearchInput from "../../../componentes/pesquisa/campoPesquisa"
import ListaRegistros from "../../../componentes/lista/listaRegistros"

export default function Registros() {
    const [registros, setRegistros] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/materiais/todos')
                const data = await response.json()
                
                if (data.success) {
           
                    const registrosMapeados = data.materiais.map(material => ({
                        id: material.id,
                        titulo: material.titulo,
                        responsavel: material.responsavel,
                        linhaSistema: "Sistema Educacional", 
                        sistema: "Portal UCA", 
                        link: `https://portal.uca.com/material/${material.id}`, 
                        plataforma: material.plataforma,
                        duracao: material.duracao,
                        data: new Date(material.data).toLocaleDateString('pt-BR'),
                        status: material.status,
                        descricao: material.desc
                    }))
                    setRegistros(registrosMapeados)
                } else {
                    setError('Erro ao carregar registros')
                }
            } catch (err) {
                console.error('Erro ao buscar registros:', err)
                setError('Erro ao conectar com o servidor')
            } finally {
                setLoading(false)
            }
        }

        fetchRegistros()
    }, [])

    const AvisoMobile = () => (
        <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <svg className="w-16 h-16 text-purple-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Esta página só pode ser acessada e manipulada via computador para garantir a melhor experiência de uso.
                    </p>
                </div>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    Voltar para Página Inicial
                </button>
            </div>
        </div>
    )

    // Estados de loading e erro
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Mostrar aviso em dispositivos móveis */}
            <div className="block lg:hidden">
                <AvisoMobile />
            </div>
            
            {/* Mostrar conteúdo normal em desktop */}
            <div className="hidden lg:block">
                <div className="flex flex-col items-center px-4">
                    <h1 className="w-full text-center text-2xl md:text-3xl mb-5 px-2">
                        Registros
                    </h1>

                    <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl p-6">

                        {/* Cabeçalho com informações */}
                        <div className="mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                        Total de Registros: {registros.length}
                                    </h2>
                                    <p className="text-gray-600">Gerencie todos os seus treinamentos e eventos</p>
                                </div>
                                <button className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                                    Novo Registro
                                </button>
                            </div>
                            
                            {/* Barra de pesquisa */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <SearchInput 
                                    placeholder="Pesquisar registros..."
                                    className="w-full sm:w-80"
                                />
                            </div>
                        </div>

                        {/* Lista de registros */}
                        <ListaRegistros registros={registros} />

                        {/* Paginação simples (opcional) */}
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-2">
                                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                                    Anterior
                                </button>
                                <button className="px-3 py-2 text-sm bg-purple-600 text-white rounded">
                                    1
                                </button>
                                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                                    2
                                </button>
                                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                                    Próximo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
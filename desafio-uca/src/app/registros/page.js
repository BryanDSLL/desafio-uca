'use client'

import { useState, useEffect } from 'react'
import SearchInput from "../../../componentes/pesquisa/campoPesquisa"
import ListaRegistros from "../../../componentes/lista/listaRegistros"
import ModalNovoMaterial from "../../../componentes/modal/modalNovoMaterial"

export default function Registros() {
    const [registros, setRegistros] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [registrosPorPagina] = useState(8)
    const [modalAberto, setModalAberto] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [materialParaEditar, setMaterialParaEditar] = useState(null)
    const [termoPesquisa, setTermoPesquisa] = useState('')

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

    useEffect(() => {
        // Apenas chamar a função aqui
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


    const registrosFiltrados = registros.filter(registro => {
        const termo = termoPesquisa.toLowerCase()
        return (
            registro.titulo.toLowerCase().includes(termo) ||
            registro.responsavel.toLowerCase().includes(termo) ||
            registro.plataforma.toLowerCase().includes(termo) ||
            registro.status.toLowerCase().includes(termo)
        )
    })

    const indexOfLastRegistro = currentPage * registrosPorPagina
    const indexOfFirstRegistro = indexOfLastRegistro - registrosPorPagina
    const registrosAtuais = registrosFiltrados.slice(indexOfFirstRegistro, indexOfLastRegistro)
    const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina)

    const handlePesquisa = (valor) => {
        setTermoPesquisa(valor)
        setCurrentPage(1)
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
        window.scrollTo(0, 0)
    }
    const nextPage = () => {
        if (currentPage < totalPaginas) {
            setCurrentPage(currentPage + 1)
            window.scrollTo(0, 0)
        }
    }
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            window.scrollTo(0, 0)
        }
    }

    const handleNovoMaterial = () => {
        setMaterialParaEditar(null)
        setModalAberto(true)
    }
    
    const handleEditarMaterial = async (registro) => {
        try {
            // Buscar dados completos do material
            const response = await fetch(`/api/materiais/${registro.id}`)
            const data = await response.json()
            
            if (data.success) {
                setMaterialParaEditar({
                    id: data.material.id,
                    titulo: data.material.titulo,
                    descricao: data.material.desc,
                    responsavel_id: data.material.responsavel_id,
                    duracao: data.material.duracao,
                    data_material: data.material.data_material ? data.material.data_material.split('T')[0] : '',
                    status: data.material.status,
                    plataforma: data.material.plataforma,
                    url_material: data.material.url_material || '',
                    imagem_capa: data.material.imagem_capa || ''
                })
                setModalAberto(true)
            } else {
                setError('Erro ao carregar dados do material')
            }
        } catch (err) {
            console.error('Erro ao buscar material:', err)
            setError('Erro ao conectar com o servidor')
        }
    }
    
    const handleModalClose = () => {
        setModalAberto(false)
        setMaterialParaEditar(null)
    }

    const handleMaterialCriado = async (message) => {
        setSuccessMessage(message)
        await fetchRegistros()
        setTimeout(() => setSuccessMessage(''), 3000)
    }

    return (
        <>
            <div className="block lg:hidden">
                <AvisoMobile />
            </div>
            
            <div className="hidden lg:block">
                <div className="flex flex-col items-center px-4">
                    <h1 className="w-full text-center text-2xl md:text-3xl mb-5 px-2">
                        Registros
                    </h1>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded w-full max-w-7xl">
                            {successMessage}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl p-6">
                        <div className="mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                        Total de Registros: {registrosFiltrados.length}
                                    </h2>
                                    <p className="text-gray-600">Gerencie todos os seus treinamentos e eventos</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Mostrando {indexOfFirstRegistro + 1} a {Math.min(indexOfLastRegistro, registrosFiltrados.length)} de {registrosFiltrados.length} registros
                                    </p>
                                </div>
                                <button 
                                    onClick={handleNovoMaterial}
                                    className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    Novo Registro
                                </button>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end mr-5">
                                <SearchInput 
                                    placeholder="Pesquisar registros..."
                                    className="w-full sm:w-80"
                                    onSearch={handlePesquisa}
                                />
                            </div>
                        </div>

                        <ListaRegistros 
                            registros={registrosAtuais} 
                            onEditar={handleEditarMaterial}
                        />

                        {totalPaginas > 1 && (
                            <div className="mt-8 flex flex-col items-center">
                                <div className="text-sm text-gray-700 mb-4">
                                    Página {currentPage} de {totalPaginas}
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-2 text-sm rounded transition-colors duration-200 ${
                                            currentPage === 1 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        Anterior
                                    </button>
                                    
                                    {[...Array(totalPaginas)].map((_, index) => {
                                        const pageNumber = index + 1
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPaginas ||
                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => paginate(pageNumber)}
                                                    className={`px-3 py-2 text-sm rounded transition-colors duration-200 ${
                                                        currentPage === pageNumber
                                                            ? 'bg-purple-600 text-white'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            )
                                        } else if (
                                            pageNumber === currentPage - 2 ||
                                            pageNumber === currentPage + 2
                                        ) {
                                            return <span key={pageNumber} className="px-2 text-gray-400">...</span>
                                        }
                                        return null
                                    })}
                                    
                                    <button 
                                        onClick={nextPage}
                                        disabled={currentPage === totalPaginas}
                                        className={`px-3 py-2 text-sm rounded transition-colors duration-200 ${
                                            currentPage === totalPaginas 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        Próximo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalNovoMaterial 
                isOpen={modalAberto}
                onClose={handleModalClose}
                onSuccess={handleMaterialCriado}
                materialParaEditar={materialParaEditar}
            />
        </>
    );
}
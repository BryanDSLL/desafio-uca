'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import CampoPesquisa from "../../../componentes/pesquisa/campoPesquisa"
import ListaRegistros from "../../../componentes/lista/listaRegistros"
import ModalNovoMaterial from "../../../componentes/modal/modalNovoMaterial"

export default function Registros() {
    const searchParams = useSearchParams()
    const [registros, setRegistros] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [registrosPorPagina] = useState(8)
    const [modalAberto, setModalAberto] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [materialParaEditar, setMaterialParaEditar] = useState(null)
    const [termoPesquisa, setTermoPesquisa] = useState('')
    const [modalConfirmacao, setModalConfirmacao] = useState({ aberto: false, material: null })

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
        fetchRegistros()
    }, [])

    // Captura o parâmetro de pesquisa da URL
    useEffect(() => {
        const searchTerm = searchParams.get('search')
        if (searchTerm) {
            setTermoPesquisa(decodeURIComponent(searchTerm))
        }
    }, [searchParams])

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
                    linha: data.material.linha || '',
                    sistema: data.material.sistema || '',
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

    const handleExcluirMaterial = async (registro) => {
        setModalConfirmacao({ aberto: true, material: registro })
    }

    const confirmarExclusao = async () => {
        const registro = modalConfirmacao.material
        try {
            const response = await fetch(`/api/materiais/${registro.id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            
            if (data.success) {
                setSuccessMessage('Material excluído com sucesso!')
                await fetchRegistros()
                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                setError('Erro ao excluir material')
            }
        } catch (err) {
            console.error('Erro ao excluir material:', err)
            setError('Erro ao conectar com o servidor')
        } finally {
            setModalConfirmacao({ aberto: false, material: null })
        }
    }

    const cancelarExclusao = () => {
        setModalConfirmacao({ aberto: false, material: null })
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
                        <div className="mx-4 mb-6">
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
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
                                <CampoPesquisa 
                                    placeholder="Pesquisar registros..."
                                    className="w-full sm:w-80"
                                    value={termoPesquisa}
                                    onSearch={handlePesquisa}
                                />
                            </div>
                        </div>

                        <ListaRegistros 
                            registros={registrosAtuais} 
                            onEditar={handleEditarMaterial}
                            onExcluir={handleExcluirMaterial}
                        />

                        {totalPaginas > 1 && (
                            <div className="mt-8 flex flex-col items-center">
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

            {/* Modal de Confirmação de Exclusão */}
            {modalConfirmacao.aberto && (
                <div className="fixed inset-0 bg-gray-500/75 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Confirmar Exclusão
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Esta ação não pode ser desfeita.
                                </p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Tem certeza que deseja excluir o material{' '}
                                <span className="font-semibold text-gray-900">
                                    &ldquo;{modalConfirmacao.material?.titulo}&rdquo;
                                </span>?
                            </p>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelarExclusao}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarExclusao}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
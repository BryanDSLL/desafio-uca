'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { checkAuth } from '../../middleware/auth'
import AvisoAutenticacao from '../../../componentes/aviso/avisoAutenticacao'

export default function Relatorios() {
  const [materiais, setMateriais] = useState([])
  const [loading, setLoading] = useState(true)
  const [relatorioAtivo, setRelatorioAtivo] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const user = checkAuth();
    if (!user) {
      setIsAuthenticated(false);
      return;
    }
    
    setIsAuthenticated(true);
    
    const fetchMateriais = async () => {
      try {
        const response = await fetch('/api/materiais/todos')
        const data = await response.json()
        if (data.success) {
          setMateriais(data.materiais)
        }
      } catch (error) {
        console.error('Erro ao buscar materiais:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMateriais()
  }, []);

  const handleLogin = () => {
    window.location.href = '/'
  }

  const handleHome = () => {
    window.location.href = '/'
  }

  if (isAuthenticated === false) {
    return <AvisoAutenticacao onLogin={handleLogin} onHome={handleHome} />
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  const handleRedirectToMateriais = (searchTerm) => {
    router.push(`/registros?search=${encodeURIComponent(searchTerm)}`)
  }

  const Dashboard = () => {
    const totalMateriais = materiais.length
    const materiaisAtivos = materiais.filter(m => m.status === 'Ativo').length
    const totalResponsaveis = [...new Set(materiais.map(m => m.responsavel))].length
    
    const plataformas = {}
    materiais.forEach(m => {
      plataformas[m.plataforma] = (plataformas[m.plataforma] || 0) + 1
    })
    const plataformaPrincipal = Object.keys(plataformas).reduce((a, b) => 
      plataformas[a] > plataformas[b] ? a : b, 'N/A'
    )
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div 
            onClick={() => router.push('/registros')}
            className="bg-white rounded-lg shadow-md p-6 h-32 cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Materiais</p>
                <p className="text-2xl font-bold text-gray-900">{totalMateriais}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setRelatorioAtivo('status')}
            className="bg-white rounded-lg shadow-md p-6 h-32 cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Materiais Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{materiaisAtivos}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setRelatorioAtivo('responsavel')}
            className="bg-white rounded-lg shadow-md p-6 h-32 cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Responsáveis</p>
                <p className="text-2xl font-bold text-gray-900">{totalResponsaveis}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setRelatorioAtivo('plataforma')}
            className="bg-white rounded-lg shadow-md p-6 h-32 cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plataforma Principal</p>
                <p className="text-lg font-bold text-gray-900">{plataformaPrincipal}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  
  const calcularDadosRelatorio = (tipo) => {
    if (!materiais.length) return []
    
    if (tipo === 'status') {
      const statusCount = {}
      materiais.forEach(material => {
        statusCount[material.status] = (statusCount[material.status] || 0) + 1
      })
      
      return Object.entries(statusCount).map(([status, quantidade]) => ({
        status,
        quantidade,
        percentual: Math.round((quantidade / materiais.length) * 100)
      })).sort((a, b) => b.quantidade - a.quantidade)
    }
    
    if (tipo === 'responsavel') {
      const responsavelCount = {}
      materiais.forEach(material => {
        responsavelCount[material.responsavel] = (responsavelCount[material.responsavel] || 0) + 1
      })
      return Object.entries(responsavelCount).map(([responsavel, quantidade]) => ({
        responsavel,
        quantidade,
        percentual: Math.round((quantidade / materiais.length) * 100)
      })).sort((a, b) => b.quantidade - a.quantidade)
    }
    
    if (tipo === 'plataforma') {
      const plataformaCount = {}
      materiais.forEach(material => {
        plataformaCount[material.plataforma] = (plataformaCount[material.plataforma] || 0) + 1
      })
      return Object.entries(plataformaCount).map(([plataforma, quantidade]) => ({
        plataforma,
        quantidade,
        percentual: Math.round((quantidade / materiais.length) * 100)
      })).sort((a, b) => b.quantidade - a.quantidade)
    }
    
    return []
  }

  const MobileWarning = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-purple-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Relatórios - Desktop</h2>
          <p className="text-gray-600 leading-relaxed">
            Esta página só pode ser acessada via computador.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Voltar para Página Inicial
        </button>
      </div>
    </div>
  )



  const RelatorioStatus = () => {
    const dados = calcularDadosRelatorio('status')
    
    const getStatusIcon = (status) => {
      switch (status) {
        case 'Ativo':
          return (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        case 'Planejado':
          return (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        case 'Em revisão':
          return (
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )
        default:
          return (
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
      }
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Materiais por Status</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {dados.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <span className="font-medium">{item.status}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold">{item.quantidade}</div>
                    <div className="text-sm text-gray-500">{item.percentual}%</div>
                  </div>
                  <button
                    onClick={() => handleRedirectToMateriais(item.status)}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const RelatorioResponsavel = () => {
    const dados = calcularDadosRelatorio('responsavel')
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Produtividade por Responsável</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {dados.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{item.responsavel}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold">{item.quantidade}</div>
                    <div className="text-sm text-gray-500">{item.percentual}%</div>
                  </div>
                  <button
                    onClick={() => handleRedirectToMateriais(item.responsavel)}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const RelatorioPlataforma = () => {
    const dados = calcularDadosRelatorio('plataforma')
    
    const getPlataformaIcon = (plataforma) => {
      switch (plataforma) {
        case 'YouTube':
          return <Image src="/icons/youtube-color-icon.svg" alt="YouTube" width={20} height={20} />
        case 'Vimeo':
          return <Image src="/icons/vimeo-color-icon.svg" alt="Vimeo" width={20} height={20} />
        case 'Teams':
          return <Image src="/icons/teams-icon.svg" alt="Teams" width={20} height={20} />
        case 'Zoom':
          return <Image src="/icons/zoom-icon.svg" alt="Zoom" width={20} height={20} />
        default:
          return <Image src="/icons/globe-icon.svg" alt="Outras" width={20} height={20} />
      }
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição por Plataforma</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {dados.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getPlataformaIcon(item.plataforma)}
                  <span className="font-medium">{item.plataforma}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold">{item.quantidade}</div>
                    <div className="text-sm text-gray-500">{item.percentual}%</div>
                  </div>
                  <button
                    onClick={() => handleRedirectToMateriais(item.plataforma)}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mostrar aviso em dispositivos móveis */}
      <div className="block lg:hidden">
        <MobileWarning />
      </div>
      
      {/* Mostrar conteúdo normal em desktop */}
      <div className="hidden lg:block">
        <div className="min-h-screen">
          <main className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Cabeçalho */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
                <p className="text-gray-600">Análise e insights dos materiais educacionais</p>
              </div>

              {/* Menu de Navegação */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setRelatorioAtivo('dashboard')}
                  className={`px-4 py-2 font-medium ${
                    relatorioAtivo === 'dashboard'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setRelatorioAtivo('status')}
                  className={`px-4 py-2 font-medium ${
                    relatorioAtivo === 'status'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Por Status
                </button>
                <button
                  onClick={() => setRelatorioAtivo('responsavel')}
                  className={`px-4 py-2 font-medium ${
                    relatorioAtivo === 'responsavel'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Por Responsável
                </button>
                <button
                  onClick={() => setRelatorioAtivo('plataforma')}
                  className={`px-4 py-2 font-medium ${
                    relatorioAtivo === 'plataforma'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Por Plataforma
                </button>
              </div>

              {/* Conteúdo do Relatório */}
              <div>
                {relatorioAtivo === 'dashboard' && <Dashboard />}
                {relatorioAtivo === 'status' && <RelatorioStatus />}
                {relatorioAtivo === 'responsavel' && <RelatorioResponsavel />}
                {relatorioAtivo === 'plataforma' && <RelatorioPlataforma />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
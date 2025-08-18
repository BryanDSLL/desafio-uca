"use client"
import Link from "next/link"
import BotaoHeader from "./btnHeader"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const [usuario, setUsuario] = useState('')

    const carregarUsuario = () => {
        try {
            const userData = localStorage.getItem('userData')
            console.log('userData do localStorage:', userData)
            
            if (userData) {
                const user = JSON.parse(userData)
                console.log('Dados do usuário parseados:', user)
                
                // Extrair apenas o primeiro nome
                const nomeCompleto = user.nome || 'Usuário'
                console.log('Nome completo:', nomeCompleto)
                
                const primeiroNome = nomeCompleto.split(' ')[0]
                console.log('Primeiro nome:', primeiroNome)
                
                setUsuario(primeiroNome)
            } else {
                console.log('Nenhum userData encontrado no localStorage')
                setUsuario('Usuário')
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error)
            setUsuario('Usuário')
        }
    }

    useEffect(() => {
        // Carregar usuário inicial
        carregarUsuario()
        
        // Listener para mudanças no localStorage (entre abas)
        const handleStorageChange = (e) => {
            if (e.key === 'userData') {
                console.log('Detectada mudança no userData')
                carregarUsuario()
            }
        }
        
        // Listener para evento customizado de login
        const handleUserLogin = () => {
            console.log('Evento de login detectado')
            carregarUsuario()
        }
        
        // Adicionar listeners
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('userLoggedIn', handleUserLogin)
        
        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('userLoggedIn', handleUserLogin)
        }
    }, [])

    const handleLogout = () => {
        // Limpar dados de autenticação
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
        // Redirecionar para login
        router.push('/')
    }

    // Não renderizar header na página de login
    if (pathname === '/') {
        return null;
    }
    if (pathname === '/signup') {
        return null;
    }

    const botoesHeader = [
        {
            desc: "Material",
            href: "/registros",
            src: "https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/chart-bar.svg"
        },
        {
            desc: "Responsável",
            href: "/cadastros/pessoa",
            src: "https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/user-plus.svg"
        },
        {
            desc: "Relatórios",
            href: "/relatorios",
            src: "https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/document-chart-bar.svg"
        }
    ]   

    return (
    <>
        
    <div className="bg-white flex flex-col lg:flex-row justify-between items-center w-full shadow-md px-4 py-2 lg:py-0 lg:h-15">
        <div className="flex flex-row items-center w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center mr-4 lg:mr-8">
                <Link href="/home">
                    <Image
                        src="/logo-uca.png" 
                        alt="logoUca" 
                        width={120} 
                        height={40}
                        className="lg:w-[150px] lg:h-[45px]" 
                        style={{
                            width: 'auto',
                            height: 'auto'
                        }}
                    />
                </Link>
            </div> 

            <div className="hidden md:flex flex-row space-x-1">
                {botoesHeader.map((botao, i) => (
                    <BotaoHeader 
                        key={i}
                        src={botao.src} 
                        desc={botao.desc} 
                        href={botao.href}
                        isActive={pathname === botao.href}
                    />
                ))}
            </div>
        </div>

        {/* Seção direita com informações do usuário e botão de sair */}
        <div className="flex items-center space-x-4 mt-2 lg:mt-0">
            <div className="flex items-center space-x-2">
                <Image 
                    src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/user.svg" 
                    alt="Usuário" 
                    width={24} 
                    height={24}
                    className="text-gray-600"
                />
                <span className="text-gray-700 font-medium">
                    Olá, {usuario}
                </span>
            </div>
            
            <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                title="Sair"
            >
                <Image 
                    src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/arrow-right-on-rectangle.svg" 
                    alt="Sair" 
                    width={16} 
                    height={16}
                    className="text-gray-600"
                />
                <span className="hidden sm:inline text-sm">Sair</span>
            </button>
        </div>

    </div>
    
    </>
    )

}

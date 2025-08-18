'use client'

import { useEffect, useState } from 'react'

const AvisoAutenticacao = ({ onLogin, onHome }) => {
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    onLogin()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [onLogin])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <svg className="w-16 h-16 text-purple-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Você precisa estar logado para acessar esta página.
                    </p>
                    <p className="text-sm text-gray-500">
                        Redirecionando para login em <span className="font-semibold text-purple-600">{countdown}</span> segundos...
                    </p>
                </div>
                <div className="space-y-3">
                    <button 
                        onClick={onLogin}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        Fazer Login Agora
                    </button>
                    <button 
                        onClick={onHome}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Voltar para Página Inicial
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AvisoAutenticacao
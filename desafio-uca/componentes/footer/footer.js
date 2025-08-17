import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-purple-700 text-white py-3 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Logo e informações principais */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                    <div className="flex flex-col items-start mb-2 md:mb-0">
                        <Image
                            src="/logo-uca-nobg.png" 
                            alt="logoUca" 
                            width={200} 
                            height={60}
                            className="mb-1 brightness-0 invert" 
                            style={{
                                width: 'auto',
                                height: 'auto'
                            }}
                        />
                        <div className="text-xs space-y-0.5">
                            <p>Contato</p>
                            <p className="text-xs opacity-90">
                                ©2025 - 2025 - Alterdata Software - Direitos Reservados Alterdata Tecnologia em Informática Ltda — CNPJ: 36.462.778/0001-60
                            </p>
                            <p className="text-xs opacity-90">
                                Endereço: Rua Prefeito Sebastião Teixeira, 227 Teresópolis, RJ - 25953-200
                            </p>
                        </div>
                    </div>
                    
                    {/* Redes sociais */}
                    <div className="flex space-x-3">
                        <Link href="https://www.facebook.com/uca.cursos/" target="_blank" className="w-8 h-8 rounded flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all duration-200 group">
                             <svg className="w-4 h-4 fill-white group-hover:fill-purple-700 transition-all duration-200" viewBox="0 0 24 24">
                                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                             </svg>
                         </Link>
                        <Link href="https://www.instagram.com/uca.cursos/" target="_blank" className="w-8 h-8 rounded flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all duration-200 group">
                             <svg className="w-4 h-4 fill-white group-hover:fill-purple-700 transition-all duration-200" viewBox="0 0 24 24">
                                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                             </svg>
                        </Link>
                        <Link href="https://www.youtube.com/@AlterdataTV" target="_blank" className="w-8 h-8 rounded flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all duration-200 group">
                             <svg className="w-4 h-4 fill-white group-hover:fill-purple-700 transition-all duration-200" viewBox="0 0 24 24">
                                 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                             </svg>
                        </Link>
                        <Link href="https://www.linkedin.com/company/universidade-corporativa-alterdata" target="_blank" className="w-8 h-8 rounded flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all duration-200 group">
                             <svg className="w-4 h-4 fill-white group-hover:fill-purple-700 transition-all duration-200" viewBox="0 0 24 24">
                                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                             </svg>
                        </Link>
                        <Link href="https://www.alterdata.com.br" target="_blank" className="w-8 h-8 rounded flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all duration-200 group">
                             <svg className="w-4 h-4 fill-white group-hover:fill-purple-700 transition-all duration-200" viewBox="0 0 24 24">
                                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                             </svg>
                        </Link>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="text-center text-xs opacity-75 pt-2 border-t border-white border-opacity-20">
                    © 2025 Universidade Corporativa Alterdata
                </div>
            </div>
        </footer>
    )
}
"use client"
import Link from "next/link"
import BotaoHeader from "./btnHeader"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
    const pathname = usePathname()

    // Não renderizar header na página de login
    if (pathname === '/') {
        return null;
    }
    if (pathname === '/signin') {
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


    </div>
    
    </>
    )

}

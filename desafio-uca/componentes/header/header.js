import Link from "next/link"
import BotaoHeader from "./btnHeader"
import Image from "next/image"

export default function sidebar() {

    const botoesHeader = [
        {
            desc: "Registros",
            href: "/registros",
            src: "https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/chart-bar.svg"
        },
        {
            desc: "Relatórios",
            href: "/relatorios",
            src: "https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/document-chart-bar.svg"
        },
        {
            desc: "Cadastros",
            href: "/cadastros",
            src: "https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/user-plus.svg",
            temSeta: true
        }
    ]   

    return (
    <>
        
    <div className="bg-white flex flex-col lg:flex-row justify-between items-center w-full shadow-md px-4 py-2 lg:py-0 lg:h-15">
        <div className="flex flex-row items-center w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center mr-4 lg:mr-8">
                <Link href="/">
                    <Image
                        src="/logo-uca.png" 
                        alt="logoUca" 
                        width={120} 
                        height={40}
                        className="lg:w-[150px] lg:h-[45px]" 
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
                        temSeta={botao.temSeta}
                    />
                ))}
            </div>
        </div>


    </div>
    
    </>
    )

}

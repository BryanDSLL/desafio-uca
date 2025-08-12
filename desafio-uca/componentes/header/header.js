import Link from "next/link"
import BotaoHeader from "./btnHeader"
import Image from "next/image"

export default function sidebar() {

    const botoesHeader = [
        {
            desc: "Dashboard",
            href: "/dashboard",
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
        
    <div className="bg-white flex flex-row justify-between items-center w-full h-15 shadow-md px-4">
        <div className="flex flex-row">
            <div className="flex items-center mr-8">
                <Link href="/">
                    <Image
                        src="/logo-uca.png" 
                        alt="logoUca" 
                        width={150} 
                        height={50}
                        className="" 
                    />
                </Link>
            </div> 

            <div className="flex flex-row space-x-1">
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

        <div className="flex mr-5 rounded-4xl overflow-hidden hover:bg-purple-400 h-8 w-8 justify-center items-center group">
            <Image 
                src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/magnifying-glass.svg" 
                alt="Buscar"
                width={24}
                height={24}
                className="cursor-pointer group-hover:brightness-0 group-hover:invert"
            />
        </div>    

    </div>
    
    </>
    )

}

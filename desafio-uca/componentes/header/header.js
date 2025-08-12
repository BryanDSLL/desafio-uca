import Link from "next/link"
import BotaoHeader from "./btnHeader"
import Image from "next/image"

export default function sidebar() {

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
                <BotaoHeader src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/chart-bar.svg" desc="Dashboard" href="/dashboard" />
                <BotaoHeader src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/document-chart-bar.svg" desc="Relatórios" href="/relatorios" />
                <BotaoHeader src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/user-plus.svg" desc="Cadastros" href="/cadastros" />
            </div>
        </div>

        <div className="mr-5">
            <Image 
                src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/magnifying-glass.svg" 
                alt="Buscar"
                width={24}
                height={24}
                className="cursor-pointer hover:opacity-70"
            />
        </div>    

    </div>
    
    </>
    )

}

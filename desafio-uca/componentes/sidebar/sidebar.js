import BotaoSide from "./btnSidebar"
import Image from "next/image"

export default function sidebar() {

    return (
    <>
        
    <div className="bg-white flex flex-col min-h-[100vh] w-[14vw]">
        <div className="shadow-md rounded-md w-[99%] mb-2">
            <Image
                src="/logo-uca.png" 
                alt="logoUca" 
                width={120} 
                height={50}
                className="mx-auto m-3" 
            />
        </div> 

        <BotaoSide src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/chart-bar.svg" desc="Dashboard" href="/dashboard" />
        <BotaoSide src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/document-chart-bar.svg" desc="Relatórios" href="/relatorios" />
        <BotaoSide src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/user-plus.svg" desc="Cadastros" href="/cadastros" />


    </div>
    
    </>
    )

}
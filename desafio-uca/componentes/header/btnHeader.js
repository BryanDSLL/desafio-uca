"use client"
import Image from "next/image"
import Link from "next/link"

export default function BotaoHeader(props) {
    const isActive = props?.isActive || false
    
    return(
        <Link href={props?.href || '/'} className="relative">
            <div 
                className={`flex flex-row items-center h-14 px-3 transition-all duration-200 ${
                    isActive 
                        ? 'text-white bg-purple-600' 
                        : 'text-black hover:text-white hover:bg-purple-600 active:bg-purple-800 active:scale-95'
                } hover:cursor-pointer group`}
                onClick={props?.onClick}
            >
                <Image 
                    src={props?.src || '/globe.svg'} 
                    alt="botaoHeader" 
                    width={20} 
                    height={20}
                    className={`mr-2 ${
                        isActive 
                            ? 'brightness-0 invert' 
                            : 'group-hover:brightness-0 group-hover:invert'
                    }`}
                />
                <span className="cursor-pointer whitespace-nowrap">
                    {props?.desc || 'Sem descrição'}
                </span>
            </div>
        </Link>
    )
}
import Image from "next/image"
import Link from "next/link"

export default function btnSidebar(props) {
    return(
        <div className="flex flex-row items-center h-14 px-3 text-black hover:text-white hover:bg-purple-500 hover:cursor-pointer group transition-all duration-200">
            <Image 
                src={props?.src || '/globe.svg'} 
                alt="btnSidebar" 
                width={20} 
                height={20}
                className="mr-2 group-hover:brightness-0 group-hover:invert"
            />
            <Link href={props?.href || '/'} className="cursor-pointer whitespace-nowrap">
                {props?.desc || 'Sem descrição'}
            </Link>
            {props?.temSeta && (
                <Image 
                    src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/chevron-down.svg"
                    alt="seta"
                    width={16}
                    height={16}
                    className="ml-2 group-hover:brightness-0 group-hover:invert"
                />
            )}
        </div>
    )
}
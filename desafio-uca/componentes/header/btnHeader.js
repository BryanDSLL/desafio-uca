import Image from "next/image"
import Link from "next/link"

export default function btnSidebar(props) {
    return(
        <div className="flex flex-row items-center h-14 w-30 text-black hover:text-white hover:bg-purple-700 hover:cursor-pointer group transition-all duration-200">
            <Image 
                src={props?.src || '/globe.svg'} 
                alt="btnSidebar" 
                width={20} 
                height={20}
                className="mx-2 group-hover:brightness-0 group-hover:invert"
            />
            <Link href={props?.href || '/'} className="cursor-pointer">
                {props?.desc || 'Sem descrição'}
            </Link>
        </div>
    )
}
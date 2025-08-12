import Image from "next/image"
import Link from "next/link"

export default function btnSidebar(props) {
    return(
        <div className="flex flex-row rounded-xl h-[95%] hover:text-white hover:bg-purple-700 hover:cursor-pointer ml-2 mr-2 group transition-all duration-200">
            <Image 
                src={props?.src || '/globe.svg'} 
                alt="btnSidebar" 
                width={20} 
                height={20}
                className="m-3 group-hover:brightness-0 group-hover:invert"
            />
            <Link href={props?.href || '/'} className="cursor-pointer content-center">
                {props?.desc || 'Sem descrição'}
            </Link>
        </div>
    )
}
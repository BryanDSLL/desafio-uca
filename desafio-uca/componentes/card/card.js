import Image from "next/image"
import Imgteste from "../../public/uca-teste.webp"

export default function Card (props) {

    return (

        <div className="h-60 w-75 m-5 shadow-lg rounded-xl hover:scale-110 cursor-pointer">
            <div className="bg-[#F8F8F8] rounded-xl h-[75%] w-full overflow-hidden">
                <Image  src={props?.src || Imgteste}
                        alt="iconeCard"
                        width="100%"
                        height="100%"
                        className="" 
                />

            </div>

            <div className="flex flex-col justify-end">
                <h3 className="mx-1">{props?.titulo || "Treinamento teste"}</h3>
                <p className="mx-1 text-sm">{props?.desc || "Treinamento realizado para teste"}</p>
            </div>
        </div>

    )
}
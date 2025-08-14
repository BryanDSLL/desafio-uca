import Image from "next/image"
import Imgteste from "../../public/uca-card.webp"

export default function Card (props) {
    
    const getPlatformIcon = (plataforma) => {
        switch (plataforma) {
            case 'YouTube':
                return <Image src="/icons/youtube-color-icon.svg" alt="YouTube" width={16} height={16} />;
            case 'Vimeo':
                return <Image src="/icons/vimeo-color-icon.svg" alt="Vimeo" width={16} height={16} />;
            default:
                return <Image src="/icons/outros-icon.svg" alt="Outros" width={16} height={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Ativo':
                return 'bg-green-100 text-green-800';
            case 'Em revisão':
                return 'bg-blue-100 text-blue-800';
            case 'Planejado':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full max-w-sm shadow-lg rounded-xl hover:shadow-xl hover:scale-[1.04] transition-all duration-300 cursor-pointer bg-white border border-gray-100 overflow-hidden flex flex-col">
            {/* Imagem com overlay de status */}
            <div className="relative bg-gradient-to-br from-purple-50 to-gray-50 rounded-t-xl h-48 w-full overflow-hidden flex-shrink-0">
                <Image  
                    src={props?.src || Imgteste}
                    alt={props?.titulo || "Treinamento"}
                    width={300}
                    height={200}
                    priority={true}
                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" 
                />
                
                {/* Status badge */}
                {props?.status && (
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(props.status)} backdrop-blur-sm`}>
                            {props.status}
                        </span>
                    </div>
                )}
                
                {/* Plataforma badge */}
                {props?.plataforma && (
                    <div className="absolute top-3 left-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                            <span className="text-sm">{getPlatformIcon(props.plataforma)}</span>
                            <span className="text-xs font-medium text-gray-700">{props.plataforma}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Conteúdo do card */}
            <div className="bg-white rounded-b-xl p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 mb-2 text-base leading-tight">
                        {props?.titulo || "Treinamento teste"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {props?.desc || "Treinamento realizado para teste"}
                    </p>
                </div>
                
                {/* Informações adicionais */}
                <div className="space-y-2 mt-auto">
                    {/* Responsável e Duração */}
                    <div className="flex justify-between items-end text-xs">
                        {props?.responsavel && (
                            <div className="flex items-center gap-1">
                                <Image src="/icons/user-icon.svg" alt="Responsável" width={12} height={12} className="text-gray-500" />
                                <span className="text-gray-700 font-medium truncate">{props.responsavel}</span>
                            </div>
                        )}
                        {props?.duracao && (
                            <div className="flex items-center gap-1">
                                <Image src="/icons/clock-icon.svg" alt="Duração" width={12} height={12} className="text-purple-600" />
                                <span className="text-purple-600 font-bold text-sm">{props.duracao}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Data */}
                    {props?.data && (
                        <div className="flex items-center gap-1 text-xs">
                            <Image src="/icons/calendar-icon.svg" alt="Data" width={12} height={12} className="text-gray-500" />
                            <span className="text-gray-600">
                                {new Date(props.data).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
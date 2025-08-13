"use client"
import Image from "next/image"

export default function campoPesquisa({ placeholder = "Pesquisar...", onSearch, className = "" }) {
    const handleInputChange = (e) => {
        if (onSearch) {
            onSearch(e.target.value)
        }
    }

    return (
        <div className={`relative ${className}`}>
            <input 
                type="text" 
                placeholder={placeholder}
                onChange={handleInputChange}
                className="w-full h-10 pl-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent relative z-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20">
                <Image 
                    src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/magnifying-glass.svg" 
                    alt="Buscar"
                    width={20}
                    height={20}
                    className="text-gray-400 hover:scale-110 hover:cursor-pointer hover:opacity-80"
                />
            </div>
        </div>
    )
}
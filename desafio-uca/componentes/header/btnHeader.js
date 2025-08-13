"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export default function BotaoHeader(props) {

    const [dropdownAberto, setDropdownAberto] = useState(false)
    const dropdownRef = useRef(null)
    const alternarDropdown = () => {
        if (props?.temSeta) {
            setDropdownAberto(!dropdownAberto)
        }
    }

    useEffect(() => {
        const lidarComCliqueFora = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownAberto(false)
            }
        }
        document.addEventListener('mousedown', lidarComCliqueFora)
        return () => {
            document.removeEventListener('mousedown', lidarComCliqueFora)
        }
    }, [])

    return(
        <div className="relative" ref={dropdownRef}>
            <div 
                className="flex flex-row items-center h-14 px-3 text-black hover:text-white hover:bg-purple-500 hover:cursor-pointer group transition-all duration-200"
                onClick={alternarDropdown}
            >
                <Image 
                    src={props?.src || '/globe.svg'} 
                    alt="botaoHeader" 
                    width={20} 
                    height={20}
                    className="mr-2 group-hover:brightness-0 group-hover:invert"
                />

                {props?.temSeta ? (
                    <span className="cursor-pointer whitespace-nowrap">
                        {props?.desc || 'Sem descrição'}
                    </span>
                ) : (
                    <Link href={props?.href || '/'} className="cursor-pointer whitespace-nowrap">
                        {props?.desc || 'Sem descrição'}
                    </Link>
                )}
                {props?.temSeta && (
                    <Image 
                        src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/chevron-down.svg"
                        alt="seta"
                        width={16}
                        height={16}
                        className={`ml-2 group-hover:brightness-0 group-hover:invert transition-transform duration-200 ${dropdownAberto ? 'rotate-180' : ''}`}
                    />
                )}
            </div>
            
            {/* Menu Dropdown */}
            {props?.temSeta && dropdownAberto && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md border border-gray-200 min-w-48 z-50">
                    <Link href="/cadastros/pessoa" className="block px-4 py-3 text-gray-700 hover:text-white hover:bg-purple-500 transition-colors duration-200">
                        Pessoa
                    </Link>
                    <Link href="/cadastros/material" className="block px-4 py-3 text-gray-700 hover:text-white hover:bg-purple-500 transition-colors duration-200">
                        Material
                    </Link>
                </div>
            )}
        </div>
    )
}
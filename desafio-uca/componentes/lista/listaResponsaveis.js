"use client"
import Image from "next/image"

export default function ListaResponsaveis({ pessoas, onEditar, onExcluir }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabeçalho da tabela */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
          <div className="col-span-3">Nome</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Cargo</div>
          <div className="col-span-3">Departamento</div>
          <div className="col-span-1">Ações</div>
        </div>
      </div>

      {/* Linhas de dados */}
      <div className="divide-y divide-gray-200">
        {pessoas.map((pessoa, i) => (
          <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Nome */}
              <div className="col-span-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{pessoa.nome}</h3>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="col-span-3">
                <span className="text-sm text-gray-700">{pessoa.email}</span>
              </div>

              {/* Cargo */}
              <div className="col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {pessoa.cargo}
                </span>
              </div>

              {/* Departamento */}
              <div className="col-span-3">
                <span className="text-sm text-gray-700">{pessoa.departamento}</span>
              </div>

              {/* Ações */}
              <div className="col-span-1">
                <div className="flex space-x-1">
                  <button 
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-100 hover:cursor-pointer rounded-lg transition-colors duration-200"
                    onClick={() => onEditar(pessoa)}
                    title="Editar responsável"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 hover:cursor-pointer rounded-lg transition-colors duration-200"
                    onClick={() => onExcluir(pessoa)}
                    title="Excluir responsável"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
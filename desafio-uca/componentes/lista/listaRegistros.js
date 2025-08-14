"use client"

export default function ListaRegistros({ registros, onEditar }) {
  const getStatusColor = (status) => {
    const colors = {
        'Ativo': 'bg-green-100 text-green-800',
        'Inativo': 'bg-red-100 text-red-800', 
        'Em revisão': 'bg-yellow-100 text-yellow-800',
        'Planejado': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      'Web': '🌐',
      'Mobile': '📱',
      'Desktop': '💻',
      'API': '🔗'
    }
    return icons[platform] || '📄'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabeçalho da tabela */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
          <div className="col-span-2">Título</div>
          <div className="col-span-2">Plataforma</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Responsável</div>
          <div className="col-span-1">Duração</div>
          <div className="col-span-2">Data</div>
          <div className="col-span-1">Ações</div>
        </div>
      </div>

      {/* Linhas de dados */}
      <div className="divide-y divide-gray-200">
        {registros.map((registro, i) => (
          <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Título */}
              <div className="col-span-2">
                <h3 className="text-sm text-gray-900">{registro.titulo}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 mt-1">{registro.descricao}</p>
              </div>

              {/* Plataforma */}
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getPlatformIcon(registro.plataforma)}</span>
                  <span className="text-sm text-gray-700">{registro.plataforma}</span>
                </div>
              </div>

              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registro.status)}`}>
                  {registro.status}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-sm text-gray-700">{registro.responsavel}</span>
              </div>

              <div className="col-span-1">
                <span className="text-sm text-gray-700">{registro.duracao}</span>
              </div>

              <div className="col-span-2">
                <span className="text-sm text-gray-700">{registro.data}</span>
              </div>

              <div className="col-span-1">
                <button 
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-100 hover:cursor-pointer rounded-lg transition-colors duration-200"
                  onClick={() => onEditar(registro)}
                  title="Editar registro"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
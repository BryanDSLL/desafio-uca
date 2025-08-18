'use client'
import Card from "../../../componentes/card/card";
import { useState, useEffect } from "react";
import { checkAuth, redirectToLogin } from "../../middleware/auth";

export default function Home() {
  const [ultimasAdicoes, setUltimasAdicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const user = checkAuth();
    if (!user) {
      redirectToLogin();
      return;
    }

    const fetchMateriais = async() => {
      try {
        const response = await fetch('/api/materiais');
        const data = await response.json();

        if (data.success) {
          setUltimasAdicoes(data.materiais.slice(0, 6));
        } else {
          setError('Erro ao carregar materiais');
        }
      } catch (err) {
        setError('Erro de conexão');
        console.error('Erro: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriais();
  }, []);

if (loading) {
    return (
      <div className="flex flex-col items-center px-4">
        <h1 className="w-full text-center text-2xl md:text-3xl mb-5 px-2">
          Seja bem vindo ao sistema de controle e relatórios de mídias digitais da UCA
        </h1>
        <div className="bg-white flex flex-col justify-center items-center rounded-xl shadow-lg w-full max-w-7xl min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Carregando materiais...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center px-4">
        <h1 className="w-full text-center text-2xl md:text-3xl mb-5 px-2">
          Seja bem vindo ao sistema de controle e relatórios de mídias digitais da UCA
        </h1>
        <div className="bg-white flex flex-col justify-center items-center rounded-xl shadow-lg w-full max-w-7xl min-h-[50vh]">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="w-full text-center text-2xl md:text-3xl mb-5 px-2">
          Seja bem vindo ao sistema de controle e relatórios de mídias digitais da UCA
      </h1>

      <div className="bg-white flex flex-col justify-start rounded-xl shadow-lg w-full max-w-7xl min-h-[50vh]">
        <h2 className="w-full text-center text-xl md:text-2xl p-4">
          Últimas adições
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 justify-items-center">
          {ultimasAdicoes.map((item, index) => (
            <Card 
              key={index}
              titulo={item.titulo}
              desc={item.desc}
              responsavel={item.responsavel}
              duracao={item.duracao}
              data={item.data}
              status={item.status}
              plataforma={item.plataforma}
              src={item.imagem_capa}
              link={item.url_material || `https://portal.uca.com/material/${item.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
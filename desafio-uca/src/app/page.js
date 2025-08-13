import Card from "../../componentes/card/card";

export default function Home() {
  // Dados de exemplo para os cards da home
  const ultimasAdicoes = [
    {
      titulo: "Treinamento React Avançado",
      desc: "Aprenda conceitos avançados do React incluindo hooks customizados, context API e otimização de performance.",
      responsavel: "João Silva",
      duracao: "8h 30min",
      data: "2024-01-15",
      status: "Ativo",
      plataforma: "YouTube"
    },
    {
      titulo: "Workshop UX/UI Design",
      desc: "Workshop prático sobre design de interfaces modernas e experiência do usuário.",
      responsavel: "Maria Santos",
      duracao: "4h 15min",
      data: "2024-01-20",
      status: "Em revisão",
      plataforma: "Vimeo"
    },
    {
      titulo: "Curso Next.js Completo",
      desc: "Curso completo de Next.js do básico ao avançado com projetos práticos.",
      responsavel: "Pedro Costa",
      duracao: "12h 45min",
      data: "2024-01-25",
      status: "Planejado",
      plataforma: "YouTube"
    },
    {
      titulo: "Palestra Inovação Digital",
      desc: "Palestra sobre as últimas tendências em transformação digital e inovação.",
      responsavel: "Ana Oliveira",
      duracao: "2h 00min",
      data: "2024-02-01",
      status: "Ativo",
      plataforma: "Teams"
    },
    {
      titulo: "Treinamento SQL Avançado",
      desc: "Domine consultas complexas, otimização e administração de banco de dados.",
      responsavel: "Carlos Ferreira",
      duracao: "6h 20min",
      data: "2024-02-05",
      status: "Em revisão",
      plataforma: "Zoom"
    },
    {
      titulo: "Workshop Metodologias Ágeis",
      desc: "Aprenda Scrum, Kanban e outras metodologias ágeis para gestão de projetos.",
      responsavel: "Lucia Mendes",
      duracao: "3h 45min",
      data: "2024-02-10",
      status: "Planejado",
      plataforma: "YouTube"
    }
  ];

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="w-full text-center text-2xl md:text-3xl mb-5 px-2">
          Seja bem vindo ao sistema de controle e relatórios de mídias digitais da UCA
      </h1>

      <div className="bg-white flex flex-col justify-start rounded-xl shadow-lg w-full max-w-7xl min-h-[50vh]">
        <h2 className="w-full text-center text-xl md:text-2xl p-4">
          Últimas adições
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 justify-items-center">
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

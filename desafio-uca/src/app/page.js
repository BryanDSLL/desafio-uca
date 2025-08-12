import Card from "../../componentes/card/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="w-[100%] text-center items-center text-3xl mb-5">
          Seja bem vindo ao sistema de controle e relatórios de mídias digitais da UCA
      </h1>

      <div className="bg-white flex flex-col justify-start rounded-xl shadow-lg w-[85%] min-h-[50vh]">
        <h2 className="w-[100%] text-center text-2xl mb-5 p-4">
          Ultimas adições
        </h2>
      <div className="flex flex-row flex-wrap justify-center">
        <Card />
        <Card />
        <Card />
      </div>

      </div>

    </div>
  );
}

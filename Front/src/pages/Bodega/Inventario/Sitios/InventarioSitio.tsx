import { Link, useParams } from "react-router-dom";

import { GestionInventarios } from "@/components/organismos/Inventarios/GestionInventarios";
import { useSitios } from "@/hooks/sitios/useSitios";
import Buton from "@/components/molecules/Button";

export const InventarioSitio = () => {
  const { sitioId } = useParams();
  const idSitios = sitioId ? parseInt(sitioId) : 0;

  const { sitios, isLoading, isError } = useSitios();

  if (isLoading) return <p>Cargando sitio...</p>;
  if (isError) return <p>Error al cargar el sitio.</p>;

  const sitio = sitios?.find((s) => s.idSitio === idSitios);

  if (!sitio) return <p>Sitio no encontrado</p>;

  return (
    <div>
      <Link to={`/bodega/inventario/`}>
        <h2 className="text-lg m-4 font-semibold">
          <Buton
            className=" hover hover:text-white dark:hover:text-white"
            text="Regresar "
          />
        </h2>
      </Link>
      <h1 className="text-2xl font-bold text-center mb-4">
        Inventario del sitio {sitio.nombre}
      </h1>
      <GestionInventarios />
    </div>
  );
};

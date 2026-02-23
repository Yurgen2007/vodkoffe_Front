import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import Globaltable from "@/components/organismos/table.tsx";
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { Caracteristica } from "@/types/Caracteristica";
import Modall from "@/components/organismos/modal";
import { FormUpdate } from "@/components/organismos/Caracteristicas/FormUpdate";
import FormularioCaracteristicas from "@/components/organismos/Caracteristicas/FormRegister";
import usePermissions from "@/hooks/Usuarios/usePermissions";

export const CaracteristicasTable = () => {
  const { userHasPermission } = usePermissions();
  const { caracteristicas, isLoading, isError, error, addCaracteristica, removeCaracteristica } =
    useCaracteristica();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const navegate = useNavigate();
  const [selectedCaracteristicas, setSelectedCaracteristicas] =
    useState<Caracteristica | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedCaracteristicas(null);
  };

  const handleUnidades = () => {
    navegate("/bodega/unidades");
  }

  const handleAddCaracteristicas = async (caracteristica: Caracteristica) => {
    try {
      await addCaracteristica(caracteristica);
      handleClose();
    } catch (error) {
      console.error("Error al agregar la característica:", error);
    }
  };

  const handleEdit = (caracteristica: Caracteristica) => {
    setSelectedCaracteristicas(caracteristica);
    setIsOpenUpdate(true);
  };

  const handleDelete = async (caracteristica: Caracteristica) => {
    if (caracteristica.idCaracteristica) {
      await removeCaracteristica(caracteristica.idCaracteristica);
    }
  };

  const columns: TableColumn<Caracteristica>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (caracteristica: Caracteristica) => (
        <span>
          {caracteristica.createdAt
            ? new Date(caracteristica.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Fecha Actualización",
      render: (caracteristica: Caracteristica) => (
        <span>
          {caracteristica.updatedAt
            ? new Date(caracteristica.updatedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const CaracteristicassWithKey = caracteristicas
    ?.filter((caracteristica) => caracteristica?.idCaracteristica !== undefined)
    .map((caracteristica) => ({
      ...caracteristica,
      key: caracteristica.idCaracteristica
        ? caracteristica.idCaracteristica.toString()
        : crypto.randomUUID(),
      idCaracteristica: caracteristica.idCaracteristica || 0,
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Caracteristicas</h1>
              <div className="flex gap-2">
                <Buton text="Gestionar Unidades" onPress={handleUnidades} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>  

      <Modall
        ModalTitle="Registrar Nueva Caracteristica"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioCaracteristicas
          addData={handleAddCaracteristicas}
          id="caracteristica-form"
          onClose={handleClose}
        />
        <Buton
          className="w-full rounded-xl"
          form="caracteristica-form"
          text="Guardar"
          type="submit"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Caracteristica"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedCaracteristicas && (
          <FormUpdate
            caracteristicaId={
              selectedCaracteristicas.idCaracteristica as number
            }
            caracteristicas={CaracteristicassWithKey ?? []}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {/* Mostrar tabla solo si tiene permiso de listar (74) */}
      {userHasPermission(74) ? (
        CaracteristicassWithKey && CaracteristicassWithKey.length > 0 ? (
          <Globaltable
            columns={columns}
            data={CaracteristicassWithKey}
            extraHeaderContent={
              <div className="flex gap-2">
                {userHasPermission(73) && (
                  <Buton onPress={() => setIsOpen(true)}>Nueva característica</Buton>
                )}
              </div>
            }
            onEdit={userHasPermission(75) ? handleEdit : undefined}
            onDelete={userHasPermission(76) ? handleDelete : undefined}
            useDeleteInsteadOfChangeState={true}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay características registradas
            {userHasPermission(73) && (
              <div className="mt-4">
                <Buton onPress={() => setIsOpen(true)}>Crear primera característica</Buton>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tienes permiso para ver las características
        </div>
      )}
    </div>
  );
};

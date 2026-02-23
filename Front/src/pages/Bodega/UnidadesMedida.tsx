import { useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import Globaltable from "@/components/organismos/table.tsx";
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { FormUpdate } from "@/components/organismos/UnidadesMedida/FormUpdate";
import { UnidadMedidaCreate } from "@/schemas/UnidadMedida";
import { UnidadMedida } from "@/types/UnidadMedida";
import FormularioUnidades from "@/components/organismos/UnidadesMedida/FormRegister";
import usePermissions from "@/hooks/Usuarios/usePermissions";

export const UnidadTable = () => {
  const { userHasPermission } = usePermissions();
  const { unidades, isLoading, isError, error, addUnidad, changeState } =
    useUnidad();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<UnidadMedida | null>(null);
  const navigate = useNavigate();
  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedUnidad(null);
  };

  const handleDelete = async (idUnidad: number) => {
    await changeState(idUnidad);
  };

  const handleAddUnidad = async (unidad: UnidadMedidaCreate) => {
    try {
      await addUnidad(unidad);
      handleClose();
    } catch (error) {
      console.error("Error al agregar la unidad:", error);
    }
  };

  const handleunidad = () => {
    navigate("/bodega/unidades");
  }

  const handleEdit = (unidad: UnidadMedida) => {
    if (!unidad || !unidad.idUnidad) {
      return;
    }
    setSelectedUnidad(unidad);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<UnidadMedida>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (unidad: UnidadMedida) => (
        <span>
          {unidad.createdAt
            ? new Date(unidad.createdAt).toLocaleDateString("es-ES", {
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
      render: (unidad: UnidadMedida) => (
        <span>
          {unidad.updatedAt
            ? new Date(unidad.updatedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "Estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const UnidadsWithKey = unidades
    ?.filter((unidad) => unidad?.idUnidad !== undefined)
    .map((unidad) => ({
      ...unidad,
      key: unidad.idUnidad ? unidad.idUnidad.toString() : crypto.randomUUID(),
      idUnidad: unidad.idUnidad || 0,
      // No convertir estado a booleano, mantener como está
    })) || [];

  // Debug: ver si hay datos
  console.log('unidades:', unidades);
  console.log('UnidadsWithKey:', UnidadsWithKey);

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Unidades de Medida</h1>
              <div className="flex gap-2">
                <Buton text="Gestionar unidades" onPress={handleunidad} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nueva Unidad"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioUnidades
          addData={handleAddUnidad}
          id="unidad-form"
          onClose={handleClose}
        />
        <div>
          <Buton
            className="w-full p-2 rounded-xl"
            form="unidad-form"
            text="Guardar"
            type="submit"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Unidad"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedUnidad && (
          <FormUpdate
            id="FormUpdate"
            onclose={handleCloseUpdate}
            unidadId={selectedUnidad.idUnidad as number}
            unidades={UnidadsWithKey ?? []}
          />
        )}
      </Modall>

      {/* Mostrar tabla solo si tiene permiso de listar (18) */}
      {userHasPermission(18) ? (
        UnidadsWithKey && UnidadsWithKey.length > 0 ? (
          <Globaltable
            columns={columns}
            data={UnidadsWithKey}
            extraHeaderContent={
              <div className="flex gap-2">
                {userHasPermission(18) && (
                  <Buton onPress={() => setIsOpen(true)}>Nueva unidad</Buton>
                )}
              </div>
            }
            onDelete={userHasPermission(21) ? (unidad) => handleDelete(unidad.idUnidad) : undefined}
            onEdit={userHasPermission(20) ? handleEdit : undefined}
            useDeleteInsteadOfChangeState
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay unidades de medida registradas
            {userHasPermission(18) && (
              <div className="mt-4">
                <Buton onPress={() => setIsOpen(true)}>Crear primera unidad</Buton>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tienes permiso para ver las unidades de medida
        </div>
      )}
    </div>
  );
};

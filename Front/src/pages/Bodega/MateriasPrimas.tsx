import { useState } from "react";
import { Card, CardBody } from "@heroui/react";

import Globaltable from "@/components/organismos/table.tsx";
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormularioMateriasPrimas from "@/components/organismos/MateriasPrimas/FormRegister";
import { FormUpdate } from "@/components/organismos/MateriasPrimas/FormUpdate";
import { useMateriasPrimas, useCreateMateriaPrima, useUpdateMateriaPrima, useDeleteMateriaPrima } from "@/hooks/MateriasPrimas/useMateriaPrima";
import { MateriaPrima } from "@/types/MateriaPrima";

import usePermissions from "@/hooks/Usuarios/usePermissions";

export const MateriasPrimasPage = () => {
  const { userHasPermission } = usePermissions();
  const { data: materiasPrimas, isLoading, error } = useMateriasPrimas();
  const createMateriaPrima = useCreateMateriaPrima();
  const updateMateriaPrima = useUpdateMateriaPrima();
  const deleteMateriaPrima = useDeleteMateriaPrima();

  // Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  // Modal actualizar
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedMateriaPrima, setSelectedMateriaPrima] = useState<MateriaPrima | null>(null);
  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedMateriaPrima(null);
  };

  const handleAddMateriaPrima = async (materiaPrima: any) => {
    try {
      await createMateriaPrima.mutateAsync(materiaPrima);
      handleClose();
    } catch (err) {
      console.error("Error al agregar materia prima:", err);
    }
  };

  const handleEdit = (materiaPrima: MateriaPrimaWithKey) => {
    setSelectedMateriaPrima(materiaPrima);
    setIsOpenUpdate(true);
  };

  const handleUpdateMateriaPrima = async (id: number, data: any) => {
    try {
      await updateMateriaPrima.mutateAsync({ id, data });
      handleCloseUpdate();
    } catch (err) {
      console.error("Error al actualizar materia prima:", err);
    }
  };

  const handleDelete = async (materiaPrima: MateriaPrimaWithKey) => {
    if (confirm("¿Está seguro de eliminar esta materia prima?")) {
      await deleteMateriaPrima.mutateAsync(materiaPrima.idMateriaPrima);
    }
  };

  // Tipos para la tabla
  type MateriaPrimaWithKey = MateriaPrima & { key: string };

  const columns: TableColumn<MateriaPrimaWithKey>[] = [
    { key: "idMateriaPrima", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { 
      key: "costoUnitario", 
      label: "Costo Unitario",
      render: (mp: MateriaPrimaWithKey) => (
        <span>${Number(mp.costoUnitario || 0).toFixed(2)}</span>
      )
    },
    {
      key: "unidadMedida",
      label: "Unidad de Medida",
      render: (mp: MateriaPrimaWithKey) => (
        <span>{mp.unidadMedida?.nombre || "-"}</span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (mp: MateriaPrimaWithKey) => (
        <span className={mp.estado ? "text-green-600" : "text-red-600"}>
          {mp.estado ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  if (isLoading) return <div className="p-4">Cargando materias primas...</div>;
  if (error) return <div className="p-4">Error al cargar materias primas: {error.message}</div>;

  const materiasPrimasWithKey: MateriaPrimaWithKey[] = (materiasPrimas || [])
    .filter((mp: MateriaPrima) => mp?.idMateriaPrima !== undefined)
    .map((mp: MateriaPrima) => ({
      ...mp,
      key: mp.idMateriaPrima ? mp.idMateriaPrima.toString() : crypto.randomUUID(),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestión de Materias Primas</h1>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nueva Materia Prima"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioMateriasPrimas
          addData={handleAddMateriaPrima}
          id="materia-prima-form"
          onClose={handleClose}
        />
        <Buton
          className="w-full rounded-xl"
          form="materia-prima-form"
          text="Guardar"
          type="submit"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Materia Prima"
        isOpen={isOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedMateriaPrima && (
          <FormUpdate
            materiasPrimas={materiasPrimasWithKey ?? []}
            materiaPrimaId={selectedMateriaPrima.idMateriaPrima}
            id="materia-prima-update-form"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {/* Mostrar tabla solo si tiene permiso de listar (18) */}
      {userHasPermission(18) ? (
        materiasPrimasWithKey && materiasPrimasWithKey.length > 0 ? (
          <Globaltable
            columns={columns}
            data={materiasPrimasWithKey}
            extraHeaderContent={
              <div className="flex gap-2">
                {userHasPermission(18) && (
                  <Buton onPress={() => setIsOpen(true)}>Nueva Materia Prima</Buton>
                )}
              </div>
            }
            onEdit={userHasPermission(20) ? handleEdit : undefined}
            onDelete={userHasPermission(21) ? handleDelete : undefined}
            useDeleteInsteadOfChangeState={true}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay materias primas registradas
            {userHasPermission(18) && (
              <div className="mt-4">
                <Buton onPress={() => setIsOpen(true)}>Crear primera materia prima</Buton>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tienes permiso para ver las materias primas
        </div>
      )}
    </div>
  );
};

export default MateriasPrimasPage;

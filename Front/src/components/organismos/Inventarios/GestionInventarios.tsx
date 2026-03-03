import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  addToast,
} from "@heroui/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import Modal from "../modal";

import FormInventario from "./FormInventario";

import { useInventario } from "@/hooks/Inventarios/useInventario";
import Buton from "@/components/molecules/Button";
import { InventarioCreate } from "@/schemas/Inventario";
import usePermissions from "@/hooks/Usuarios/usePermissions";

export const GestionInventarios = () => {
  const { userHasPermission } = usePermissions();
  const {
    inventarios = [],
    addInventario,
    changeState,
    removeInventario,
    isLoading,
  } = useInventario();
  const [showModalCreate, setShowModalCreate] = useState(false);

  const handleCreate = async (data: InventarioCreate) => {
    try {
      await addInventario({
        nombre: data.nombre,
        estado: true,
      });
      setShowModalCreate(false);
      addToast({
        title: "Inventario Creado",
        description: "El inventario se ha creado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al crear el inventario:", error);
      addToast({
        title: "Error",
        description: "No se pudo crear el inventario",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  const handleChangeState = async (idInventario: number) => {
    try {
      await changeState(idInventario);
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al cambiar estado del inventario:", error);
      addToast({
        title: "Error",
        description: "No se pudo actualizar el inventario",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  const handleDelete = async (idInventario: number) => {
    try {
      await removeInventario(idInventario);
      addToast({
        title: "Inventario Eliminado",
        description: "El inventario ha sido eliminado permanentemente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al eliminar el inventario:", error);
      addToast({
        title: "Error",
        description: "No se pudo eliminar el inventario",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Cargando inventarios...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Inventarios</h2>
        {userHasPermission(27) && (
          <Buton
            color="primary"
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={() => setShowModalCreate(true)}
          >
            Nuevo Inventario
          </Buton>
        )}
      </div>

      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <Table className="w-full" aria-label="Tabla de inventarios">
              <TableHeader className="text-center">
                <TableColumn className="text-center">ID</TableColumn>
                <TableColumn className="text-center">NOMBRE</TableColumn>
                <TableColumn className="text-center">ESTADO</TableColumn>
                <TableColumn className="text-center">ACCIONES</TableColumn>
              </TableHeader>
            <TableBody>
              {inventarios.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8" colSpan={4}>
                    No hay inventarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                inventarios.map((inv) => (
                  <TableRow key={inv.idInventario}>
                    <TableCell className="text-center">{inv.idInventario}</TableCell>
                    <TableCell className="text-center">{inv.nombre}</TableCell>
                    <TableCell className="text-center">
                      <span className={inv.estado ? "text-primary" : "text-red-600"}>
                        {inv.estado ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        {userHasPermission(30) && (
                          <Button
                            color="warning"
                            size="sm"
                            startContent={<PencilIcon className="w-4 h-4" />}
                            variant="flat"
                            onPress={() => {
                              if (inv.idInventario) {
                                handleChangeState(inv.idInventario);
                              }
                            }}
                          >
                            {inv.estado ? "Desactivar" : "Activar"}
                          </Button>
                        )}
                        {userHasPermission(30) && (
                          <Button
                            color="danger"
                            size="sm"
                            startContent={<TrashIcon className="w-4 h-4" />}
                            variant="flat"
                            onPress={() => {
                              if (inv.idInventario) {
                                handleDelete(inv.idInventario);
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Modal para crear inventario */}
      <Modal
        ModalTitle="Crear Nuevo Inventario"
        isOpen={showModalCreate}
        onOpenChange={() => setShowModalCreate(false)}
      >
        <FormInventario
          id="inventario"
          onClose={() => setShowModalCreate(false)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Buton variant="bordered" onPress={() => setShowModalCreate(false)}>
            Cancelar
          </Buton>
          <Buton color="primary" form="inventario" type="submit">
            Crear Inventario
          </Buton>
        </div>
      </Modal>
    </div>
  );
};

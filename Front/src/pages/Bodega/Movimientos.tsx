import { useState } from 'react';
import { Card, CardBody, Select, SelectItem } from '@heroui/react';

import Globaltable from '@/components/organismos/table.tsx';
import { TableColumn } from '@/components/organismos/table.tsx';
import Buton from '@/components/molecules/Button';
import { useMovimientos, useCreateMovimiento, useDeleteMovimiento, useUpdateMovimiento } from '@/hooks/Movimientos/useMovimientos';
import { Movimiento, MovimientoCreate } from '@/types/Movimiento';
import Modall from '@/components/organismos/modal';
import FormularioMovimientos from '@/components/organismos/Movimientos/FormRegister';
import usePermissions from '@/hooks/Usuarios/usePermissions';

export const MovimientosPage = () => {
  const { userHasPermission } = usePermissions();
  const { data: movimientos, isLoading, error } = useMovimientos();
  const createMovimiento = useCreateMovimiento();
  const deleteMovimiento = useDeleteMovimiento();
  const updateMovimiento = useUpdateMovimiento();
  const [filterTipo, setFilterTipo] = useState<string>('todos');

  // Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  // Modal actualizar
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState<Movimiento | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedMovimiento(null);
  };

  const handleAddMovimiento = async (movimiento: MovimientoCreate) => {
    try {
      await createMovimiento.mutateAsync(movimiento);
      handleClose();
    } catch (err) {
      console.error('Error al agregar movimiento:', err);
    }
  };

  const handleEdit = (movimiento: MovimientoWithKey) => {
    setSelectedMovimiento(movimiento);
    setIsOpenUpdate(true);
  };

  const handleUpdateMovimiento = async (movimiento: MovimientoCreate) => {
    if (selectedMovimiento) {
      try {
        await updateMovimiento.mutateAsync({ id: selectedMovimiento.idMovimiento, data: movimiento });
        handleCloseUpdate();
      } catch (err) {
        console.error('Error al actualizar movimiento:', err);
      }
    }
  };

  const handleDelete = async (movimiento: MovimientoWithKey) => {
    if (confirm('¿Está seguro de eliminar este movimiento?')) {
      await deleteMovimiento.mutateAsync(movimiento.idMovimiento);
    }
  };

  // Tipos para la tabla
  type MovimientoWithKey = Movimiento & { key: string };

  const getTipoMovimientoClass = (tipo: string) => {
    switch (tipo) {
      case 'VENTA':
        return 'bg-green-100 text-green-800';
      case 'NO_VENTA':
        return 'bg-yellow-100 text-yellow-800';
      case 'INVENTARIO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'VENTA':
        return 'Venta';
      case 'NO_VENTA':
        return 'No Venta';
      case 'INVENTARIO':
        return 'Inventario';
      default:
        return tipo;
    }
  };

  const columns: TableColumn<MovimientoWithKey>[] = [
    { key: 'idMovimiento', label: 'ID' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (movimiento: MovimientoWithKey) => (
        <span className={`px-2 py-1 rounded text-sm ${getTipoMovimientoClass(movimiento.tipo)}`}>
          {getTipoLabel(movimiento.tipo)}
        </span>
      ),
    },
    { key: 'cantidadTotal', label: 'Cantidad Total' },
    {
      key: 'precioTotal',
      label: 'Total',
      render: (movimiento: MovimientoWithKey) => (
        <span className="font-semibold">${movimiento.precioTotal?.toFixed(2) || '0.00'}</span>
      ),
    },
    {
      key: 'fechaMovimiento',
      label: 'Fecha',
      render: (movimiento: MovimientoWithKey) => (
        <span>
          {new Date(movimiento.fechaMovimiento).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </span>
      ),
    },
  ];

  if (isLoading) return <div className="p-4">Cargando movimientos...</div>;
  if (error) return <div className="p-4">Error al cargar movimientos: {error.message}</div>;

  const filteredMovimientos = movimientos?.filter((movimiento: Movimiento) => {
    if (filterTipo === 'todos') return true;
    return movimiento.tipo === filterTipo;
  });

  const movimientosWithKey: MovimientoWithKey[] = filteredMovimientos
    ?.filter((movimiento: Movimiento) => movimiento?.idMovimiento !== undefined)
    .map((movimiento: Movimiento) => ({
      ...movimiento,
      key: movimiento.idMovimiento ? movimiento.idMovimiento.toString() : crypto.randomUUID(),
    })) || [];

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestión de Movimientos</h1>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nuevo Movimiento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioMovimientos
          addData={handleAddMovimiento}
          id="movimiento-form"
          onClose={handleClose}
        />
        <Buton
          className="w-full rounded-xl"
          form="movimiento-form"
          text="Guardar"
          type="submit"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Movimiento"
        isOpen={isOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedMovimiento && (
          <FormularioMovimientos
            addData={handleUpdateMovimiento}
            id="movimiento-update-form"
            onClose={handleCloseUpdate}
            initialData={{
              tipo: selectedMovimiento.tipo as 'VENTA' | 'NO_VENTA' | 'INVENTARIO',
              tipoNoVenta: selectedMovimiento.tipoNoVenta as 'DEGUSTACION' | 'ALIANZA' | 'OTRO' | undefined,
              tipoInventario: selectedMovimiento.tipoInventario as 'entrada' | 'salida' | 'ajuste' | undefined,
              cantidadVendida: selectedMovimiento.cantidadVendida,
              cantidadDegustacion: selectedMovimiento.cantidadDegustacion,
              cantidadAlianza: selectedMovimiento.cantidadAlianza,
              cantidadOtro: selectedMovimiento.cantidadOtro,
              cantidadInventario: selectedMovimiento.cantidadInventario,
              precioUnitario: selectedMovimiento.precioUnitario,
              descripcion: selectedMovimiento.descripcion,
              nombreCliente: selectedMovimiento.nombreCliente,
              fechaMovimiento: selectedMovimiento.fechaMovimiento,
              fkLote: selectedMovimiento.fkLote || 0,
              fkUnidad: selectedMovimiento.fkUnidad,
            }}
          />
        )}
        <Buton
          className="w-full rounded-xl"
          form="movimiento-update-form"
          text="Actualizar"
          type="submit"
        />
      </Modall>

      <Card className="w-full mb-4">
        <CardBody>
          <div className="flex justify-end items-center gap-4">
            <Select
              label="Filtrar por tipo"
              selectedKeys={[filterTipo]}
              onSelectionChange={(keys) => setFilterTipo(Array.from(keys)[0] as string)}
              className="w-48"
            >
              <SelectItem key="todos">Todos</SelectItem>
              <SelectItem key="VENTA">Venta</SelectItem>
              <SelectItem key="NO_VENTA">No Venta</SelectItem>
              <SelectItem key="INVENTARIO">Inventario</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Mostrar tabla solo si tiene permiso de listar (86) */}
      {userHasPermission(86) ? (
        movimientosWithKey && movimientosWithKey.length > 0 ? (
          <Globaltable
            columns={columns}
            data={movimientosWithKey}
            extraHeaderContent={
              <div className="flex gap-2">
                {userHasPermission(85) && (
                  <Buton onPress={() => setIsOpen(true)}>Nuevo Movimiento</Buton>
                )}
              </div>
            }
            onEdit={userHasPermission(87) ? handleEdit : undefined}
            onDelete={userHasPermission(88) ? handleDelete : undefined}
            useDeleteInsteadOfChangeState={true}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay movimientos registrados
            {userHasPermission(85) && (
              <div className="mt-4">
                <Buton onPress={() => setIsOpen(true)}>Crear primer movimiento</Buton>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tienes permiso para ver los movimientos
        </div>
      )}
    </div>
  );
};

export default MovimientosPage;

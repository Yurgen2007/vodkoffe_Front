import { useState } from 'react';
import { Card, CardBody, Button } from '@heroui/react';

import Globaltable from '@/components/organismos/table.tsx';
import { TableColumn } from '@/components/organismos/table.tsx';
import Buton from '@/components/molecules/Button';
import { useMovimientos, useCreateMovimiento, useDeleteMovimiento, useUpdateMovimiento } from '@/hooks/Movimientos/useMovimientos';
import { Movimiento, MovimientoCreate } from '@/types/Movimiento';
import Modall from '@/components/organismos/modal';
import FormularioMovimientos from '@/components/organismos/Movimientos/FormRegister';
import usePermissions from '@/hooks/Usuarios/usePermissions';
import { formatNumber } from '@/utils/formatNumber';

export const MovimientosPage = () => {
  const { userHasPermission } = usePermissions();
  const { data: movimientos, isLoading, error } = useMovimientos();
  const createMovimiento = useCreateMovimiento();
  const deleteMovimiento = useDeleteMovimiento();
  const updateMovimiento = useUpdateMovimiento();

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
      key: 'lote',
      label: 'Lote',
      render: (movimiento: MovimientoWithKey) => (
        <span className="text-sm">
          {movimiento.lote ? movimiento.lote.codigoLote || `Lote ${movimiento.lote.idLote}` : 'Sin lote'}
        </span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (movimiento: MovimientoWithKey) => (
        <span className={`px-2 py-1 rounded text-sm ${getTipoMovimientoClass(movimiento.tipo)}`}>
          {getTipoLabel(movimiento.tipo)}
        </span>
      ),
    },
    {
      key: 'nombreCliente',
      label: 'Cliente',
      render: (movimiento: MovimientoWithKey) => (
        <span className="text-sm">
          {movimiento.nombreCliente || '-'}
        </span>
      ),
    },
    {
      key: 'cantidadVendida',
      label: 'Cant. Vendida',
      render: (movimiento: MovimientoWithKey) => (
        <span className="font-semibold">{movimiento.cantidadVendida || 0}</span>
      ),
    },
    {
      key: 'cantidadDegustacion',
      label: 'Degustación',
      render: (movimiento: MovimientoWithKey) => (
        <span>{movimiento.cantidadDegustacion || 0}</span>
      ),
    },
    {
      key: 'cantidadAlianza',
      label: 'Alianza',
      render: (movimiento: MovimientoWithKey) => (
        <span>{movimiento.cantidadAlianza || 0}</span>
      ),
    },
    {
      key: 'precioUnitario',
      label: 'P. Unitario',
      render: (movimiento: MovimientoWithKey) => (
        <span>${formatNumber(Number(movimiento.precioUnitario || 0))}</span>
      ),
    },
    {
      key: 'precioTotal',
      label: 'Total',
      render: (movimiento: MovimientoWithKey) => (
        <span className="font-semibold">${formatNumber(Number(movimiento.precioTotal || 0))}</span>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (movimiento: MovimientoWithKey) => (
        <span className="text-sm text-gray-500 truncate max-w-[150px]" title={movimiento.descripcion}>
          {movimiento.descripcion || '-'}
        </span>
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

  // Preparar datos para la tabla (después de todos los hooks)
  const movimientosWithKey: MovimientoWithKey[] = (movimientos || [])
    .filter((movimiento: Movimiento) => movimiento?.idMovimiento !== undefined)
    .map((movimiento: Movimiento) => ({
      ...movimiento,
      key: movimiento.idMovimiento ? movimiento.idMovimiento.toString() : crypto.randomUUID(),
    }));

  // Retornos anticipados después de preparar los datos
  if (isLoading) return <div className="p-4">Cargando movimientos...</div>;
  if (error) return <div className="p-4">Error al cargar movimientos: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between gap-4 w-full">
              <h1 className="text-2xl font-bold">Gestión de Movimientos</h1>
             
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nuevo Movimiento"
        isOpen={isOpen}
            onOpenChange={() => {
          handleClose();
        }}
      >
        <FormularioMovimientos
          addData={handleAddMovimiento}
          onClose={handleClose}
          id="form-movimiento"
        />
      </Modall>

      <Modall
        ModalTitle="Actualizar Movimiento"
        isOpen={isOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedMovimiento && (
          <FormularioMovimientos
            key={`movimiento-${selectedMovimiento.idMovimiento}`}
            addData={handleUpdateMovimiento}
            onClose={handleCloseUpdate}
            id="form-movimiento-update"
            initialData={{
              tipo: selectedMovimiento.tipo as 'VENTA' | 'NO_VENTA' | 'INVENTARIO',
              cantidadVendida: selectedMovimiento.cantidadVendida,
              cantidadDegustacion: selectedMovimiento.cantidadDegustacion,
              cantidadAlianza: selectedMovimiento.cantidadAlianza,
              precioUnitario: selectedMovimiento.precioUnitario,
              descripcion: selectedMovimiento.descripcion,
              nombreCliente: selectedMovimiento.nombreCliente,
              fkLote: selectedMovimiento.fkLote || 0,
            }}
          />
        )}
      </Modall>

      {/* Tabla de movimientos */}
      <Globaltable
        columns={columns}
        data={movimientosWithKey}
        onEdit={handleEdit}
        showActions={true}
        useDeleteInsteadOfChangeState={true}
        extraHeaderContent={
          <div className="flex gap-2">
            <Buton onPress={() => setIsOpen(true)}>
              + Nuevo Movimiento
            </Buton>
          </div>
        }
      />
    </div>
  );
};

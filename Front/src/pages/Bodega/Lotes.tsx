import { useState } from 'react';
import { Card, CardBody } from '@heroui/react';

import Globaltable from '@/components/organismos/table.tsx';
import { TableColumn } from '@/components/organismos/table.tsx';
import Buton from '@/components/molecules/Button';
import { useLotes, useCreateLote, useDeleteLote, useUpdateLote } from '@/hooks/Lotes/useLotes';
import { Lote, LoteCreate } from '@/types/Lote';
import Modall from '@/components/organismos/modal';
import FormularioLotes from '@/components/organismos/Lotes/FormRegister';
import usePermissions from '@/hooks/Usuarios/usePermissions';
import { formatNumber } from '@/utils/formatNumber';

export const LotesPage = () => {
  const { userHasPermission } = usePermissions();
  const { data: lotes, isLoading, error } = useLotes();
  const createLote = useCreateLote();
  const deleteLote = useDeleteLote();
  const updateLote = useUpdateLote();

  // Modal agregar lote
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  // Modal actualizar lote
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedLote(null);
  };

  const handleAddLote = async (lote: LoteCreate) => {
    await createLote.mutateAsync(lote);
    handleClose();
  };

  const handleEdit = (lote: LoteWithKey) => {
    setSelectedLote(lote);
    setIsOpenUpdate(true);
  };

  const handleUpdateLote = async (lote: LoteCreate) => {
    if (selectedLote) {
      await updateLote.mutateAsync({ id: selectedLote.idLote, data: lote });
      handleCloseUpdate();
    }
  };

  const handleDelete = async (lote: LoteWithKey) => {
    if (confirm('¿Está seguro de eliminar este lote?')) {
      await deleteLote.mutateAsync(lote.idLote);
    }
  };

  // Tipos para la tabla
  type LoteWithKey = Lote & { key: string };

  const columns: TableColumn<LoteWithKey>[] = [
    { key: 'idLote', label: 'ID' },
    { key: 'codigoLote', label: 'Código Lote' },
    { 
      key: 'cantidadUnidades', 
      label: 'Unidades',
      render: (lote: LoteWithKey) => {
        // Mostrar: unidades registradas / máximo permitido (12)
        const registradas = lote.cantidadUnidades || 0;
        const maximo = 12; // MAX_UNIDADES_POR_LOTE
        
        return (
          <span className="font-bold text-blue-600">
            {registradas}/{maximo}
          </span>
        );
      }
    },
    {
      key: 'fechaProduccion',
      label: 'Fecha Producción',
      render: (lote: LoteWithKey) => (
        <span>
          {lote.fechaProduccion
            ? new Date(lote.fechaProduccion).toLocaleDateString('es-ES')
            : 'N/A'}
        </span>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (lote: LoteWithKey) => (
        <span>
          {lote.fechaVencimiento
            ? new Date(lote.fechaVencimiento).toLocaleDateString('es-ES')
            : 'N/A'}
        </span>
      ),
    },
    {
      key: 'costoUnitario',
      label: 'Costo Unit.',
      render: (lote: LoteWithKey) => {
        const costo = Number(lote.costoUnitario) || 0;
        return <span>${formatNumber(costo)}</span>;
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (lote: LoteWithKey) => {
        // Determinar el estado del lote
        const unidadesDisponibles = lote.unidades?.filter((u: any) => u.estado === 'DISPONIBLE').length || 0;
        const totalUnidades = lote.unidades?.length || 0;
        
        if (!lote.estado) {
          return (
            <span className="text-red-600 font-bold">
              Vendido
            </span>
          );
        } else if (unidadesDisponibles === 0 && totalUnidades > 0) {
          return (
            <span className="text-orange-600 font-bold">
              Agotado
            </span>
          );
        }
        return (
          <span className="text-green-600">
            Activo
          </span>
        );
      },
    },
  ];

  if (isLoading) return <div className="p-4">Cargando lotes...</div>;
  if (error) return <div className="p-4">Error al cargar lotes: {error.message}</div>;

  const lotesWithKey: LoteWithKey[] = lotes
    ?.filter((lote: Lote) => lote?.idLote !== undefined)
    .map((lote: Lote) => ({
      ...lote,
      key: lote.idLote ? lote.idLote.toString() : crypto.randomUUID(),
    })) || [];

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <h1 className="text-2xl font-bold">Gestión de Lotes</h1>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nuevo Lote"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioLotes
          addData={handleAddLote}
          id="lote-form"
          onClose={handleClose}
        />
        <Buton
          className="w-full rounded-xl"
          form="lote-form"
          text="Guardar"
          type="submit"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Lote"
        isOpen={isOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedLote && (
          <FormularioLotes
            addData={handleUpdateLote}
            id="lote-update-form"
            onClose={handleCloseUpdate}
            initialData={{
              codigoLote: selectedLote.codigoLote,
              fechaProduccion: selectedLote.fechaProduccion ? new Date(selectedLote.fechaProduccion).toISOString().split('T')[0] : '',
              fechaVencimiento: selectedLote.fechaVencimiento ? new Date(selectedLote.fechaVencimiento).toISOString().split('T')[0] : '',
              costoUnitario: selectedLote.costoUnitario,
            }}
          />
        )}
        <Buton
          className="w-full rounded-xl"
          form="lote-update-form"
          text="Actualizar"
          type="submit"
        />
      </Modall>

      {userHasPermission(78) ? (
        lotesWithKey.length > 0 ? (
          <Globaltable
            columns={columns}
            data={lotesWithKey}
            onEdit={userHasPermission(79) ? handleEdit : undefined}
            onDelete={undefined}
            useDeleteInsteadOfChangeState={true}
            extraHeaderContent={
              <div className="flex gap-2">
                {userHasPermission(77) && (
                  <Buton onPress={() => setIsOpen(true)}>Nuevo Lote</Buton>
                )}
              </div>
            }
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay lotes registrados
            {userHasPermission(77) && (
              <div className="mt-4">
                <Buton onPress={() => setIsOpen(true)}>Crear primer lote</Buton>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tienes permiso para ver los lotes
        </div>
      )}
    </div>
  );
};

export default LotesPage;

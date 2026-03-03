import { useState } from 'react';
import { Card, CardBody } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

import Globaltable from '@/components/organismos/table.tsx';
import { TableColumn } from '@/components/organismos/table.tsx';
import Buton from '@/components/molecules/Button';
import Modall from '@/components/organismos/modal';
import FormRegisterUnidades from '@/components/organismos/Unidades/FormRegister';
import FormUpdateUnidades from '@/components/organismos/Unidades/FormUpdate';
import usePermissions from '@/hooks/Usuarios/usePermissions';
import { useUnidades, useCreateUnidad, useDeleteUnidad, useUpdateUnidad } from '@/hooks/Unidades/useUnidades';
import { Unidad } from '@/types/Unidad';

export const UnidadesPage = () => {
  const { userHasPermission } = usePermissions();
  const { data: unidades, isLoading, error } = useUnidades();
  const createUnidad = useCreateUnidad();
  const deleteUnidad = useDeleteUnidad();
  const updateUnidad = useUpdateUnidad();
  const navigate = useNavigate();

  const handleGoToCaracteristicas = () => {
    navigate('/bodega/caracteristicas');
  };

  const handleGoToUnidadesMedida = () => {
    navigate('/bodega/unidades-medida');
  };

  // Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  // Modal actualizar
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<Unidad | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedUnidad(null);
  };

  const handleAddUnidad = async (unidad: any) => {
    try {
      await createUnidad.mutateAsync(unidad);
      handleClose();
    } catch (err) {
      console.error('Error al agregar unidad:', err);
    }
  };

  const handleEdit = (unidad: UnidadWithKey) => {
    setSelectedUnidad(unidad);
    setIsOpenUpdate(true);
  };

  const handleUpdateUnidad = async (id: number, data: any) => {
    try {
      await updateUnidad.mutateAsync({ id, data });
      handleCloseUpdate();
    } catch (err) {
      console.error('Error al actualizar unidad:', err);
    }
  };

  const handleDelete = async (unidad: UnidadWithKey) => {
    if (confirm('¿Está seguro de eliminar esta unidad?')) {
      await deleteUnidad.mutateAsync(unidad.idUnidad);
    }
  };

  // Tipos para la tabla
  type UnidadWithKey = Unidad & { key: string };

  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVO':
        return 'bg-red-100 text-red-800';
      case 'VENDIDA':
        return 'bg-blue-100 text-blue-800';
      case 'RESERVADA':
        return 'bg-yellow-100 text-yellow-800';
      case 'DEGUSTACION':
        return 'bg-purple-100 text-purple-800';
      case 'ALIANZA':
        return 'bg-indigo-100 text-indigo-800';
      case 'OTRO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: TableColumn<UnidadWithKey>[] = [
    { key: 'idUnidad', label: 'ID' },
    { key: 'codigoUnidad', label: 'Código' },
    { key: 'lote', label: 'Lote', render: (unidad: UnidadWithKey) => <span>{unidad.lote?.codigoLote || '-'}</span> },
    { key: 'inventario', label: 'Inventario', render: (unidad: UnidadWithKey) => <span>{unidad.inventario?.nombre || '-'}</span> },
    {
      key: 'estado',
      label: 'Estado',
      render: (unidad: UnidadWithKey) => (
        <span className={`px-2 py-1 rounded text-sm ${getEstadoClass(unidad.estado || '')}`}>
          {unidad.estado}
        </span>
      ),
    },
  ];

  if (isLoading) return <div className="p-4">Cargando unidades...</div>;
  if (error) return <div className="p-4">Error al cargar unidades: {error.message}</div>;

  // Filtrar solo unidades que tienen ID válido
  const unidadesFiltradas = (unidades || []).filter((unidad: Unidad) => 
    unidad?.idUnidad !== undefined
  );

  // Mostrar los datos en la tabla, incluso si no tienen código
  const unidadesWithKey: UnidadWithKey[] = unidadesFiltradas
    .map((unidad: Unidad) => ({
      ...unidad,
      key: unidad.idUnidad ? unidad.idUnidad.toString() : crypto.randomUUID(),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestión de Unidades</h1>
              <div className="flex gap-2">
                <Buton text="Gestionar Características" onPress={handleGoToCaracteristicas} />
                <Buton text="Unidades de Medida" onPress={handleGoToUnidadesMedida} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nueva Unidad"
        isOpen={isOpen}
        onOpenChange={() => {
          handleClose();
        }}
      >
        <FormRegisterUnidades
          addData={handleAddUnidad}
          id="unidad-form"
          onClose={handleClose}
        />
        <Buton
          className="w-full rounded-xl"
          form="unidad-form"
          text="Guardar"
          type="submit"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Unidad"
        isOpen={isOpenUpdate}
        onOpenChange={() => {
          handleCloseUpdate();
        }}
      >
        {selectedUnidad && (
          <FormUpdateUnidades
            unidad={selectedUnidad}
            updateData={handleUpdateUnidad}
            id="unidad-update-form"
            onClose={handleCloseUpdate}
          />
        )}
      </Modall>

      {/* Mostrar tabla solo si tiene permiso de listar (19) */}
      {userHasPermission(19) ? (
        unidadesWithKey && unidadesWithKey.length > 0 ? (
          <Globaltable
            columns={columns}
            data={unidadesWithKey}
            extraHeaderContent={
              <div className="flex gap-2">
                {userHasPermission(18) && (
                  <Buton onPress={handleOpen}>Nueva Unidad</Buton>
                )}
              </div>
            }
            onEdit={userHasPermission(20) ? handleEdit : undefined}
            onDelete={userHasPermission(21) ? handleDelete : undefined}
            useDeleteInsteadOfChangeState={true}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay unidades registradas
            {userHasPermission(18) && (
              <div className="mt-4">
                <Buton onPress={() => setIsOpen(true)}>Crear primera unidad</Buton>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tienes permiso para ver las unidades
        </div>
      )}
    </div>
  );
};

export default UnidadesPage;

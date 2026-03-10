import { useState, useMemo } from "react";
import { Card, CardBody } from "@heroui/react";

import Globaltable from "@/components/organismos/table.tsx";
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormularioMateriasPrimas from "@/components/organismos/MateriasPrimas/FormRegister";
import { FormUpdate } from "@/components/organismos/MateriasPrimas/FormUpdate";
import { 
  useMateriasPrimas, 
  useCreateMateriaPrima, 
  useUpdateMateriaPrima, 
  useDeleteMateriaPrima,
  useChangeStatusMateriaPrima 
} from "@/hooks/MateriasPrimas/useMateriaPrima";
import { useLotes, useCreateLote, useCrearMateriasPrimasConLote } from "@/hooks/Lotes/useLotes";
import { MateriaPrima } from "@/types/MateriaPrima";
import { Lote, LoteCreate } from "@/types/Lote";

import usePermissions from "@/hooks/Usuarios/usePermissions";
import { formatNumber } from "@/utils/formatNumber";

// Tipo para materia prima con lote
type MateriaPrimaWithLote = MateriaPrima & {
  loteId?: number;
  loteCodigo?: string;
  cantidadLote?: number;
  costoTotalLote?: number;
};

export const MateriasPrimasPage = () => {
  const { userHasPermission } = usePermissions();
  const { data: materiasPrimas, isLoading: loadingMP, error: errorMP } = useMateriasPrimas();
  const { data: lotes, isLoading: loadingLotes, error: errorLotes } = useLotes();
  
  const createMateriaPrima = useCreateMateriaPrima();
  const updateMateriaPrima = useUpdateMateriaPrima();
  const deleteMateriaPrima = useDeleteMateriaPrima();
  const changeStatusMateriaPrima = useChangeStatusMateriaPrima();
  const createLote = useCreateLote();
  const crearMateriasPrimasConLote = useCrearMateriasPrimasConLote();

  // Estado para el lote seleccionado
  const [loteSeleccionado, setLoteSeleccionado] = useState<string>("todos");

  // Modal agregar materia prima
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null);
  const handleClose = () => {
    setIsOpen(false);
    setSelectedLoteId(null);
  };

  // Modal actualizar materia prima
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

  const handleAddMateriaPrimaToLote = async (data: any) => {
    try {
      if (selectedLoteId) {
        await crearMateriasPrimasConLote.mutateAsync({
          fkLote: selectedLoteId,
          materiasPrimas: data.materiasPrimas.map((mp: any) => ({
            nombre: mp.nombre,
            descripcion: mp.descripcion,
            cantidad: mp.cantidad,
            costoUnitario: mp.costoUnitario,
            fkUnidadMedida: mp.fkUnidadMedida,
          })),
        });
      }
      handleClose();
    } catch (err) {
      console.error("Error al agregar materia prima al lote:", err);
    }
  };

  const handleAddNewLote = async (lote: LoteCreate): Promise<{ idLote: number }> => {
    try {
      const result = await createLote.mutateAsync(lote);
      return { idLote: result.idLote };
    } catch (err) {
      console.error("Error al crear lote:", err);
      throw err;
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

  const handleDeleteMateriaPrima = async (materiaPrima: MateriaPrimaWithKey) => {
    if (confirm("¿Está seguro de eliminar esta materia prima?")) {
      await deleteMateriaPrima.mutateAsync(materiaPrima.idMateriaPrima);
    }
  };

  // Tipos para la tabla
  type MateriaPrimaWithKey = MateriaPrima & { 
    key: string; 
    loteCodigo?: string; 
    loteId?: number; 
    cantidadLote?: number;
    costoTotalLote?: number;
    lote?: string;
  };

  const columns: TableColumn<MateriaPrimaWithKey>[] = [
    { key: "idMateriaPrima", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { 
      key: "costoUnitario", 
      label: "Costo Unit.",
      render: (mp: MateriaPrimaWithKey) => (
        <span>${formatNumber(Number(mp.costoUnitario || 0))}</span>
      )
    },
    {
      key: "cantidadLote",
      label: "Cant.",
      render: (mp: MateriaPrimaWithKey) => (
        <span className="font-medium">{mp.cantidadLote || "-"}</span>
      ),
    },
    {
      key: "costoTotalLote",
      label: "Costo Total",
      render: (mp: MateriaPrimaWithKey) => (
        <span className="text-green-600 font-semibold">
          ${formatNumber(Number(mp.costoTotalLote || 0))}
        </span>
      ),
    },
    {
      key: "lote",
      label: "Lote",
      render: (mp: MateriaPrimaWithKey) => {
        return mp.loteCodigo ? (
          <span className="px-2 py-1 bg-primary-100 text-primary rounded text-sm font-medium">
            {mp.loteCodigo}
          </span>
        ) : (
          <span className="text-gray-400">Sin lote</span>
        );
      },
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

  // Obtener materias primas con información del lote
  const materiasPrimasConLote = useMemo(() => {
    return (materiasPrimas || []).map((mp: MateriaPrima) => {
      // Buscar la materia prima en los lotes
      let cantidadLote = 0;
      let costoTotalLote = 0;
      let loteId: number | undefined;
      let loteCodigo: string | undefined;

      for (const lote of (lotes || [])) {
        const materiasDelLote = (lote.materiasPrimas as any[]) || [];
        const mpEnLote = materiasDelLote.find(
          (lmp: any) => lmp.materiaPrima?.idMateriaPrima === mp.idMateriaPrima
        );
        if (mpEnLote) {
          cantidadLote = Number(mpEnLote.cantidad);
          costoTotalLote = Number(mpEnLote.costoTotal);
          loteId = lote.idLote;
          loteCodigo = lote.codigoLote;
          break;
        }
      }

      return {
        ...mp,
        loteId,
        loteCodigo,
        cantidadLote,
        costoTotalLote,
      } as MateriaPrimaWithLote;
    });
  }, [materiasPrimas, lotes]);

  // Agregar key a las materias primas
  const materiasPrimasWithKey: MateriaPrimaWithKey[] = (materiasPrimasConLote || [])
    .filter((mp: MateriaPrima) => mp?.idMateriaPrima !== undefined)
    .map((mp: MateriaPrimaWithLote) => ({
      ...mp,
      key: mp.idMateriaPrima ? mp.idMateriaPrima.toString() : crypto.randomUUID(),
    }));

  // Calcular totales por lote
  const totalesPorLote = useMemo(() => {
    const totales: Record<string, { codigo: string; total: number; cantidad: number }> = {};
    
    for (const lote of (lotes || [])) {
      const materiasDelLote = (lote.materiasPrimas as any[]) || [];
      let totalLote = 0;
      let cantidadTotal = 0;
      
      // Calcular manualmente desde los datos de materias primas
      for (const mp of materiasDelLote) {
        totalLote += Number(mp.costoTotal || 0);
        cantidadTotal += Number(mp.cantidad || 0);
      }
      
      if (cantidadTotal > 0) {
        totales[lote.idLote] = {
          codigo: lote.codigoLote,
          total: totalLote,
          cantidad: cantidadTotal
        };
      }
    }
    
    return totales;
  }, [lotes]);

  // Retornos anticipados después de todos los hooks
  if (loadingMP || loadingLotes) return <div className="p-4">Cargando...</div>;
  if (errorMP) return <div className="p-4">Error al cargar materias primas: {errorMP.message}</div>;
  if (errorLotes) return <div className="p-4">Error al cargar lotes: {errorLotes.message}</div>;

  return (
    <div className="p-4">
      {/* Card de título */}
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <h1 className="text-2xl font-bold">Gestión de Materias Primas</h1>
          </CardBody>
        </Card>
      </div>

      {/* Resumen de totales por lote - Solo muestra el lote seleccionado */}
      {Object.keys(totalesPorLote).length > 0 && loteSeleccionado !== "todos" && (
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Solo mostrar el lote seleccionado */}
            {totalesPorLote[loteSeleccionado] && (
              <Card className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                <CardBody className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Lote: {totalesPorLote[loteSeleccionado].codigo}
                    </span>
                    <span className="text-xs bg-primary-100 text-primary px-2 py-1 rounded">
                      {totalesPorLote[loteSeleccionado].cantidad} items
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    ${formatNumber(totalesPorLote[loteSeleccionado].total)}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Cuando está en "todos" mostrar mensaje */}
      {loteSeleccionado === "todos" && Object.keys(totalesPorLote).length > 0 && (
        <div className="mb-4">
          <Card className="bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
            <CardBody className="p-4 text-center">
              <span className="text-gray-500 dark:text-gray-400">
                Seleccione un lote para ver su costo total
              </span>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Tabla con filtros y botones */}
      {materiasPrimasWithKey && materiasPrimasWithKey.length > 0 ? (
        <Globaltable
          columns={columns}
          data={materiasPrimasWithKey}
          onEdit={userHasPermission(20) ? handleEdit : undefined}
          onDelete={undefined}
          useDeleteInsteadOfChangeState={true}
          showEstado={true}
          lotes={lotes ? lotes.map((l: any) => ({ idLote: l.idLote, codigoLote: l.codigoLote })) : []}
          onLoteChange={setLoteSeleccionado}
          extraHeaderContent={
            userHasPermission(18) ? (
              <Buton onPress={() => setIsOpen(true)}>
                Nueva Materia Prima
              </Buton>
            ) : undefined
          }
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
      )}

      {/* Modal: Agregar materias primas */}
      <Modall
        ModalTitle="Registrar Materias Primas"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioMateriasPrimas
          addData={handleAddMateriaPrima}
          addLote={handleAddNewLote}
          id="materia-prima-form"
          onClose={handleClose}
        />
      </Modall>

      {/* Modal: Actualizar materia prima */}
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
    </div>
  );
};

export default MateriasPrimasPage;

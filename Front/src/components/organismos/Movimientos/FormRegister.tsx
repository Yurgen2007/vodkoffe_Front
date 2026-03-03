import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";

import { MovimientoCreate } from "@/types/Movimiento";
import { useLotes } from "@/hooks/Lotes/useLotes";

type FormularioProps = {
  addData: (data: MovimientoCreate) => Promise<void>;
  onClose: () => void;
  id: string;
  initialData?: MovimientoCreate;
};

export default function FormularioMovimientos({
  addData,
  onClose,
  id,
  initialData,
}: FormularioProps) {
  const { data: lotes } = useLotes();
  
  // Memoizar el lote inicial para evitar problemas de renderizado
  const loteInicialId = useMemo(() => {
    return initialData?.fkLote || 0;
  }, [initialData?.fkLote]);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MovimientoCreate>({
    mode: "onChange",
    defaultValues: initialData ? {
      tipo: initialData.tipo || "VENTA",
      cantidadVendida: initialData.cantidadVendida ?? 0,
      cantidadDegustacion: initialData.cantidadDegustacion ?? 0,
      cantidadAlianza: initialData.cantidadAlianza ?? 0,
      cantidadInventario: initialData.cantidadInventario ?? 0,
      precioUnitario: initialData.precioUnitario ?? 0,
      descripcion: initialData.descripcion || "",
      nombreCliente: initialData.nombreCliente || "",
      fkLote: initialData.fkLote ?? 0,
    } : {
      tipo: "VENTA",
      cantidadVendida: 0,
      cantidadDegustacion: 0,
      cantidadAlianza: 0,
      cantidadInventario: 0,
      precioUnitario: 0,
      descripcion: "",
      nombreCliente: "",
      fkLote: 0,
    },
  });

  const fkLoteValue = watch("fkLote");
  const cantidadVendida = watch("cantidadVendida");
  const cantidadDegustacion = watch("cantidadDegustacion");
  const cantidadAlianza = watch("cantidadAlianza");

  // Usar el valor actual del formulario o el inicial
  const loteId = fkLoteValue || loteInicialId || 0;
  
  // Encontrar el lote seleccionado para obtener el precio unitario
  const loteSeleccionado = lotes?.find((l: any) => l.idLote === loteId);
  
  // Usar el precio del lote o el precio del initialData
  const precioUnitarioLote = loteSeleccionado?.costoUnitario || initialData?.precioUnitario || 0;

  // Actualizar precio unitario cuando cambia el lote o los datos iniciales
  useEffect(() => {
    if (loteSeleccionado?.costoUnitario) {
      setValue('precioUnitario', loteSeleccionado.costoUnitario);
    }
  }, [loteSeleccionado, setValue]);

  // Resetear el formulario cuando initialData cambia (para modo edición)
  useEffect(() => {
    if (initialData) {
      reset({
        tipo: initialData.tipo || 'VENTA',
        cantidadVendida: initialData.cantidadVendida ?? 0,
        cantidadDegustacion: initialData.cantidadDegustacion ?? 0,
        cantidadAlianza: initialData.cantidadAlianza ?? 0,
        cantidadInventario: initialData.cantidadInventario ?? 0,
        precioUnitario: initialData.precioUnitario ?? 0,
        descripcion: initialData.descripcion || '',
        nombreCliente: initialData.nombreCliente || '',
        fkLote: initialData.fkLote ?? 0,
      });
    }
  }, [initialData, reset]);

  // Calcular precio total automáticamente (solo para ventas)
  const calcularPrecioTotal = () => {
    const cantidadTotal = (cantidadVendida || 0) + (cantidadDegustacion || 0) + (cantidadAlianza || 0);
    return cantidadTotal * precioUnitarioLote;
  };

  const precioTotalCalculado = calcularPrecioTotal();

  const onSubmit = async (data: MovimientoCreate) => {
    try {
      const dataConPrecio = {
        ...data,
        tipo: data.tipo || 'VENTA',
        precioUnitario: precioUnitarioLote,
      };
      await addData(dataConPrecio);
      onClose();
      addToast({
        title: "Registro exitoso",
        description: "Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      addToast({
        title: "Error",
        description: "No se pudo registrar el movimiento",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  // Determinar si es modo edición
  const isEditing = !!initialData;

  // Keys seleccionadas para el Select de lote
  const selectedKeys = loteInicialId ? [String(loteInicialId)] : [];

  return (
    <Form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Si está editando, solo mostrar campos editables */}
      {isEditing ? (
        <>
          <Input
            label="Nombre Cliente"
            placeholder="Nombre del cliente al que se le vende"
            type="text"
            defaultValue={initialData?.nombreCliente || ''}
            onChange={(e) => setValue('nombreCliente', e.target.value)}
          />

          <Input
            label="Descripción"
            placeholder="Descripción del movimiento"
            type="text"
            defaultValue={initialData?.descripcion || ''}
            onChange={(e) => setValue('descripcion', e.target.value)}
          />
        </>
      ) : (
        <>
          {/* Campos para nuevo movimiento */}
          {/* Campo lote */}
          <Select
            label="Lote"
            defaultSelectedKeys={selectedKeys}
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              if (selected) {
                setValue("fkLote", Number(selected));
              }
            }}
          >
            {(lotes || []).map((lote: any) => (
              <SelectItem key={String(lote.idLote)}>
                {lote.codigoLote} ({lote.unidades?.filter((u: any) => u.estado === 'DISPONIBLE').length || 0} disponibles)
              </SelectItem>
            ))}
          </Select>

          {/* Campo tipo de movimiento - solo VENTA para este formulario */}
          <Select
            label="Tipo de Movimiento"
            defaultSelectedKeys={['VENTA']}
            isDisabled
          >
            <SelectItem key="VENTA">Venta</SelectItem>
          </Select>

          <Input
            label="Nombre Cliente"
            placeholder="Nombre del cliente al que se le vende"
            type="text"
            onChange={(e) => setValue('nombreCliente', e.target.value)}
          />

          {/* Campo cantidadVendida */}
          <Input
            label="Cantidad Vendida"
            placeholder="Cantidad vendida"
            type="number"
            onChange={(e) => setValue('cantidadVendida', Number(e.target.value) || 0)}
          />

          {/* Campo cantidadDegustacion */}
          <Input
            label="Cantidad Degustación"
            placeholder="Cantidad para degustación"
            type="number"
            onChange={(e) => setValue('cantidadDegustacion', Number(e.target.value) || 0)}
          />

          {/* Campo cantidadAlianza */}
          <Input
            label="Cantidad Alianza"
            placeholder="Cantidad para alianza"
            type="number"
            onChange={(e) => setValue('cantidadAlianza', Number(e.target.value) || 0)}
          />

          {/* Precio unitario del lote (solo lectura) */}
          <Input
            label="Precio Unitario"
            placeholder="Precio del lote"
            type="number"
            value={precioUnitarioLote}
            isReadOnly
            variant="bordered"
          />

          {/* Precio total calculado automáticamente */}
          <Input
            label="Precio Total"
            placeholder="Total a cobrar"
            type="number"
            value={String(precioTotalCalculado)}
            isReadOnly
            variant="bordered"
          />

          {/* La fecha del movimiento se genera automáticamente en el servidor */}
          <Input
            label="Fecha Movimiento"
            type="text"
            value={new Date().toLocaleDateString('es-ES')}
            isReadOnly
            variant="bordered"
          />

          <Input
            label="Descripción"
            placeholder="Descripción del movimiento"
            type="text"
            onChange={(e) => setValue('descripcion', e.target.value)}
          />
        </>
      )}

      {/* Botón de guardar */}
      <div className="flex justify-end gap-2 pt-4 w-full">
        <Button color="primary" type="submit" className="w-full">
          Guardar
        </Button>
      </div>
    </Form>
  );
}

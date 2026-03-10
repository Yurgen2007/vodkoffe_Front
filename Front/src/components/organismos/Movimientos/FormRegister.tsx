import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem, Button } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";

import { useLotes } from "@/hooks/Lotes/useLotes";
import { MovimientoCreateSchema, MovimientoCreate } from "@/schemas/Movimientos";

type FormularioProps = {
  addData: (data: any) => Promise<void>;
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
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(MovimientoCreateSchema),
    defaultValues: initialData ? {
      tipo: initialData.tipo || "VENTA",
      cantidadVendida: Number(initialData.cantidadVendida) || 0,
      cantidadDegustacion: Number(initialData.cantidadDegustacion) || 0,
      cantidadAlianza: Number(initialData.cantidadAlianza) || 0,
      cantidadInventario: Number(initialData.cantidadInventario) || 0,
      precioUnitario: Number(initialData.precioUnitario) || 0,
      descripcion: initialData.descripcion || "",
      nombreCliente: initialData.nombreCliente || "",
      fkLote: Number(initialData.fkLote) || 0,
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

  // Debug: monitorear errores de validación
  useEffect(() => {
    console.log('Errores del formulario:', JSON.stringify(errors, null, 2));
  }, [errors]);

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

  // Resetear el formulario cuando initialData cambia (para modo edición)
  useEffect(() => {
    if (initialData) {
      reset({
        tipo: initialData.tipo || 'VENTA',
        cantidadVendida: Number(initialData.cantidadVendida) || 0,
        cantidadDegustacion: Number(initialData.cantidadDegustacion) || 0,
        cantidadAlianza: Number(initialData.cantidadAlianza) || 0,
        cantidadInventario: Number(initialData.cantidadInventario) || 0,
        precioUnitario: Number(initialData.precioUnitario) || 0,
        descripcion: initialData.descripcion || '',
        nombreCliente: initialData.nombreCliente || '',
        fkLote: Number(initialData.fkLote) || 0,
      });
    }
  }, [initialData, reset]);

  // Calcular precio total automáticamente (solo para ventas cobradas)
  // Degustación y alianza no se cobran, solo ventas
  const calcularPrecioTotal = () => {
    const cantidadCobrar = (cantidadVendida || 0); // Solo ventas se cobran
    return cantidadCobrar * (precioUnitarioLote || 0);
  };

  const precioTotalCalculado = calcularPrecioTotal();

  const handleFormSubmit = (data: any) => {
    console.log('=== handleFormSubmit llamado ===');
    console.log('Datos del formulario:', data);
    onSubmit(data);
  };

  const onSubmit = async (data: any) => {
    console.log('=== onSubmit llamado ===');
    console.log('data recibida:', data);
    try {
      console.log('Intentando guardar movimiento...');
      // Las validaciones ahora están en el schema Zod
      // Convertir los datos al formato requerido por el tipo
      const movimientoData: MovimientoCreate = {
        tipo: data.tipo || 'VENTA',
        cantidadVendida: Number(data.cantidadVendida) || 0,
        cantidadDegustacion: Number(data.cantidadDegustacion) || 0,
        cantidadAlianza: Number(data.cantidadAlianza) || 0,
        cantidadInventario: data.cantidadInventario ? Number(data.cantidadInventario) : undefined,
        precioUnitario: Number(precioUnitarioLote) || 0,
        descripcion: data.descripcion || '',
        nombreCliente: data.nombreCliente || '',
        fkLote: Number(data.fkLote),
      };
      
      console.log('Enviando movimiento:', movimientoData);
      await addData(movimientoData);
      addToast({
        title: "Registro exitoso",
        description: "Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      onClose();
    } catch (error: any) {
      console.error("Error al guardar:", error);
      addToast({
        title: "Error",
        description: error?.message || "No se pudo registrar el movimiento",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  // Determinar si es modo edición
  const isEditing = !!initialData;

  return (
    <Form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      {/* Si está editando, solo mostrar campos editables */}
      {isEditing ? (
        <>
          <Controller
            name="nombreCliente"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nombre Cliente"
                placeholder="Nombre del cliente al que se le vende"
                type="text"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                isInvalid={!!errors.nombreCliente}
                errorMessage={errors.nombreCliente?.message}
              />
            )}
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
          <Controller
            name="fkLote"
            control={control}
            rules={{ required: 'Debe seleccionar un lote' }}
            render={({ field, fieldState }) => (
              <Select
                label="Lote"
                placeholder="Seleccione un lote"
                selectedKeys={field.value ? [String(field.value)] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (selected) {
                    const numValue = Number(selected);
                    field.onChange(numValue);
                  }
                }}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              >
                {(lotes || []).map((lote: any) => (
                  <SelectItem key={String(lote.idLote)} textValue={`${lote.codigoLote} (${lote.unidades?.filter((u: any) => u.estado === 'DISPONIBLE').length || 0} disponibles)`}>
                    {lote.codigoLote} ({lote.unidades?.filter((u: any) => u.estado === 'DISPONIBLE').length || 0} disponibles)
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          {/* Campo tipo de movimiento - solo VENTA para este formulario */}
          <Select
            label="Tipo de Movimiento"
            defaultSelectedKeys={['VENTA']}
            isDisabled
          >
            <SelectItem key="VENTA" textValue="Venta">Venta</SelectItem>
          </Select>

          <Controller
            name="nombreCliente"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nombre Cliente"
                placeholder="Nombre del cliente al que se le vende"
                type="text"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                isInvalid={!!errors.nombreCliente}
                errorMessage={errors.nombreCliente?.message}
              />
            )}
          />

          {/* Campo cantidadVendida */}
          <Controller
            name="cantidadVendida"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Cantidad Vendida"
                placeholder="Cantidad vendida"
                type="number"
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const value = e.target.value.replace(',', '.');
                  field.onChange(parseInt(value) || 0);
                }}
                isInvalid={!!errors.cantidadVendida}
                errorMessage={errors.cantidadVendida?.message as string}
              />
            )}
          />

          {/* Campo cantidadDegustacion */}
          <Controller
            name="cantidadDegustacion"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Cantidad Degustación"
                placeholder="Cantidad para degustación"
                type="number"
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const value = e.target.value.replace(',', '.');
                  field.onChange(parseInt(value) || 0);
                }}
                isInvalid={!!errors.cantidadDegustacion}
                errorMessage={errors.cantidadDegustacion?.message as string}
              />
            )}
          />

          {/* Campo cantidadAlianza */}
          <Controller
            name="cantidadAlianza"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Cantidad Alianza"
                placeholder="Cantidad para alianza"
                type="number"
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const value = e.target.value.replace(',', '.');
                  field.onChange(parseInt(value) || 0);
                }}
                isInvalid={!!errors.cantidadAlianza}
                errorMessage={errors.cantidadAlianza?.message as string}
              />
            )}
          />

          {/* Precio unitario del lote (solo lectura) - se calcula automáticamente */}
          <Input
            label="Precio Unitario"
            placeholder="Precio del lote"
            type="text"
            value={String(precioUnitarioLote || 0)}
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

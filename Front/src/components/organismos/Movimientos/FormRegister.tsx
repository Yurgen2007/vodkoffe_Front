import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";

import { MovimientoCreate } from "@/types/Movimiento";

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MovimientoCreate>({
    mode: "onChange",
    defaultValues: initialData || {
      tipo: "VENTA",
      cantidadVendida: 0,
      cantidadDegustacion: 0,
      cantidadAlianza: 0,
      cantidadOtro: 0,
      cantidadInventario: 0,
      precioUnitario: 0,
      descripcion: "",
      fechaMovimiento: new Date().toISOString().split("T")[0],
      fkLote: 0,
    },
  });

  const tipoSeleccionado = watch("tipo");

  const onSubmit = async (data: MovimientoCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Select
        label="Tipo de Movimiento"
        {...register("tipo", { required: "El tipo es requerido" })}
        selectedKeys={[initialData?.tipo || "VENTA"]}
        errorMessage={errors.tipo?.message}
        isInvalid={!!errors.tipo}
      >
        <SelectItem key="VENTA">Venta</SelectItem>
        <SelectItem key="NO_VENTA">No Venta</SelectItem>
        <SelectItem key="INVENTARIO">Inventario</SelectItem>
      </Select>

      {tipoSeleccionado === "NO_VENTA" && (
        <Select
          label="Tipo de No Venta"
          {...register("tipoNoVenta")}
          selectedKeys={initialData?.tipoNoVenta ? [initialData.tipoNoVenta] : []}
          errorMessage={errors.tipoNoVenta?.message}
          isInvalid={!!errors.tipoNoVenta}
        >
          <SelectItem key="DEGUSTACION">Degustación</SelectItem>
          <SelectItem key="ALIANZA">Alianza</SelectItem>
          <SelectItem key="OTRO">Otro</SelectItem>
        </Select>
      )}

      {tipoSeleccionado === "INVENTARIO" && (
        <Select
          label="Tipo de Inventario"
          {...register("tipoInventario", { required: "El tipo de inventario es requerido" })}
          selectedKeys={initialData?.tipoInventario ? [initialData.tipoInventario] : []}
          errorMessage={errors.tipoInventario?.message}
          isInvalid={!!errors.tipoInventario}
        >
          <SelectItem key="entrada">Entrada</SelectItem>
          <SelectItem key="salida">Salida</SelectItem>
          <SelectItem key="ajuste">Ajuste</SelectItem>
        </Select>
      )}

      {/* Campos para VENTA */}
      {tipoSeleccionado === "VENTA" && (
        <>
          <Input
            label="Cantidad Vendida"
            placeholder="Ingrese la cantidad"
            type="number"
            {...register("cantidadVendida", { 
              required: "La cantidad es requerida",
              valueAsNumber: true,
              min: { value: 0, message: "La cantidad debe ser mayor o igual a 0" }
            })}
            errorMessage={errors.cantidadVendida?.message}
            isInvalid={!!errors.cantidadVendida}
          />

          <Input
            label="Precio Unitario"
            placeholder="Ingrese el precio unitario"
            type="number"
            step="0.01"
            {...register("precioUnitario", { 
              required: "El precio es requerido",
              valueAsNumber: true,
              min: { value: 0, message: "El precio debe ser mayor o igual a 0" }
            })}
            errorMessage={errors.precioUnitario?.message}
            isInvalid={!!errors.precioUnitario}
          />
        </>
      )}

      {/* Campos para NO_VENTA */}
      {tipoSeleccionado === "NO_VENTA" && (
        <>
          <Input
            label="Cantidad Degustación"
            placeholder="Cantidad para degustación"
            type="number"
            {...register("cantidadDegustacion", { 
              valueAsNumber: true,
              min: { value: 0, message: "La cantidad debe ser mayor o igual a 0" }
            })}
            errorMessage={errors.cantidadDegustacion?.message}
            isInvalid={!!errors.cantidadDegustacion}
          />

          <Input
            label="Cantidad Alianza"
            placeholder="Cantidad para alianza"
            type="number"
            {...register("cantidadAlianza", { 
              valueAsNumber: true,
              min: { value: 0, message: "La cantidad debe ser mayor o igual a 0" }
            })}
            errorMessage={errors.cantidadAlianza?.message}
            isInvalid={!!errors.cantidadAlianza}
          />

          <Input
            label="Cantidad Otro"
            placeholder="Cantidad otro tipo"
            type="number"
            {...register("cantidadOtro", { 
              valueAsNumber: true,
              min: { value: 0, message: "La cantidad debe ser mayor o igual a 0" }
            })}
            errorMessage={errors.cantidadOtro?.message}
            isInvalid={!!errors.cantidadOtro}
          />
        </>
      )}

      {/* Campos para INVENTARIO */}
      {tipoSeleccionado === "INVENTARIO" && (
        <>
          <Input
            label="Cantidad"
            placeholder="Cantidad para inventario"
            type="number"
            {...register("cantidadInventario", { 
              required: "La cantidad es requerida",
              valueAsNumber: true,
              min: { value: 1, message: "La cantidad debe ser mayor a 0" }
            })}
            errorMessage={errors.cantidadInventario?.message}
            isInvalid={!!errors.cantidadInventario}
          />

          <Input
            label="ID Unidad"
            placeholder="Ingrese el ID de la unidad"
            type="number"
            {...register("fkUnidad", { 
              required: "El ID de unidad es requerido",
              valueAsNumber: true,
              min: { value: 1, message: "El ID debe ser mayor a 0" }
            })}
            errorMessage={errors.fkUnidad?.message}
            isInvalid={!!errors.fkUnidad}
          />
        </>
      )}

      {/* Campo fecha - siempre visible */}
      <Input
        label="Fecha Movimiento"
        type="date"
        {...register("fechaMovimiento", { required: "La fecha es requerida" })}
        errorMessage={errors.fechaMovimiento?.message}
        isInvalid={!!errors.fechaMovimiento}
      />

      {/* Campo lote - visible para VENTA y NO_VENTA */}
      {(tipoSeleccionado === "VENTA" || tipoSeleccionado === "NO_VENTA") && (
        <>
          <Input
            label="ID Lote"
            placeholder="Ingrese el ID del lote"
            type="number"
            {...register("fkLote", { 
              required: "El ID del lote es requerido",
              valueAsNumber: true,
              min: { value: 1, message: "El ID debe ser mayor a 0" }
            })}
            errorMessage={errors.fkLote?.message}
            isInvalid={!!errors.fkLote}
          />

          <Input
            label="Nombre Cliente"
            placeholder="Nombre del cliente al que se le vende"
            type="text"
            {...register("nombreCliente")}
            errorMessage={errors.nombreCliente?.message}
            isInvalid={!!errors.nombreCliente}
          />
        </>
      )}

      <Input
        label="Descripción"
        placeholder="Descripción del movimiento"
        type="text"
        {...register("descripcion")}
        errorMessage={errors.descripcion?.message}
        isInvalid={!!errors.descripcion}
      />
    </Form>
  );
}

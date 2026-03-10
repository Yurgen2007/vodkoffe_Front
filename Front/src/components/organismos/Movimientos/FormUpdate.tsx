import { Form } from "@heroui/form";
import { addToast, Input, Button } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { MovimientoUpdateSchema } from "@/schemas/Movimientos";

interface FormUpdateMovimientoProps {
  movimiento: any;
  updateData: (id: number, data: any) => Promise<void>;
  onClose: () => void;
  id: string;
}

export default function FormUpdateMovimiento({
  movimiento,
  updateData,
  onClose,
  id,
}: FormUpdateMovimientoProps) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(MovimientoUpdateSchema),
  });

  // Resetear el formulario con los valores del movimiento cuando cambia
  useEffect(() => {
    if (movimiento) {
      reset({
        nombreCliente: movimiento.nombreCliente || "",
        descripcion: movimiento.descripcion || "",
      });
    }
  }, [movimiento, reset]);

  const onSubmit = async (data: any) => {
    try {
      console.log('Datos del formulario:', data);
      console.log('Movimiento actual:', movimiento);

      // Incluir todos los campos del movimiento existente más los actualizados
      const payload: any = {
        tipo: movimiento.tipo,
        cantidadVendida: Number(movimiento.cantidadVendida) || 0,
        cantidadDegustacion: Number(movimiento.cantidadDegustacion) || 0,
        cantidadAlianza: Number(movimiento.cantidadAlianza) || 0,
        cantidadInventario: Number(movimiento.cantidadInventario) || 0,
        tipoInventario: movimiento.tipoInventario || null,
        precioUnitario: Number(movimiento.precioUnitario) || 0,
        fkLote: movimiento.fkLote || movimiento.lote?.idLote || 0,
        nombreCliente: data.nombreCliente?.trim() || movimiento.nombreCliente || null,
        descripcion: data.descripcion?.trim() || movimiento.descripcion || null,
        fechaMovimiento: movimiento.fechaMovimiento || new Date().toISOString().split('T')[0],
      };

      console.log('Payload a enviar:', payload);
      await updateData(movimiento.idMovimiento, payload);

      console.log('Actualización exitosa');
      addToast({
        title: "Actualización exitosa",
        description: "Movimiento actualizado correctamente",
        color: "success",
      });

      onClose();
    } catch (err) {
      console.error('Error al actualizar:', err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar el movimiento",
        color: "danger",
      });
    }
  };

  return (
    <Form className="w-full space-y-4" id={id} onSubmit={handleSubmit(onSubmit)}>
      {/* Nombre Cliente */}
      <Controller
        name="nombreCliente"
        control={control}
        defaultValue={movimiento?.nombreCliente || ""}
        render={({ field }) => (
          <Input
            {...field}
            label="Nombre Cliente"
            placeholder="Nombre del cliente"
            type="text"
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            isInvalid={!!errors.nombreCliente}
            errorMessage={errors.nombreCliente?.message as string}
          />
        )}
      />

      {/* Descripción */}
      <Controller
        name="descripcion"
        control={control}
        defaultValue={movimiento?.descripcion || ""}
        render={({ field }) => (
          <Input
            {...field}
            label="Descripción"
            placeholder="Descripción del movimiento"
            type="text"
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            isInvalid={!!errors.descripcion}
            errorMessage={errors.descripcion?.message as string}
          />
        )}
      />

      <Button
        color="primary"
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Actualizar
      </Button>
    </Form>
  );
}

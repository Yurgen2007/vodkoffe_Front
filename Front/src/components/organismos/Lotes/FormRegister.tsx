import { Form } from "@heroui/form";
import { addToast, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { LoteCreate } from "@/types/Lote";
import { LoteCreateSchema } from "@/schemas/Lotes";
import { commonDefaultValues } from "@/utils/defaultValues";

type FormularioProps = {
  addData: (data: LoteCreate) => Promise<void>;
  onClose: () => void;
  id: string;
  initialData?: LoteCreate;
};

export default function FormularioLotes({
  addData,
  onClose,
  id,
  initialData,
}: FormularioProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoteCreate>({
    mode: "onChange",
    resolver: zodResolver(LoteCreateSchema),
    defaultValues: initialData || {
      codigoLote: "",
      cantidadUnidades: commonDefaultValues.cantidadUnidades,
      fechaProduccion: commonDefaultValues.fechaProduccion,
      fechaVencimiento: "",
      costoUnitario: commonDefaultValues.costoUnitario,
    },
  });

  // Resetear el formulario cuando initialData cambia
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Lote agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error: any) {
      console.error("Error al guardar:", error);
      
      // Extraer mensaje de error del backend
      let mensajeError = "Error al guardar el lote";
      if (error?.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error?.message) {
        mensajeError = error.message;
      }
      
      addToast({
        title: "Error",
        description: mensajeError,
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  return (
    <Form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Código Lote"
        placeholder="Ingrese el código del lote"
        type="text"
        {...register("codigoLote")}
        errorMessage={errors.codigoLote?.message}
        isInvalid={!!errors.codigoLote}
      />
      <Input
        label="Cantidad Unidades"
        placeholder="12"
        type="number"
        value="12"
        isReadOnly
        variant="bordered"
      />
      <Input
        label="Fecha Producción"
        type="date"
        {...register("fechaProduccion")}
        errorMessage={errors.fechaProduccion?.message}
        isInvalid={!!errors.fechaProduccion}
      />
      <Input
        label="Fecha Vencimiento"
        type="date"
        {...register("fechaVencimiento")}
        errorMessage={errors.fechaVencimiento?.message}
        isInvalid={!!errors.fechaVencimiento}
      />
      <Input
        label="Costo Unitario"
        placeholder="Ingrese el costo unitario"
        type="number"
        step="0.01"
        {...register("costoUnitario", { valueAsNumber: true })}
        errorMessage={errors.costoUnitario?.message}
        isInvalid={!!errors.costoUnitario}
      />
    </Form>
  );
}

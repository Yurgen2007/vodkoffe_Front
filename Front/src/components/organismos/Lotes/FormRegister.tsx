import { Form } from "@heroui/form";
import { addToast, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { LoteCreate } from "@/types/Lote";

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
    defaultValues: initialData || {
      codigoLote: "",
      fechaProduccion: new Date().toISOString().split("T")[0],
      fechaVencimiento: "",
      costoUnitario: 0,
    },
  });

  // Resetear el formulario cuando initialData cambia
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: LoteCreate) => {
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
      <Input
        label="Código Lote"
        placeholder="Ingrese el código del lote"
        type="text"
        {...register("codigoLote", { required: "El código es requerido" })}
        errorMessage={errors.codigoLote?.message}
        isInvalid={!!errors.codigoLote}
      />
      <Input
        label="Fecha Producción"
        type="date"
        {...register("fechaProduccion", { required: "La fecha de producción es requerida" })}
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
        {...register("costoUnitario", { 
          required: "El costo unitario es requerido",
          valueAsNumber: true,
          min: { value: 0, message: "El costo debe ser mayor o igual a 0" }
        })}
        errorMessage={errors.costoUnitario?.message}
        isInvalid={!!errors.costoUnitario}
      />
    </Form>
  );
}

import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input, addToast } from "@heroui/react";

import Buton from "@/components/molecules/Button";
import { useCodigoInventario } from "@/hooks/CodigoInventario/useCodigoInventario";
import {
  CodigoInventarioUpdate,
  CodigoInventarioUpdateSchema,
} from "@/schemas/CodigoInventario";

type Props = {
  codigos: (CodigoInventarioUpdate & { idCodigoInventario?: number })[];
  codigoId: number;
  id: string;
  onClose: () => void;
};

export const FormUpdate = ({ codigos, codigoId, id, onClose }: Props) => {
  const { updateCodigoInventario, getCodigoInventarioById } =
    useCodigoInventario();

  const foundCodigo = getCodigoInventarioById(
    codigoId,
    codigos,
  ) as CodigoInventarioUpdate;

  console.log("foundCodigo:", foundCodigo);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CodigoInventarioUpdate>({
    resolver: zodResolver(CodigoInventarioUpdateSchema),
    mode: "onChange",
    defaultValues: {
      codigo: foundCodigo.codigo,
    },
  });

  const onSubmit = async (data: CodigoInventarioUpdate) => {
    if (!codigoId) return;
    try {
      await updateCodigoInventario(codigoId, data);
      onClose();
      addToast({
        title: "Actualización Exitosa",
        description: "Código actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al actualizar el código:", error);
    }
  };

  return (
    <Form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Código"
        placeholder="Nuevo código"
        {...register("codigo", { required: "El código es requerido" })}
        errorMessage={errors.codigo?.message}
        isInvalid={!!errors.codigo}
      />
      <Buton
        className="w-full rounded-xl"
        isLoading={isSubmitting}
        text="Guardar"
        type="submit"
      />
    </Form>
  );
};

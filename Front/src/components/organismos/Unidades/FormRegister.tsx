import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem, Switch, Textarea } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useLotes } from "@/hooks/Lotes/useLotes";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { UnidadCreate, UnidadCreateSchema } from "@/schemas/Unidad";

interface FormRegisterUnidadesProps {
  addData: (data: any) => Promise<void>;
  onClose: () => void;
  id: string;
}

/* ✅ IMPORTANTE: FormValues usa STRING en los Select */
type FormValues = UnidadCreate;

export default function FormRegisterUnidades({
  addData,
  onClose,
  id,
}: FormRegisterUnidadesProps) {
  const { data: lotes } = useLotes();
  const { inventarios } = useInventario();
  const { caracteristicas } = useCaracteristica();
  const { unidades } = useUnidad();
  const [modoMultiple, setModoMultiple] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UnidadCreate>({
    mode: "onChange",
    resolver: zodResolver(UnidadCreateSchema),
    defaultValues: {
      codigoUnidad: "",
      fkLote: undefined,
      fkInventario: undefined,
      fkCaracteristica: undefined,
      fkUnidadMedida: undefined,
    },
  });

  const onSubmit = async (data: UnidadCreate) => {
    try {
      // Convertir el campo de código a array (soportar múltiples códigos)
      const codigosRaw = data.codigoUnidad.trim();
      // Separar por comas, saltos de línea o guiones
      const codigos = codigosRaw
        .split(/[,\n\-]/)
        .map(c => c.trim())
        .filter(c => c !== '');

      console.log('Códigos parseados:', codigos);

      // Determinar si es modo múltiple
      const esMultiple = modoMultiple || codigos.length > 1;

      if (esMultiple && codigos.length > 0) {
        // Crear array de unidades
        const unidades = codigos.map(codigoUnidad => ({
          codigoUnidad,
          fkLote: data.fkLote ? Number(data.fkLote) : undefined,
          fkInventario: data.fkInventario ? Number(data.fkInventario) : undefined,
          fkCaracteristica: data.fkCaracteristica ? Number(data.fkCaracteristica) : undefined,
          fkUnidadMedida: data.fkUnidadMedida ? Number(data.fkUnidadMedida) : undefined,
        }));

        await addData(unidades);

        addToast({
          title: "Registro exitoso",
          description: `${unidades.length} unidades creadas correctamente`,
          color: "success",
        });
      } else {
        // Modo单个 (un solo código)
        const payload: UnidadCreate = {
          codigoUnidad: data.codigoUnidad.trim(),
          fkLote: data.fkLote ? Number(data.fkLote) : undefined,
          fkInventario: data.fkInventario ? Number(data.fkInventario) : undefined,
          fkCaracteristica: data.fkCaracteristica ? Number(data.fkCaracteristica) : undefined,
          fkUnidadMedida: data.fkUnidadMedida ? Number(data.fkUnidadMedida) : undefined,
        };

        await addData(payload);

        addToast({
          title: "Registro exitoso",
          description: "Unidad creada correctamente",
          color: "success",
        });
      }

      onClose();
      reset();
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "No se pudo guardar la unidad",
        color: "danger",
      });
    }
  };

  return (
    <Form className="w-full space-y-4" id={id} onSubmit={handleSubmit(onSubmit)}>

      {/* Switch modo múltiple */}
      <div className="flex items-center gap-2">
        <Switch isSelected={modoMultiple} onValueChange={setModoMultiple}>
          Registrar múltiples códigos
        </Switch>
      </div>

      {/* Código unidad */}
      {modoMultiple ? (
        <Textarea
          label="Códigos de unidades"
          placeholder="COD001, COD002 o uno por línea"
          {...register("codigoUnidad", { required: "Código requerido" })}
          isInvalid={!!errors.codigoUnidad}
          errorMessage={errors.codigoUnidad?.message}
          minRows={3}
        />
      ) : (
        <Input
          label="Código unidad"
          placeholder="Ingrese el código de la unidad"
          {...register("codigoUnidad", { required: "Código requerido" })}
          isInvalid={!!errors.codigoUnidad}
          errorMessage={errors.codigoUnidad?.message}
        />
      )}

      {/* ✅ SELECT LOTE (ARREGLADO) */}
      <Controller
        name="fkLote"
        control={control}
        render={({ field }) => (
          <Select
            label="Lote"
            placeholder="Seleccione un lote"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as string)}
          >
            {(lotes || []).map((lote: any) => (
              <SelectItem key={String(lote.idLote)} textValue={`${lote.codigoLote} (${lote.unidades?.length || 0}/12)`}>
                {lote.codigoLote} ({lote.unidades?.length || 0}/12)
              </SelectItem>
            ))}
          </Select>
        )}
      />

      {/* ✅ SELECT INVENTARIO */}
      <Controller
        name="fkInventario"
        control={control}
        render={({ field }) => (
          <Select
            label="Inventario"
            placeholder="Seleccione un inventario"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as string)}
          >
            {(inventarios || []).map((inv: any) => (
              <SelectItem key={String(inv.idInventario)} textValue={inv.nombre}>
                {inv.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      {/* ✅ SELECT CARACTERISTICA */}
      <Controller
        name="fkCaracteristica"
        control={control}
        render={({ field }) => (
          <Select
            label="Característica"
            placeholder="Seleccione una característica"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as string)}
          >
            {(caracteristicas || []).map((c: any) => (
              <SelectItem key={String(c.idCaracteristica)} textValue={c.nombre}>
                {c.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      {/* ✅ SELECT UNIDAD DE MEDIDA */}
      <Controller
        name="fkUnidadMedida"
        control={control}
        render={({ field }) => (
          <Select
            label="Unidad de Medida"
            placeholder="Seleccione una unidad de medida"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as string)}
          >
            {(unidades || []).map((um: any) => (
              <SelectItem key={String(um.idUnidad)} textValue={um.nombre}>
                {um.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      />
    </Form>
  );
}
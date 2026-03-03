import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem, Button } from "@heroui/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useLotes } from "@/hooks/Lotes/useLotes";
import { useCrearMateriasPrimasConLote } from "@/hooks/Lotes/useLotes";
import { MateriaPrimaCreate, MateriaPrimaCreateSchema } from "@/schemas/MateriaPrima";
import { LoteCreate } from "@/types/Lote";

// Tipo para materia prima con cantidad y costo en el lote
type MateriaPrimaWithCantidad = {
  idMateriaPrima?: number;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  fkUnidadMedida?: number;
};

// Tipo para el formulario completo
type FormData = {
  fkLote?: number;
  crearNuevoLote: boolean;
  nuevoLote?: {
    codigoLote: string;
    fechaProduccion: string;
    fechaVencimiento?: string;
    cantidadUnidades: number;
  };
  materiasPrimas: MateriaPrimaWithCantidad[];
};

type FormularioProps = {
  addData: (data: any) => Promise<void>;
  addLote?: (data: LoteCreate) => Promise<any>;
  onClose: () => void;
  id: string;
};

export default function FormularioMateriasPrimas({
  addData,
  addLote,
  onClose,
  id,
}: FormularioProps) {
  const { unidades: unidadesMedida } = useUnidad();
  const { data: lotes } = useLotes();
  const crearMateriasPrimasConLote = useCrearMateriasPrimasConLote();
  const [crearNuevoLote, setCrearNuevoLote] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      crearNuevoLote: false,
      fkLote: undefined,
      materiasPrimas: [
        {
          nombre: "",
          descripcion: "",
          cantidad: 1,
          costoUnitario: 0,
          costoTotal: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materiasPrimas",
  });

  const materiasPrimasWatch = watch("materiasPrimas");

  // Calcular costo total automáticamente
  const calcularCostoTotal = (index: number) => {
    const mp = materiasPrimasWatch[index];
    if (mp) {
      const costoTotal = (Number(mp.cantidad) || 0) * (Number(mp.costoUnitario) || 0);
      setValue(`materiasPrimas.${index}.costoTotal`, costoTotal);
    }
  };

  // Calcular total de todos los costos
  const totalCostos = materiasPrimasWatch?.reduce(
    (sum: number, mp: MateriaPrimaWithCantidad) => sum + (Number(mp.costoTotal) || 0),
    0
  ) || 0;

  const onSubmit = async (data: FormData) => {
    try {
      let loteId = data.fkLote;

      // Si hay que crear un nuevo lote
      if (data.crearNuevoLote && data.nuevoLote && addLote) {
        const nuevoLote = await addLote({
          codigoLote: data.nuevoLote.codigoLote,
          fechaProduccion: data.nuevoLote.fechaProduccion,
          fechaVencimiento: data.nuevoLote.fechaVencimiento,
          costoUnitario: 0,
        });
        loteId = nuevoLote.idLote;
      }

      // Si hay un lote seleccionado o creado, asociar las materias primas
      if (loteId) {
        // Filtrar solo las materias primas que tienen nombre
        const materiasPrimasValidas = data.materiasPrimas.filter(mp => mp.nombre && mp.nombre.trim());
        
        if (materiasPrimasValidas.length > 0) {
          await crearMateriasPrimasConLote.mutateAsync({
            fkLote: Number(loteId),
            materiasPrimas: materiasPrimasValidas.map(mp => ({
              nombre: mp.nombre,
              descripcion: mp.descripcion || '',
              cantidad: Number(mp.cantidad) || 1,
              costoUnitario: Number(mp.costoUnitario) || 0,
              fkUnidadMedida: mp.fkUnidadMedida ? Number(mp.fkUnidadMedida) : undefined,
            })),
          });
        }
      } else {
        // Si no hay lote, solo crear las materias primas como catálogo
        for (const mp of data.materiasPrimas) {
          if (mp.nombre.trim()) {
            const materiaPrimaData: MateriaPrimaCreate = {
              nombre: mp.nombre,
              descripcion: mp.descripcion || undefined,
              costoUnitario: mp.costoUnitario || 0,
              estado: true,
              fkUnidadMedida: mp.fkUnidadMedida,
            };
            await addData(materiaPrimaData);
          }
        }
      }

      onClose();
      addToast({
        title: "Registro Exitoso",
        description: `Se agregaron ${data.materiasPrimas.length} materia(s) prima(s) ${loteId ? "asociadas al lote" : ""}`,
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      addToast({
        title: "Error",
        description: "Error al guardar las materias primas",
        color: "danger",
        timeout: 3000,
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
      {/* Sección de Lote */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Asociar a Lote</h3>
        
        <div className="flex gap-2 mb-3">
          <Button
            size="sm"
            variant={!crearNuevoLote ? "solid" : "bordered"}
            color={!crearNuevoLote ? "primary" : "default"}
            onPress={() => {
              setCrearNuevoLote(false);
              setValue("crearNuevoLote", false);
            }}
          >
            Seleccionar Lote Existente
          </Button>
          <Button
            size="sm"
            variant={crearNuevoLote ? "solid" : "bordered"}
            color={crearNuevoLote ? "primary" : "default"}
            onPress={() => {
              setCrearNuevoLote(true);
              setValue("crearNuevoLote", true);
            }}
          >
            Crear Nuevo Lote
          </Button>
        </div>

        {!crearNuevoLote ? (
          <Controller
            name="fkLote"
            control={control}
            render={({ field }) => (
              <Select
                label="Lote"
                placeholder="Seleccione un lote"
                selectedKeys={field.value ? new Set([String(field.value)]) : new Set()}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  field.onChange(selected ? Number(selected) : undefined);
                }}
              >
                {(lotes || []).map((lote: any) => (
                  <SelectItem key={lote.idLote} textValue={lote.codigoLote}>
                    {lote.codigoLote}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Código Lote"
              placeholder="Ingrese el código"
              {...register("nuevoLote.codigoLote", { required: crearNuevoLote ? "El código es requerido" : false })}
              errorMessage={errors.nuevoLote?.codigoLote?.message}
              isInvalid={!!errors.nuevoLote?.codigoLote}
            />
            <Input
              label="Cantidad Unidades"
              type="number"
              placeholder="Cantidad"
              {...register("nuevoLote.cantidadUnidades", { 
                required: crearNuevoLote ? "La cantidad es requerida" : false,
                valueAsNumber: true,
                min: { value: 1, message: "Mínimo 1" }
              })}
              errorMessage={errors.nuevoLote?.cantidadUnidades?.message}
              isInvalid={!!errors.nuevoLote?.cantidadUnidades}
            />
            <Input
              label="Fecha Producción"
              type="date"
              {...register("nuevoLote.fechaProduccion", { required: crearNuevoLote ? "La fecha es requerida" : false })}
              errorMessage={errors.nuevoLote?.fechaProduccion?.message}
              isInvalid={!!errors.nuevoLote?.fechaProduccion}
            />
            <Input
              label="Fecha Vencimiento"
              type="date"
              {...register("nuevoLote.fechaVencimiento")}
            />
          </div>
        )}
      </div>

      {/* Sección de Materias Primas */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Materias Primas</h3>
        
        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Materia Prima #{index + 1}</span>
              {index > 0 && (
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => remove(index)}
                >
                  Eliminar
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre"
                placeholder="Nombre de la materia prima"
                {...register(`materiasPrimas.${index}.nombre`, { required: "El nombre es requerido" })}
                errorMessage={errors.materiasPrimas?.[index]?.nombre?.message}
                isInvalid={!!errors.materiasPrimas?.[index]?.nombre}
              />

              <Input
                label="Descripción"
                placeholder="Descripción opcional"
                {...register(`materiasPrimas.${index}.descripcion`)}
              />

              <Controller
                name={`materiasPrimas.${index}.fkUnidadMedida`}
                control={control}
                render={({ field }) => (
                  <Select
                    label="Unidad de Medida"
                    placeholder="Seleccione"
                    selectedKeys={field.value ? new Set([String(field.value)]) : new Set()}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      field.onChange(selected ? Number(selected) : undefined);
                    }}
                  >
                    {(unidadesMedida || []).map((um: any) => (
                      <SelectItem key={um.idUnidad} textValue={um.nombre}>
                        {um.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Input
                label="Cantidad"
                type="number"
                placeholder="Cantidad"
                {...register(`materiasPrimas.${index}.cantidad`, { 
                  valueAsNumber: true,
                  min: { value: 1, message: "Mínimo 1" },
                  onChange: () => calcularCostoTotal(index)
                })}
                errorMessage={errors.materiasPrimas?.[index]?.cantidad?.message}
                isInvalid={!!errors.materiasPrimas?.[index]?.cantidad}
              />

              <Input
                label="Costo Unitario"
                type="number"
                step="0.01"
                placeholder="$0.00"
                {...register(`materiasPrimas.${index}.costoUnitario`, { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Debe ser mayor o igual a 0" },
                  onChange: () => calcularCostoTotal(index)
                })}
                errorMessage={errors.materiasPrimas?.[index]?.costoUnitario?.message}
                isInvalid={!!errors.materiasPrimas?.[index]?.costoUnitario}
              />

              <Input
                label="Costo Total"
                type="number"
                isReadOnly
                value={materiasPrimasWatch?.[index]?.costoTotal?.toFixed(2) || "0.00"}
                className="bg-gray-100"
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="flat"
          color="primary"
          onPress={() => append({ nombre: "", descripcion: "", cantidad: 1, costoUnitario: 0, costoTotal: 0 })}
          className="w-full mt-2"
        >
          + Agregar Otra Materia Prima
        </Button>
      </div>

      {/* Total de costos */}
      <div className="bg-primary-50 p-4 rounded-lg">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Costos:</span>
          <span className="text-primary">${totalCostos.toFixed(2)}</span>
        </div>
      </div>
    </Form>
  );
}

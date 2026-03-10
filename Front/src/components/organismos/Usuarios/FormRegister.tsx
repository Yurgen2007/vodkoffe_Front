import { Input } from "@heroui/input";
import { addToast, Select, SelectItem, Divider } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@heroui/form";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import FormularioRoles from "../Roles/FormRegister";
import Modal from "../modal";

import Buton from "@/components/molecules/Button";
import { useRol } from "@/hooks/Roles/useRol";
import { UserSchema, User } from "@/schemas/User";

type FormularioProps = {
  addData: (user: User) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioU({ addData, onClose, id }: FormularioProps) {
  const {
    roles,
    isLoading: loadinRoles,
    isError: errorRoles,
    addRol,
  } = useRol();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const [showModalRol, setShowModalRol] = useState(false);
  const handleClose = () => setShowModalRol(false);

  // Observar el valor del rol seleccionado
  const selectedRol = watch("fkRol");

  // ID del rol de administrador (ajustar segun tu base de datos)
  const ADMIN_ROL_ID = 1;

  const isAdmin = selectedRol === ADMIN_ROL_ID;

  const onSubmit = async (data: User) => {
    console.log("Datos del formulario:", data);
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Usuario agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <>
      <Form
        className="w-full space-y-4"
        id={id}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Documento"
          placeholder="Documento"
          type="text"
          {...register("documento", { required: "El documento es requerido", valueAsNumber: true })}
          errorMessage={errors.documento?.message}
          isInvalid={!!errors.documento}
        />
        <Input
          label="Nombre"
          placeholder="Nombre"
          type="text"
          {...register("nombre", { required: "El nombre es requerido" })}
          errorMessage={errors.nombre?.message}
          isInvalid={!!errors.nombre}
        />
        <Input
          label="Apellido"
          placeholder="Apellido"
          type="text"
          {...register("apellido", { required: "El apellido es requerido" })}
          errorMessage={errors.apellido?.message}
          isInvalid={!!errors.apellido}
        />
        <Input
          label="Edad"
          placeholder="Edad"
          type="text"
          {...register("edad", { valueAsNumber: true })}
          errorMessage={errors.edad?.message}
          isInvalid={!!errors.edad}
        />
        <Input
          label="Telefono"
          placeholder="Telefono"
          type="text"
          {...register("telefono", { required: "El teléfono es requerido" })}
          errorMessage={errors.telefono?.message}
          isInvalid={!!errors.telefono}
        />
        <Input
          label="Correo"
          placeholder="Correo"
          type="email"
          {...register("correo", { required: "El correo es requerido" })}
          errorMessage={errors.correo?.message}
          isInvalid={!!errors.correo}
        />

        <Controller
          control={control}
          name="estado"
          render={({ field }) => (
            <Select
              label="Estado"
              placeholder="Selecciona estado"
              {...field}
              isDisabled
              defaultSelectedKeys={["true"]}
              errorMessage={errors.estado?.message}
              isInvalid={!!errors.estado}
              value={field.value ? "true" : "false"}
              onChange={(e) => field.onChange(e.target.value === "true")}
            >
              <SelectItem key="true" textValue="Activo">Activo</SelectItem>
              <SelectItem key="false" textValue="Inactivo">Inactivo</SelectItem>
            </Select>
          )}
        />

        {errors.estado && (
          <p className="text-red-500">{errors.estado?.message}</p>
        )}
        <Input
          label="Cargo"
          placeholder="Cargo"
          type="text"
          {...register("cargo", { required: "El cargo es requerido" })}
          errorMessage={errors.cargo?.message}
          isInvalid={!!errors.cargo}
        />
        <Input
          label="Contrasena"
          placeholder="Password"
          type="password"
          {...register("password", { required: "La contraseña es requerida" })}
          autoComplete="off"
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
        />

        {!loadinRoles && !errorRoles && roles && (
          <Controller
            control={control}
            name="fkRol"
            render={({ field }) => (
              <div className="w-full flex">
                <Select
                  errorMessage={errors.fkRol?.message}
                  isInvalid={!!errors.fkRol}
                  label="Rol"
                  placeholder="Selecciona un rol..."
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {roles?.length ? (
                    roles
                      .filter((r) => r.estado === true)
                      .map((rol) => (
                        <SelectItem key={rol.idRol} textValue={rol.nombre}>
                          {rol.nombre}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem textValue="No hay roles disponibles">No hay roles disponibles</SelectItem>
                  )}
                </Select>
                <Buton
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  type="button"
                  onPress={() => setShowModalRol(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            )}
          />
        )}

        {/* Seccion de configuracion de correo para administradores */}
        {isAdmin && (
          <>
            <Divider className="my-4" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">
                Configuracion de Correo
              </h3>
              <p className="text-sm text-gray-500">
                Configure las credenciales para el envio de notificaciones por
                correo electronico
              </p>

              <Input
                label="Servicio de correo"
                placeholder="Ej: gmail, hotmail, outlook"
                {...register("serviceMail")}
                errorMessage={errors.serviceMail?.message}
                isInvalid={!!errors.serviceMail}
              />

              <Input
                label="Correo electronico"
                type="email"
                placeholder="correo@ejemplo.com"
                {...register("mailUser")}
                errorMessage={errors.mailUser?.message}
                isInvalid={!!errors.mailUser}
              />

              <Input
                label="Contrasena / Clave de aplicacion"
                type="password"
                placeholder="Ingrese la contrasena o clave de aplicacion"
                {...register("mailPassword")}
                errorMessage={errors.mailPassword?.message}
                isInvalid={!!errors.mailPassword}
              />
            </div>
          </>
        )}
      </Form>
      <Modal
        ModalTitle="Agregar Rol"
        isOpen={showModalRol}
        onOpenChange={handleClose}
      >
        <FormularioRoles
          addData={async (data) => {
            await addRol(data);
          }}
          id="rol"
          onClose={() => setShowModalRol(false)}
        />
        <Buton form="rol" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}

import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Select, SelectItem, Divider } from "@heroui/react";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import Modal from "../modal";
import FormularioRoles from "../Roles/FormRegister";

import { useRol } from "@/hooks/Roles/useRol";
import Buton from "@/components/molecules/Button";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { UserUpdateSchema, UserUpdate } from "@/schemas/User";

type FormuProps = {
  Users: (UserUpdate & { idUsuario: number })[];
  userId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ Users, userId, id, onclose }: FormuProps) => {
  const { updateUser, getUserById } = useUsuario();
  const [showModalRol, setShowModalRol] = useState(false);
  const handleClose = () => setShowModalRol(false);

  const {
    roles,
    isLoading: loadinRoles,
    isError: errorRoles,
    addRol,
  } = useRol();

  const foundUser = getUserById(userId, Users) as UserUpdate;

  const {
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdate>({
    resolver: zodResolver(UserUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idUsuario: foundUser.idUsuario,
      nombre: foundUser.nombre,
      apellido: foundUser.apellido,
      edad: Number(foundUser.edad),
      telefono: foundUser.telefono,
      correo: foundUser.correo,
      cargo: foundUser.cargo,
      fkRol: foundUser.fkRol,
      serviceMail: foundUser.serviceMail || "",
      mailUser: foundUser.mailUser || "",
      mailPassword: foundUser.mailPassword || "",
    },
  });

  // ID del rol de administrador (ajustar segun tu base de datos)
  const ADMIN_ROL_ID = 1;
  const selectedRol = watch("fkRol");
  const isAdmin = selectedRol === ADMIN_ROL_ID || foundUser.fkRol === ADMIN_ROL_ID;

  console.log("Rol del usuario:", foundUser.fkRol, "Es admin:", isAdmin);

  const onSubmit = async (data: UserUpdate) => {
    console.log("Datos actualizados:", data);
    if (!data.idUsuario) return;
    try {
      await updateUser(data.idUsuario, data);
      onclose();
      addToast({
        title: "Actualiacion Exitosa",
        description: "Usuario actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      addToast({
        title: "Error al actualizar el usuario",
        description: "Hubo un error intentando actualizar el usuario",
        color: "danger",
      });
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
          label="Nombre"
          placeholder="Nombre"
          {...register("nombre", { required: "El nombre es requerido" })}
          errorMessage={errors.nombre?.message}
          isInvalid={!!errors.nombre}
        />
        <Input
          label="Apellido"
          placeholder="Apellido"
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
        <Input
          label="Cargo"
          placeholder="Cargo"
          {...register("cargo", { required: "El cargo es requerido" })}
          errorMessage={errors.cargo?.message}
          isInvalid={!!errors.cargo}
        />

        {!loadinRoles && !errorRoles && roles && (
          <div className="w-full flex">
            <Select
              defaultSelectedKeys={`${foundUser.fkRol}`}
              label="Rol"
              onChange={(e) => {
                const fkRol = parseInt(e.target.value);

                setValue("fkRol", isNaN(fkRol) ? undefined : fkRol);
                console.log(watch("fkRol"));
              }}
            >
              {roles?.map((rol) => (
                <SelectItem key={`${rol.idRol}`}>{rol.nombre}</SelectItem>
              ))}
            </Select>
            <Buton
              className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl flex"
              type="button"
              onPress={() => setShowModalRol(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
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
                label="Nueva contrasena / Clave de aplicacion"
                type="password"
                placeholder="Ingrese la contrasena o clave de aplicacion (solo si desea cambiarla)"
                {...register("mailPassword")}
                errorMessage={errors.mailPassword?.message}
                isInvalid={!!errors.mailPassword}
              />
            </div>
          </>
        )}

        <Buton className="w-full rounded-xl" text="Guardar" type="submit" />
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
};

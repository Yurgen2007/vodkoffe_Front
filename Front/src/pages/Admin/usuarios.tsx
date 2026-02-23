import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormRegister from "@/components/organismos/Usuarios/FormRegister";
import { FormUpdate } from "@/components/organismos/Usuarios/Formupdate";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { User, postUser } from "@/types/Usuario";

import usePermissions from "@/hooks/Usuarios/usePermissions";

const UsersTable = () => {
  const { userHasPermission } = usePermissions();

  const { users, isLoading, isError, error, addUser, changeState } =
    useUsuario();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedUser(null);
  };

  const handleGoToRol = () => {
    navigate("/admin/roles");
  };

  const handleState = async (user: User) => {
    await changeState(user.idUsuario as number);
  };

  const handleAddUser = async (user: User) => {
    try {
      // Convertir User a postUser
      const userData: postUser = {
        documento: user.documento || 0,
        nombre: user.nombre,
        apellido: user.apellido,
        edad: user.edad,
        telefono: user.telefono,
        correo: user.correo,
        estado: user.estado,
        cargo: user.cargo,
        password: user.password,
        fkRol: typeof user.fkRol === 'number' ? user.fkRol : user.fkRol?.idRol,
      };
      await addUser(userData);
      handleClose();
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<User>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "edad", label: "edad" },
    { key: "telefono", label: "telefono" },
    { key: "correo", label: "Correo" },
    { key: "cargo", label: "Cargo" },
    { key: "estado", label: "estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const usersWithKey = users
    ?.filter(
      (user): user is User & { idUsuario: number } =>
        user?.idUsuario !== undefined,
    )
    .map((user) => ({
      ...user,
      key: user.idUsuario ? user.idUsuario.toString() : crypto.randomUUID(),
      estado: Boolean(user.estado),
      // Convertir fkRol a número si es un objeto
      fkRol: typeof user.fkRol === 'number' ? user.fkRol : user.fkRol?.idRol || undefined,
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Usuarios</h1>
              <div className="flex gap-2">
                {userHasPermission(34) && ( //listar roles
                  <Buton text="Gestionar Roles" onPress={handleGoToRol} />
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar Usuario"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormRegister
          addData={handleAddUser}
          id="user-form"
          onClose={handleClose}
        />
        <div>
          <Buton
            className="w-full p-2 rounded-xl"
            form="user-form"
            text="Guardar"
            type="submit"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Usuario"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedUser && (
          <FormUpdate
            Users={usersWithKey ?? []}
            id="FormUpdate"
            onclose={handleCloseUpdate}
            userId={selectedUser.idUsuario as number}
          />
        )}
      </Modall>

      {userHasPermission(3) && usersWithKey && (
        <Globaltable
          columns={columns}
          data={usersWithKey}
          extraHeaderContent={
            <div className="flex gap-2">
              {userHasPermission(1) && (
                <Buton onPress={() => setIsOpen(true)}>Añadir usuario</Buton>
              )}
            </div>
          }
          onDelete={userHasPermission(5) ? handleState : undefined}
          onEdit={userHasPermission(4) ? handleEdit : undefined}
        />
      )}
    </div>
  );
};

export default UsersTable;

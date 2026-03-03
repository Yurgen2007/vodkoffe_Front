import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  User,
  DropdownItem,
} from "@heroui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { FormatrackLogo } from "../atoms/Icons";

import { useAuth } from "@/providers/AuthProvider";

type NavProps = {
  children?: ReactNode;
  onOpenNotifications?: () => void;
  cantidadNoLeidas?: number;
  showNotifications?: boolean;
};

export function Nav({
  children,
  onOpenNotifications,
  cantidadNoLeidas = 0,
  showNotifications = true,
}: NavProps) {
  const navigate = useNavigate();
  const { nombre, perfil } = useAuth();

  return (
    <Navbar className="bg-navbar">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <FormatrackLogo />
          <p className="hidden sm:block font-bold text-text-primary"> </p>
        </NavbarBrand>
      </NavbarContent>

      <div className="flex items-center gap-4 ms-auto">
        {showNotifications && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button
                className="relative text-text-secondary"
                onClick={onOpenNotifications}
              >
                <BellIcon className="w-6 h-6" />

                {cantidadNoLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1.5 text-xs">
                    {cantidadNoLeidas}
                  </span>
                )}
              </button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Menu de notificaciones" className="max-w-sm w-72">
              <DropdownItem
                key="notificaciones-header"
                isReadOnly
                className="font-semibold text-center"
                textValue="notificaciones"
              >
                Notificaciones
              </DropdownItem>

              <DropdownItem
                key="ver-todo"
                className="text-center text-primary hover:underline"
                textValue="ver-todo"
                onPress={onOpenNotifications}
              >
                Ver todo
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}

        <div>{children}</div>

        <User
          avatarProps={{
            src: `${import.meta.env.VITE_API_CLIENT}img/perfiles/${perfil ?? "defaultPerfil.png"}`,
            onClick: () => navigate("/perfil"),
            isBordered: true,
          }}
          name={nombre}
        />
      </div>
    </Navbar>
  );
}

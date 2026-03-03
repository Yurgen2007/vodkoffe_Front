import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import iconsConfig from "@/config/iconsConfig";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import useLogin from "@/hooks/Usuarios/useLogin";
import LoginLogo from "@/assets/login.png";

export default function Sidebar() {
  const { permissions } = useAuth();

  const mappingItems = [
    {
      id: 0,
      nombre: "Movimientos",
      icono: "HomeIcon",
      href: "/",
    },
    ...permissions,
  ];

  const [openItems, setOpenItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const { logout } = useLogin();

  return (
    <aside
      className={`h-screen ${
        collapsed ? "w-15" : "w-64"
      } bg-sidebar-bg dark:bg-zinc-800 text-sidebar-text dark:text-sidebar-text flex flex-col transition-all duration-300 border-r-2 border-[var(--color-border)] dark:border-none`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="flex justify-center py-4">
            <span className="inline-flex items-center justify-center p-1 bg-transparent border border-transparent dark:border-transparent">
              <img alt="FarmaMedica" className="w-[215px] h-[50px] object-contain dark:brightness-0 dark:invert" src={LoginLogo} />
            </span>
            <span className="inline-block"></span>
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-sidebar text-sidebar-text dark:bg-zinc-800 dark:text-sidebar-text"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>
      <nav className="space-y-2 px-1 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
        {mappingItems.map((item) => {
          const Icono = iconsConfig[item.icono] ?? BookOpenIcon;
          return (
            <div key={item.nombre}>
              <Link
                to={item.href}
                onClick={() => toggleItem(item.nombre)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                  location.pathname === item.href
                    ? "bg-primary text-white"
                    : "hover:bg-primary text-sidebar-text dark:hover:bg-primary dark:text-sidebar-text-hover"
                }`}
              >
                <Icono className="w-6 h-6" />
                {!collapsed && <span>{item.nombre}</span>}
              </Link>
              {item.rutas && openItems.includes(item.nombre) && (
                <div className="pl-6">
                  {item.rutas.map((subItem: any) => {
                    if (!subItem.listed) return;
                    const SubIcono = iconsConfig[subItem.icono] ?? BookOpenIcon;
                    return (
                      <Link
                        key={subItem.nombre}
                        to={subItem.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                          location.pathname === subItem.href
                            ? "bg-primary text-white"
                            : "hover:bg-primary text-sidebar-text dark:hover:bg-primary dark:text-sidebar-text-hover"
                        }`}
                      >
                        <SubIcono className="w-6 h-6" />
                        {!collapsed && <span>{subItem.nombre}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="flex">
        <ArrowRightStartOnRectangleIcon
          onClick={logout}
          height={26}
          className={`hover:text-red-500 cursor-pointer transition mb-4 ${collapsed ? "mx-auto" : "ms-auto me-6"}`}
        />
      </div>
    </aside>
  );
}

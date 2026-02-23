import React, { useState, useEffect } from "react";
import { Card, CardBody, Input } from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useInventario } from "@/hooks/Inventarios/useInventario";

export const InventarioDashboard = () => {
  const { inventarios, isLoading } = useInventario();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-4">
      <Card>
        <CardBody>
          <h2 className="text-2xl font-bold mb-4">Dashboard de Inventario</h2>

          {/* Buscador de Inventarios */}
          <Input
            label="Buscar Inventario"
            placeholder="Nombre del inventario..."
            startContent={
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-xl font-semibold mb-4">
            Inventarios
          </h3>

          {isLoading ? (
            <p>Cargando inventarios...</p>
          ) : !inventarios || inventarios.length === 0 ? (
            <p className="text-gray-500">No hay inventarios disponibles</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b bg-gray-100 dark:bg-zinc-700">
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {inventarios
                    .filter((inv) => 
                      !searchTerm || 
                      inv.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((inventario) => (
                      <tr
                        key={inventario.idInventario}
                        className="border-b hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition"
                      >
                        <td className="p-3 font-semibold">{inventario.nombre}</td>
                        <td className="p-3">
                          <span
                            className={`font-semibold ${inventario.estado ? "text-primary" : "text-red-600"}`}
                          >
                            {inventario.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { useMemo, useState } from "react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => JSX.Element;
}

interface TableProps<T extends { key: string; estado?: boolean | string }> {
  data: T[];
  columns: TableColumn<T>[];
  onEdit?: (item: T) => void | boolean;
  onDelete?: (item: T) => void | undefined | Promise<void>;
  showEstado?: boolean;
  showActions?: boolean;
  useDeleteInsteadOfChangeState?: boolean;
  searchValue?: (item: T) => string;
  extraHeaderContent?: React.ReactNode;
}

const Globaltable = <T extends { key: string; estado?: boolean | string }>({
  data,
  columns,
  onEdit,
  onDelete,
  showEstado = true,
  showActions = true,
  useDeleteInsteadOfChangeState = false,
  extraHeaderContent,
}: TableProps<T>) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<
    "todos" | "activos" | "inactivos"
  >("todos");

  const mostrarFiltroEstado = useMemo(() => {
    return data.some((item) => "estado" in item);
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data;

    if (mostrarFiltroEstado) {
      if (estadoFiltro === "activos") {
        result = result.filter((item) => item.estado === true);
      } else if (estadoFiltro === "inactivos") {
        result = result.filter((item) => item.estado === false);
      }
    }

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();

      result = result.filter((item) =>
        columns.some((column) => {
          const value = item[column.key];

          return value && value.toString().toLowerCase().includes(lowerSearch);
        }),
      );
    }

    return result;
  }, [searchTerm, estadoFiltro, data, columns]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleSort = (key: keyof T) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        setSortConfig({ key, direction: "desc" });
      } else if (sortConfig.direction === "desc") {
        setSortConfig({ key: null, direction: null });
      } else {
        setSortConfig({ key, direction: "asc" });
      }
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue == null || bValue == null) return 0;

      return aValue > bValue
        ? sortConfig.direction === "asc"
          ? 1
          : -1
        : aValue < bValue
          ? sortConfig.direction === "asc"
            ? -1
            : 1
          : 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 mt-4 mb-4 ">
        <div className="flex items-center gap-4">
          {extraHeaderContent}
          {mostrarFiltroEstado && (
            <Select
              aria-label="Filtro por estado"
              className="w-48"
              classNames={{
                trigger: "dark:bg-zinc-900 text-black dark:text-white",
              }}
              color="primary"
              label="Estado"
              radius="md"
              selectedKeys={[estadoFiltro]}
              size="sm"
              variant="flat"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as
                  | "todos"
                  | "activos"
                  | "inactivos";

                setEstadoFiltro(selected);
              }}
            >
              <SelectItem key="activos" textValue="activos">
                Activos
              </SelectItem>
              <SelectItem key="inactivos" textValue="inactivos">
                Inactivos
              </SelectItem>
              <SelectItem key="todos" textValue="todos">
                Todos
              </SelectItem>
            </Select>
          )}
        </div>
        <div className="flex">
          <Input
            isClearable
            className="w-64"
            label="Buscar"
            radius="lg"
            startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
        </div>
      </div>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="text-sm text-muted-foreground">{`Total ${data.length} elementos`}</div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-muted-foreground">
            Filas por pagina:
          </label>
          <select
            className="bg-transparent text-sm dark:bg-zinc-900 text-black dark:text-white border-none focus:outline-none"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {[5, 10, 15, 20].map((value) => (
              <option
                key={value}
                className="dark:bg-zinc-900 text-black dark:text-white"
                value={value}
              >
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Table aria-label="Example table with dynamic content">
        <TableHeader
          columns={
            showActions
              ? [...columns, { key: "actions", label: "Acciones" }]
              : columns
          }
        >
          {(column) => (
            <TableColumn
              key={column.key.toString()}
              className="text-center"
              onClick={() => {
                if (column.key !== "actions") {
                  handleSort(column.key as keyof T);
                }
              }}
            >
              <div className="inline-flex items-center justify-center gap-1">
                <span>{column.label}</span>
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedData}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => {
                return (
                  <TableCell className="text-center">
                    {(() => {
                      if (columnKey === "estado" && showEstado) {
                        return (
                          <Chip
                            className={`px-2 py-1 rounded ${
                              item.estado ? "text-primary" : "text-red-500"
                            }`}
                            color={item.estado ? "success" : "danger"}
                            variant="flat"
                          >
                            {item.estado ? "Activo" : "Inactivo"}
                          </Chip>
                        );
                      }

                      if (columnKey === "actions" && showActions) {
                        return (
                          <div className="flex gap-2 justify-center">
                            {onEdit && (
                              <button onClick={() => onEdit(item)}>
                                <PencilIcon className="h-5 w-5 text-primary" />
                              </button>
                            )}
                            {onDelete && (
                              <button onClick={() => onDelete?.(item)}>
                                {useDeleteInsteadOfChangeState ? (
                                  <TrashIcon className="h-5 w-5 text-red-500" />
                                ) : item.estado ? (
                                  <TrashIcon className="h-5 w-5 text-red-500" />
                                ) : (
                                  <CheckIcon className="h-5 w-5 text-primary" />
                                )}
                              </button>
                            )}
                          </div>
                        );
                      }

                      const column = columns.find((c) => c.key === columnKey);

                      if (column?.render) return column.render(item);

                      const value = getKeyValue(item, columnKey);

                      if (typeof value === "object" && value !== null) {
                        if ("codigo" in value && "fecha_creacion" in value) {
                          return `${value.codigo} (${value.fecha_creacion})`;
                        }

                        return JSON.stringify(value);
                      }

                      if (value === null || value === undefined) return "—";

                      return value.toString();
                    })()}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-muted-foreground whitespace-nowrap pt-4 pl-2 pr-18">
          Pagina {page} de {totalPages}
        </div>
        <div className="flex justify-center w-full max-w-[300px] mx-auto">
          <Pagination
            isCompact
            showControls
            showShadow
            className="items-center"
            color="primary"
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </div>
        <div className="flex gap-2 ">
          <Button
            className=" dark:bg-zinc-900 text-black dark:text-white"
            isDisabled={page === 1}
            size="sm"
            variant="flat"
            onPress={handlePreviousPage}
          >
            Previous
          </Button>
          <Button
            className="dark:bg-zinc-900 text-black dark:text-white"
            isDisabled={page === totalPages}
            size="sm"
            variant="flat"
            onPress={handleNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Globaltable;

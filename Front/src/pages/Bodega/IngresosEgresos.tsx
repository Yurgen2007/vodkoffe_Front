import { Card, CardBody, Button } from '@heroui/react';
import { useLotes } from '@/hooks/Lotes/useLotes';
import usePermissions from '@/hooks/Usuarios/usePermissions';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import Globaltable from '@/components/organismos/table';
import { TableColumn } from '@/components/organismos/table';
import { formatNumber } from '@/utils/formatNumber';

export const IngresosEgresosPage = () => {
  const { userHasPermission } = usePermissions();
  const { data: lotes, isLoading, error, refetch } = useLotes();

  // Función para exportar a Excel
  const exportarExcel = async () => {
    // Forzar actualización de datos antes de exportar
    const { data: lotesActualizados } = await refetch();
    
    console.log('Exportando Excel - Lotes:', lotesActualizados);
    
    if (!lotesActualizados || lotesActualizados.length === 0) {
      alert('No hay datos de lotes para exportar');
      return;
    }

    // Verificar si hay movimientos
    const totalMovimientos = lotesActualizados.reduce((sum: number, lote: any) => {
      return sum + (lote.movimientos?.length || 0);
    }, 0);
    console.log('Total movimientos:', totalMovimientos);
    
    // Ver datos del primer lote para debug
    if (lotesActualizados && lotesActualizados.length > 0) {
      console.log('Primer lote:', lotesActualizados[0]);
      if (lotesActualizados[0].movimientos && lotesActualizados[0].movimientos.length > 0) {
        console.log('Primer movimiento:', lotesActualizados[0].movimientos[0]);
      }
    }

    // 1. Resumen general
    const resumenData: any[] = [
      { A: 'RESUMEN GENERAL DE INGRESOS Y EGRESOS', B: '' },
      { A: '', B: '' },
      { A: 'Ingresos Totales', B: totalIngresos },
      { A: 'Egresos Totales (Costo Materias Primas)', B: totalEgresos },
      { A: 'Ganancias Totales', B: totalGanancias },
      { A: '', B: '' },
      { A: 'Total de Lotes', B: lotesActualizados.length },
      { A: 'Total de Movimientos', B: totalMovimientos },
    ];

    // 2. Información detallada por CADA LOTE (lote + sus movimientos)
    const detallePorLoteData: any[] = [
      { 
        A: 'DETALLE POR CADA LOTE - INFORMACIÓN COMPLETA', 
        B: '', 
        C: '', 
        D: '', 
        E: '', 
        F: '', 
        G: '', 
        H: '', 
        I: '' 
      },
      { 
        A: 'Código Lote', 
        B: 'Fecha Creación', 
        C: 'Estado', 
        D: 'Costo Materias Primas', 
        E: 'Cliente', 
        F: 'Fecha Movimiento', 
        G: 'Tipo', 
        H: 'Cantidad', 
        I: 'Precio Total (Ingreso)'
      },
    ];

    // Por cada lote, mostrar sus datos + todos sus movimientos
    (lotesActualizados || []).forEach((lote: any) => {
      // Calcular costo de materias primas desde los datos reales
      const materiasDelLote = (lote.materiasPrimas as any[]) || [];
      const costoLote = materiasDelLote.reduce(
        (sum: number, mp: any) => sum + (Number(mp.costoTotal) || 0),
        0
      );
      const fechaCreacion = lote.createdAt ? new Date(lote.createdAt).toLocaleDateString('es-CO') : '-';
      const estado = lote.estado ? 'Activo' : 'Inactivo';
      
      // Si tiene movimientos, mostrar cada uno
      if (lote.movimientos && lote.movimientos.length > 0) {
        // Calcular la proporción del costo por cada unidad del lote
        const totalUnidadesVendidas = lote.movimientos.reduce(
          (sum: number, m: any) => sum + ((Number(m.cantidadVendida) || 0) + (Number(m.cantidadDegustacion) || 0) + (Number(m.cantidadAlianza) || 0)), 
          0
        );
        const costoPorUnidad = totalUnidadesVendidas > 0 ? costoLote / totalUnidadesVendidas : 0;

        lote.movimientos.forEach((mov: any) => {
          const cantidad = (Number(mov.cantidadVendida) || 0) + (Number(mov.cantidadDegustacion) || 0) + (Number(mov.cantidadAlianza) || 0);
          const ingreso = Number(mov.precioTotal) || 0;
          const egreso = costoPorUnidad * cantidad;
          const ganancia = ingreso - egreso;

          detallePorLoteData.push({
            A: lote.codigoLote,
            B: fechaCreacion,
            C: estado,
            D: costoLote,
            E: mov.nombreCliente || '-',
            F: mov.fechaMovimiento ? new Date(mov.fechaMovimiento).toLocaleDateString('es-CO') : '-',
            G: mov.tipo,
            H: cantidad,
            I: ingreso,
          });
        });
      } else {
        // Si no tiene movimientos, mostrar el lote sin venta
        detallePorLoteData.push({
          A: lote.codigoLote,
          B: fechaCreacion,
          C: estado,
          D: costoLote,
          E: '-',
          F: '-',
          G: 'SIN VENTAS',
          H: 0,
          I: 0,
        });
      }
    });

    // 3. Resumen por lote (totales)
    const resumenLotesData: any[] = [
      { A: 'RESUMEN POR LOTE', B: '', C: '', D: '', E: '', F: '' },
      { A: 'Código Lote', B: 'Costo Materias Primas', C: 'Ingresos', D: 'Egresos', E: 'Ganancias', F: 'Estado' },
    ];

    (lotesActualizados || []).forEach((lote: any) => {
      // Egresos: suma del costoTotal de las materias primas del lote
      const materiasDelLote = (lote.materiasPrimas as any[]) || [];
      const egresos = materiasDelLote.reduce(
        (sum: number, mp: any) => sum + (Number(mp.costoTotal) || 0),
        0
      );
      const ingresos = (lote.movimientos || []).reduce((sum: number, mov: any) => {
        return sum + (Number(mov.precioTotal) || 0);
      }, 0);
      const ganancias = ingresos - egresos;

      resumenLotesData.push({
        A: lote.codigoLote,
        B: egresos,
        C: ingresos,
        D: egresos,
        E: ganancias,
        F: lote.estado ? 'Activo' : 'Inactivo',
      });
    });

    // Fila de totales
    resumenLotesData.push({
      A: 'TOTALES',
      B: totalEgresos,
      C: totalIngresos,
      D: totalEgresos,
      E: totalGanancias,
      F: '',
    });

    // Crear workbook
    const wb = XLSX.utils.book_new();

    // Crear hojas
    const wsResumen = XLSX.utils.json_to_sheet(resumenData);
    const wsDetalle = XLSX.utils.json_to_sheet(detallePorLoteData);
    const wsResumenLotes = XLSX.utils.json_to_sheet(resumenLotesData);

    // ==================== FORMATEAR HOJA RESUMEN ====================
    // Ajustar ancho de columnas
    wsResumen['!cols'] = [
      { wch: 35 }, // Columna A
      { wch: 20 }, // Columna B
    ];

    // ==================== FORMATEAR HOJA DETALLE ====================
    wsDetalle['!cols'] = [
      { wch: 15 }, // Código Lote
      { wch: 15 }, // Fecha Creación
      { wch: 10 }, // Estado
      { wch: 20 }, // Costo Materias Primas
      { wch: 20 }, // Cliente
      { wch: 15 }, // Fecha Movimiento
      { wch: 12 }, // Tipo
      { wch: 12 }, // Cantidad
      { wch: 18 }, // Precio Total
    ];

    // ==================== FORMATEAR HOJA RESUMEN LOTES ====================
    wsResumenLotes['!cols'] = [
      { wch: 15 }, // Código Lote
      { wch: 20 }, // Costo Materias Primas
      { wch: 15 }, // Ingresos
      { wch: 15 }, // Egresos
      { wch: 15 }, // Ganancias
      { wch: 10 }, // Estado
    ];

    // Agregar hojas al workbook
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle por Lote');
    XLSX.utils.book_append_sheet(wb, wsResumenLotes, 'Resumen por Lote');

    // Generar archivo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Descargar archivo
    const fecha = new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
    saveAs(blob, `Ingresos_Egresos_${fecha}.xlsx`);
  };

  // Calcular totales
  const totalIngresos = (lotes || []).reduce((sum: number, lote: any) => {
    const movimientos = lote.movimientos || [];
    return sum + movimientos.reduce((subSum: number, mov: any) => {
      return subSum + (Number(mov.precioTotal) || 0);
    }, 0);
  }, 0);

  const totalEgresos = (lotes || []).reduce((sum: number, lote: any) => {
    const materias = lote.materiasPrimas || [];
    return sum + materias.reduce((subSum: number, mp: any) => {
      return subSum + (Number(mp.costoTotal) || 0);
    }, 0);
  }, 0);

  const totalGanancias = totalIngresos - totalEgresos;

  // Columnas para la tabla
  const columns: TableColumn<any>[] = [
    { key: 'codigoLote', label: 'Código Lote' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (lote: any) => (
        <span className={`px-2 py-1 rounded text-sm ${lote.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {lote.estado ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'ingresos',
      label: 'Ingresos',
      render: (lote: any) => {
        const ingresos = (lote.movimientos || []).reduce((sum: number, mov: any) => sum + (Number(mov.precioTotal) || 0), 0);
        return <span className="font-semibold text-green-600">${formatNumber(ingresos)}</span>;
      },
    },
    {
      key: 'egresos',
      label: 'Egresos',
      render: (lote: any) => {
        const materias = lote.materiasPrimas || [];
        const egresos = materias.reduce((sum: number, mp: any) => sum + (Number(mp.costoTotal) || 0), 0);
        return <span className="font-semibold text-red-600">${formatNumber(egresos)}</span>;
      },
    },
    {
      key: 'ganancia',
      label: 'Ganancia',
      render: (lote: any) => {
        const materias = lote.materiasPrimas || [];
        const egresos = materias.reduce((sum: number, mp: any) => sum + (Number(mp.costoTotal) || 0), 0);
        const ingresos = (lote.movimientos || []).reduce((sum: number, mov: any) => sum + (Number(mov.precioTotal) || 0), 0);
        const ganancia = ingresos - egresos;
        return (
          <span className={`font-semibold ${ganancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${formatNumber(ganancia)}
          </span>
        );
      },
    },
  ];

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Ingresos y Egresos</h1>
              <Button
                color="primary"
                startContent={<Download size={18} />}
                onPress={exportarExcel}
              >
                Exportar Excel
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Resumen de totales */}
      <div className="grid grid-cols-3 gap-4 pb-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Ingresos Totales</p>
            <p className="text-2xl font-bold text-green-600">${formatNumber(totalIngresos)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Egresos Totales</p>
            <p className="text-2xl font-bold text-red-600">${formatNumber(totalEgresos)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Ganancia Total</p>
            <p className={`text-2xl font-bold ${totalGanancias >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${formatNumber(totalGanancias)}
            </p>
          </CardBody>
        </Card>
      </div>

      <Globaltable columns={columns} data={lotes || []} showActions={false} />
    </div>
  );
};

import { supabase } from './supabaseClient.js';

export async function cargarDatos() {
  const tabla = document.getElementById('tablaSurtido');

  const url = 'https://iexiqtweyghgmnpxtdzc.supabase.co/rest/v1/App_Surtido?select=' +
    encodeURIComponent(`Remision,SKU,Descripcion,Seccion,Jefe_Piso,Nome_Usuario,Cantidad,Fecha_Hora_Assignacion_Tienda,"Tipo Orden",Fecha_Hora_Emission,"Hora Status"`) +
    '&limit=100';

  const res = await fetch(url, {
    headers: {
      apikey: supabase.supabaseKey || '', // opcional si tienes export de key
      Authorization: `Bearer ${supabase.supabaseKey || ''}`
    }
  });

  const data = await res.json();

  if (!res.ok || !data) {
    console.error("Error al cargar datos:", data);
    tabla.innerHTML = "<p class='p-4 text-center text-red-500'>Error al cargar datos.</p>";
    return;
  }

  if (data.length === 0) {
    tabla.innerHTML = "<p class='p-4 text-center text-gray-500'>No hay datos disponibles.</p>";
    return;
  }

  let html = `
    <table class="min-w-full text-sm">
      <thead>
        <tr class="bg-pink-500 text-white">
          <th class="p-2">Remisión</th>
          <th class="p-2">SKU</th>
          <th class="p-2">Descripción</th>
          <th class="p-2">Sección</th>
          <th class="p-2">Nombre del jefe</th>
          <th class="p-2">Nombre del vendedor</th>
          <th class="p-2">Cantidad</th>
          <th class="p-2">Fecha asignación a tienda</th>
          <th class="p-2">Tipo Orden</th>
          <th class="p-2">Tiempo Surtido</th>
          <th class="p-2">Hora C-Xec</th>
          <th class="p-2">Proceso 2hrs</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {
    const tiempo = calcularTiempoSurtido(row["Fecha_Hora_Emission"], row["Fecha_Hora_Assignacion_Tienda"]);
    const proceso = evaluar2Horas(row["Fecha_Hora_Emission"], row["Fecha_Hora_Assignacion_Tienda"]);

    html += `
      <tr class="border-b hover:bg-pink-50">
        <td class="p-2">${row["Remision"] ?? ''}</td>
        <td class="p-2">${row["SKU"] ?? ''}</td>
        <td class="p-2">${row["Descripcion"] ?? ''}</td>
        <td class="p-2">${row["Seccion"] ?? ''}</td>
        <td class="p-2">${row["Jefe_Piso"] ?? ''}</td>
        <td class="p-2">${row["Nome_Usuario"] ?? ''}</td>
        <td class="p-2">${row["Cantidad"] ?? ''}</td>
        <td class="p-2">${row["Fecha_Hora_Assignacion_Tienda"]?.split('T')[0] ?? ''}</td>
        <td class="p-2">${row["Tipo Orden"] ?? ''}</td>
        <td class="p-2">${tiempo}</td>
        <td class="p-2">${row["Hora Status"] ?? ''}</td>
        <td class="p-2 text-center">${proceso}</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  tabla.innerHTML = html;
}

// Funciones auxiliares
function calcularTiempoSurtido(emision, asignacion) {
  if (!emision || !asignacion) return '';
  const inicio = new Date(emision);
  const fin = new Date(asignacion);
  const diffHrs = (fin - inicio) / (1000 * 60 * 60);
  return `${diffHrs.toFixed(1)} hrs`;
}

function evaluar2Horas(emision, asignacion) {
  if (!emision || !asignacion) return '';
  const inicio = new Date(emision);
  const fin = new Date(asignacion);
  const diffHrs = (fin - inicio) / (1000 * 60 * 60);
  return diffHrs > 2 ? '❌' : '✅';
}
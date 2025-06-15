import { supabase } from './supabaseClient.js'

function calcularTiempoSurtido(emision, asignacion) {
  if (!emision || !asignacion) return '';
  const inicio = new Date(emision)
  const fin = new Date(asignacion)
  const diffHrs = (fin - inicio) / (1000 * 60 * 60)
  return `${diffHrs.toFixed(1)} hrs`
}

function evaluar2Horas(emision, asignacion) {
  if (!emision || !asignacion) return '';
  const inicio = new Date(emision)
  const fin = new Date(asignacion)
  const diffHrs = (fin - inicio) / (1000 * 60 * 60)
  return diffHrs > 2 ? '❌' : '✅'
}

async function cargarDatos() {
  const { data, error } = await supabase
    .from('App_Surtido')
    .select(`
      Remision, SKU, Descripcion, Seccion, Jefe_Piso, Nome_Usuario, Cantidad,
      Fecha_Hora_Assignacion_Tienda, Tipo Orden, Fecha_Hora_Emission, Hora Status
    `)
    .limit(100)

  const tabla = document.getElementById('tablaSurtido')

  if (error || !data) {
    console.error("Error al cargar datos:", error)
    tabla.innerHTML = "<p class='p-4 text-center text-red-500'>Error al cargar datos.</p>"
    return
  }

  if (data.length === 0) {
    tabla.innerHTML = "<p class='p-4 text-center text-gray-500'>No hay datos disponibles.</p>"
    return
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
  `

  data.forEach(row => {
    const tiempo = calcularTiempoSurtido(row.Fecha_Hora_Emission, row.Fecha_Hora_Assignacion_Tienda)
    const proceso = evaluar2Horas(row.Fecha_Hora_Emission, row.Fecha_Hora_Assignacion_Tienda)

    html += `
      <tr class="border-b hover:bg-pink-50">
        <td class="p-2">${row.Remision ?? ''}</td>
        <td class="p-2">${row.SKU ?? ''}</td>
        <td class="p-2">${row.Descripcion ?? ''}</td>
        <td class="p-2">${row.Seccion ?? ''}</td>
        <td class="p-2">${row.Jefe_Piso ?? ''}</td>
        <td class="p-2">${row.Nome_Usuario ?? ''}</td>
        <td class="p-2">${row.Cantidad ?? ''}</td>
        <td class="p-2">${row.Fecha_Hora_Assignacion_Tienda?.split('T')[0] ?? ''}</td>
        <td class="p-2">${row["Tipo Orden"] ?? ''}</td>
        <td class="p-2">${tiempo}</td>
        <td class="p-2">${row["Hora Status"] ?? ''}</td>
        <td class="p-2 text-center">${proceso}</td>
      </tr>`
  })

  html += `</tbody></table>`
  tabla.innerHTML = html
}

cargarDatos()

document.getElementById("btnSubirCSV").addEventListener("click", async () => {
  const fileInput = document.getElementById("csvUploader")
  const file = fileInput.files[0]

  if (!file) {
    alert("Por favor selecciona un archivo CSV.")
    return
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async function (results) {
      const rows = results.data

      // Validación básica
      if (!rows.length || !rows[0].Remision || !rows[0].SKU) {
        alert("El CSV no tiene datos válidos o encabezados correctos.")
        return
      }

      // Insertar por bloques de 100
      const chunkSize = 100
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize)
        const { error } = await supabase.from("App_Surtido").insert(chunk)

        if (error) {
          console.error("Error al insertar:", error)
          alert("Error al subir los datos. Ver consola.")
          return
        }
      }

      alert("✅ Datos cargados correctamente.")
      cargarDatos() // Recarga tabla
      fileInput.value = "" // Limpia input
    }
  })
})

await supabase.from("App_Surtido").insert([{
  Remision: 1001,
  SKU: 123456,
  Descripcion: "Producto de prueba",
  Seccion: 1,
  Jefe_Piso: "Juan Pérez",
  Nome_Usuario: "María López",
  Cantidad: 10,
  Fecha_Hora_Assignacion_Tienda: new Date().toISOString(),
  "Tipo Orden": "Normal",
  Fecha_Hora_Emission: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  "Hora Status": "10:00"
}])
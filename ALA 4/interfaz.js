const obtenerEntrada = (pregunta) => new Promise(resolve => rl.question(pregunta, resolve));
const limpiarYMostrar = (texto) => { console.clear(); console.log(texto); };

async function agregarTareaIO() {
    limpiarYMostrar("Agregar una nueva tarea");
    
    const titulo = await obtenerEntrada("Título (máx. 100): ");
    if (titulo.length === 0) {
        console.log("El título no puede estar vacío.");
        return menu();
    }
    
    const descripcion = await obtenerEntrada("Descripción (máx. 500): ");
    const vencimientoStr = await obtenerEntrada("Vencimiento (aaaa-mm-dd, opcional): ");
    const opcionEstado = await obtenerEntrada(`Estado (${Object.values(ESTADOS).map((e, i) => `${i + 1}. ${e}`).join(" / ")}): `);
    const opcionDificultad = await obtenerEntrada(`Dificultad (${Object.values(DIFICULTADES).map((d, i) => `${i + 1}. ${d}`).join(" / ")}): `);
    
    // Determinar valores
    const estadoKeys = Object.keys(ESTADOS);
    const estado = ESTADOS[estadoKeys[parseInt(opcionEstado) - 1]] || ESTADOS.PENDIENTE;

    const dificultadKeys = Object.keys(DIFICULTADES);
    const dificultad = DIFICULTADES[dificultadKeys[parseInt(opcionDificultad) - 1]] || DIFICULTADES.FACIL;

    const vencimiento = vencimientoStr ? new Date(vencimientoStr) : null;
    
    
    globalId++;
    const nuevaTarea = crearTarea(globalId, titulo, descripcion, vencimiento, estado, dificultad);
    globalTareas = agregarTareaALista(globalTareas, nuevaTarea);

    console.clear();
    console.log("Tarea agregada exitosamente. ID:", globalId);
    menu();
}

async function editarTareaIO(tareaOriginal) {
    limpiarYMostrar(`Editar tarea - ID: ${tareaOriginal.id} (Deje vacío para no cambiar)`);

    const nuevoTitulo = await obtenerEntrada(`Título actual (${tareaOriginal.titulo}): `);
    const nuevaDesc = await obtenerEntrada(`Descripción actual (${tareaOriginal.descripcion || "vacío"}): `);
    const nuevoVencStr = await obtenerEntrada(`Vencimiento actual (${tareaOriginal.vencimiento ? tareaOriginal.vencimiento.toLocaleDateString() : "vacío"}): `);
    
    console.log(`Estado actual: ${tareaOriginal.estado}`);
    const opcionEstado = await obtenerEntrada(`Nuevo Estado (${Object.values(ESTADOS).map((e, i) => `${i + 1}. ${e}`).join(" / ")}): `);

    console.log(`Dificultad actual: ${tareaOriginal.dificultad}`);
    const opcionDificultad = await obtenerEntrada(`Nueva Dificultad (${Object.values(DIFICULTADES).map((d, i) => `${i + 1}. ${d}`).join(" / ")}): `);

    // **Lógica Pura:**
    const cambios = {};
    if (nuevoTitulo.length > 0) cambios.titulo = nuevoTitulo;
    if (nuevaDesc.length > 0) cambios.descripcion = nuevaDesc === '--' ? '' : nuevaDesc;

    if (nuevoVencStr.length > 0) {
        cambios.vencimiento = nuevoVencStr === '--' ? null : new Date(nuevoVencStr);
    }
    
    const estadoKeys = Object.keys(ESTADOS);
    const nuevoEstado = ESTADOS[estadoKeys[parseInt(opcionEstado) - 1]];
    if (nuevoEstado) cambios.estado = nuevoEstado;

    const dificultadKeys = Object.keys(DIFICULTADES);
    const nuevaDificultad = DIFICULTADES[dificultadKeys[parseInt(opcionDificultad) - 1]];
    if (nuevaDificultad) cambios.dificultad = nuevaDificultad;

    globalTareas = actualizarTareaEnLista(globalTareas, tareaOriginal.id, cambios);

    // Mostrar detalles de la tarea actualizada para confirmación
    const tareaActualizada = buscarTareaPorId(globalTareas, tareaOriginal.id);
    limpiarYMostrar("✅ Tarea actualizada correctamente:");
    
    if (tareaActualizada) {
        console.log(`ID: ${tareaActualizada.id}`);
        console.log(`Título: ${tareaActualizada.titulo}`);
        console.log(`Descripción: ${tareaActualizada.descripcion}`);
        console.log(`Estado: ${tareaActualizada.estado}`);
        console.log(`Creación: ${tareaActualizada.creacion.toLocaleString()}`);
        console.log(`Vencimiento: ${tareaActualizada.vencimiento ? tareaActualizada.vencimiento.toLocaleDateString() : "N/A"}`);
        console.log(`Última Edición: ${tareaActualizada.ultimaEdicion.toLocaleString()}`);
        console.log(`Dificultad: ${tareaActualizada.dificultad}`);
    }

    const respuesta = await obtenerEntrada("0 para volver a la lista, cualquier otra tecla para volver al menú principal: ");
    respuesta === "0" ? verTareasIO() : menu();
}

async function mostrarListaYDetallesIO(lista, volverFunc = menu) {
    if (lista.length === 0) {
        limpiarYMostrar("No hay tareas que mostrar...");
        const respuesta = await obtenerEntrada("0 para volver, cualquier otra tecla para menú principal: ");
        return respuesta === "0" ? volverFunc() : menu();
    }

    limpiarYMostrar("📋 Lista de Tareas:");
    lista.map(t => console.log(` ${t.id} - ${t.titulo} (${t.estado})`));

    const idTarea = await obtenerEntrada("Ingrese el ID de la tarea para ver detalles o 0 para volver: ");
    if (idTarea === "0") return volverFunc();
    
    const idNum = parseInt(idTarea);
    // **Lógica Pura:** Buscar la tarea
    const tarea = buscarTareaPorId(lista, idNum);

    if (tarea) {
        limpiarYMostrar("Detalles de la tarea:");
        console.log(`ID: ${tarea.id}`);
        console.log(`Título: ${tarea.titulo}`);
        console.log(`Descripción: ${tarea.descripcion || "N/A"}`);
        console.log(`Estado: ${tarea.estado}`);
        console.log(`Creación: ${tarea.creacion.toLocaleString()}`);
        console.log(`Vencimiento: ${tarea.vencimiento ? tarea.vencimiento.toLocaleDateString() : "N/A"}`);
        console.log(`Última Edición: ${tarea.ultimaEdicion.toLocaleString()}`);
        console.log(`Dificultad: ${tarea.dificultad}`);
        
        console.log("\n1 para editar");
        console.log("0 para volver a la lista");
        const opcion = await obtenerEntrada("Seleccione una opción (cualquier otra tecla para menú principal): ");

        switch (opcion) {
            case "1": return editarTareaIO(tarea);
            case "0": return mostrarListaYDetallesIO(lista, volverFunc);
            default: return menu();
        }
    } else {
        console.log("ID no válido.");
        const respuesta = await obtenerEntrada("0 para volver a la lista, otra tecla para menú principal: ");
        return respuesta === "0" ? mostrarListaYDetallesIO(lista, volverFunc) : menu();
    }
}

async function verTareasIO() {
    limpiarYMostrar("¿Qué tareas deseas ver?");
    console.log("1. Todas las tareas");
    console.log(`2. ${ESTADOS.PENDIENTE}`);
    console.log(`3. ${ESTADOS.EN_CURSO}`);
    console.log(`4. ${ESTADOS.TERMINADA}`);
    console.log(`5. ${ESTADOS.CANCELADA}`);
    console.log("0. Volver al menú principal");

    const opcion = await obtenerEntrada("Seleccione una opción: ");

    let listaFiltrada = [];
    // **Lógica Pura:** Determinar la lista filtrada
    switch (opcion) {
        case "1":
            listaFiltrada = globalTareas;
            break;
        case "2":
            listaFiltrada = filtrarTareasPorEstado(globalTareas, ESTADOS.PENDIENTE);
            break;
        case "3":
            listaFiltrada = filtrarTareasPorEstado(globalTareas, ESTADOS.EN_CURSO);
            break;
        case "4":
            listaFiltrada = filtrarTareasPorEstado(globalTareas, ESTADOS.TERMINADA);
            break;
        case "5":
            listaFiltrada = filtrarTareasPorEstado(globalTareas, ESTADOS.CANCELADA);
            break;
        case "0":
            return menu();
        default:
            console.log("Opción no válida.");
            return verTareasIO();
    }
    
    return mostrarListaYDetallesIO(listaFiltrada, verTareasIO);
}

async function buscarTareaIO() {
    limpiarYMostrar("Buscar Tarea por Título");
    const busqueda = await obtenerEntrada("Ingrese el título de la tarea: ");
    
    if (busqueda.length === 0) {
        console.log("Debe ingresar algún título para buscar.");
        return buscarTareaIO();
    }

    // **Lógica Pura:** Obtener resultados
    const resultados = buscarTareasPorTitulo(globalTareas, busqueda);

    if (resultados.length === 0) {
        console.log(`No se encontraron tareas con el título "${busqueda}".`);
        const respuesta = await obtenerEntrada("0 Para volver al menú, presione cualquier tecla para reintentar: ");
        return respuesta === "0" ? menu() : buscarTareaIO();
    } else {
        console.log(`Tareas encontradas (${resultados.length}):`);
        // Usamos buscarTareaIO como función de retorno para mantener el contexto
        return mostrarListaYDetallesIO(resultados, buscarTareaIO);
    }
}

async function menu() {
    limpiarYMostrar("Gestor de Tareas en JS (Programación Funcional)");
    console.log("1. Ver tareas");
    console.log("2. Buscar una tarea por título");
    console.log("3. Agregar una tarea");
    console.log("0. Salir");

    const opcion = await obtenerEntrada("Seleccione una opción: ");
    
    // **Flujo de control (Impuro)**
    switch (opcion) {
        case "1": return verTareasIO();
        case "2": return buscarTareaIO();
        case "3": return agregarTareaIO();
        case "0":
            console.log("Saliendo...");
            return rl.close();
        default:
            console.log("Opción no válida");
            return menu();
    }
}

// Iniciar la aplicación
menu();
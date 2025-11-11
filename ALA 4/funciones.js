/**
 * Crea un nuevo objeto de tarea inmutable.
 * @param {string} titulo
 * @param {string} descripcion
 * @param {Date | null} vencimiento
 * @param {string} estado
 * @param {string} dificultad
 * @param {number} id
 * @returns {Readonly<object>}
 */
const crearTarea = (id, titulo, descripcion, vencimiento, estado, dificultad) => {
    const ahora = new Date();
    const nuevaTarea = {
        id: id,
        titulo: titulo.substring(0, 100),
        descripcion: descripcion.substring(0, 500),
        estado: estado || ESTADOS.PENDIENTE,
        creacion: ahora,
        ultimaEdicion: ahora,
        vencimiento: vencimiento,
        dificultad: dificultad || DIFICULTADES.FACIL
    };
    return Object.freeze(nuevaTarea);
};
/**
 * Agrega una nueva tarea a la lista (devuelve una nueva lista).
 * @param {Readonly<object[]>} tareas - Lista de tareas actual (inmutable).
 * @param {Readonly<object>} nuevaTarea - La tarea a agregar.
 * @returns {Readonly<object[]>} Nueva lista de tareas.
 */
const agregarTareaALista = (tareas, nuevaTarea) => {
    // Retorna una nueva lista con la nueva tarea al final
    return Object.freeze([...tareas, nuevaTarea]);
};

/**
 * Busca una tarea por ID.
 * @param {Readonly<object[]>} tareas - Lista de tareas (inmutable).
 * @param {number} id - El ID de la tarea a buscar.
 * @returns {Readonly<object> | undefined} La tarea encontrada o undefined.
 */
const buscarTareaPorId = (tareas, id) => {
    return tareas.find(tarea => tarea.id === id);
};

/**
 * Busca tareas por un título (coincidencia exacta e insensible a mayúsculas).
 * @param {Readonly<object[]>} tareas - Lista de tareas (inmutable).
 * @param {string} busqueda - Título a buscar.
 * @returns {Readonly<object[]>} Una nueva lista con los resultados.
 */
const buscarTareasPorTitulo = (tareas, busqueda) => {
    const busquedaLower = busqueda.toLowerCase();
    return Object.freeze(
        tareas.filter(tarea => tarea.titulo.toLowerCase() === busquedaLower)
    );
};
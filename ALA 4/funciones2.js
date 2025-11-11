/**
 * Filtra tareas por estado.
 * @param {Readonly<object[]>} tareas - Lista de tareas (inmutable).
 * @param {string} estado - El estado por el cual filtrar. 
 * @returns {Readonly<object[]>} Nueva lista de tareas filtradas.
 */
const filtrarTareasPorEstado = (tareas, estado) => {
    return Object.freeze(
        tareas.filter(tarea => tarea.estado === estado)
    );
};

/**
 * Genera una nueva versión de la tarea con los campos actualizados.
 * @param {Readonly<object>} tareaOriginal - La tarea a modificar (inmutable).
 * @param {object} camposNuevos - Objeto con los nuevos valores de los campos.
 * @returns {Readonly<object>} Una nueva tarea inmutable.
 */
const actualizarTarea = (tareaOriginal, camposNuevos) => {
    // Crea una nueva tarea combinando la original con los campos nuevos.
    const tareaActualizada = {
        ...tareaOriginal,
        ...camposNuevos,
        ultimaEdicion: new Date()
    };
    return Object.freeze(tareaActualizada);
};

/**
 * Reemplaza la tarea antigua por la nueva en la lista (inmutable).
 * @param {Readonly<object[]>} tareas - Lista de tareas actual (inmutable).
 * @param {Readonly<object>} tareaActualizada - La nueva versión de la tarea.
 * @returns {Readonly<object[]>} Nueva lista de tareas.
 */
const reemplazarTareaEnLista = (tareas, tareaActualizada) => {
    // Genera una nueva lista
    return Object.freeze(
        tareas.map(tarea =>
            tarea.id === tareaActualizada.id ? tareaActualizada : tarea
        )
    );
};
/**
 * Función compuesta para actualizar una tarea en la lista.
 * Una "composición" de actualizarTarea y reemplazarTareaEnLista.
 * @param {Readonly<object[]>} tareas - Lista de tareas actual.
 * @param {number} id - ID de la tarea a actualizar.
 * @param {object} camposNuevos - Campos a cambiar.
 * @returns {Readonly<object[]>} Nueva lista con la tarea actualizada.
 */
const actualizarTareaEnLista = (tareas, id, camposNuevos) => {
    const tareaOriginal = buscarTareaPorId(tareas, id);
    if (!tareaOriginal) {
        return tareas; // Retorna la lista original si no se encuentra
    }
    const tareaActualizada = actualizarTarea(tareaOriginal, camposNuevos);
    return reemplazarTareaEnLista(tareas, tareaActualizada);
};
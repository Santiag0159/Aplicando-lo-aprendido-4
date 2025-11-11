const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const ESTADOS = Object.freeze({
    PENDIENTE: "Pendiente",
    EN_CURSO: "En Curso",
    TERMINADA: "Terminada",
    CANCELADA: "Cancelada"
});
const DIFICULTADES = Object.freeze({
    FACIL: "Fácil",
    MEDIO: "Medio",
    DIFICIL: "Difícil"
});
let globalTareas = [];
let globalId = 0;
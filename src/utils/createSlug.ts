export const createSlug = (text: string): string => {
    return text
        .toLowerCase() // Transforma em minúsculas
        .normalize("NFD") // Remove acentos
        .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
        .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
        .trim() // Remove espaços extras no início e fim
        .replace(/\s+/g, "-"); // Substitui espaços por hífen
};
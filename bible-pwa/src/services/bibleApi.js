const API_KEY = '93a15e510271b0b1d4b11218755f5ea3';
const BASE_URL = 'https://api.scripture.api.bible/v1';

const headers = {
  'api-key': API_KEY,
  'Content-Type': 'application/json'
};

// Obtener todas las Biblias disponibles
export const getBibles = async () => {
  try {
    const response = await fetch(`${BASE_URL}/bibles`, { headers });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching bibles:', error);
    throw error;
  }
};

// Obtener libros de una Biblia específica
export const getBooks = async (bibleId) => {
  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books`, { headers });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Obtener capítulos de un libro específico
export const getChapters = async (bibleId, bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`, { headers });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

// Obtener versículos de un capítulo específico
export const getVerses = async (bibleId, chapterId) => {
  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}/verses`, { headers });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching verses:', error);
    throw error;
  }
};

// Obtener el contenido de un capítulo
export const getChapterContent = async (bibleId, chapterId) => {
  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`, { headers });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching chapter content:', error);
    throw error;
  }
};

// Buscar en la Biblia
export const searchBible = async (bibleId, query, limit = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=${limit}`, { headers });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching bible:', error);
    throw error;
  }
};

// Obtener versículo del día (simulado - usando un versículo aleatorio)
export const getVerseOfTheDay = async (bibleId) => {
  try {
    // Para simplificar, obtenemos un versículo de Juan 3:16
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/verses/JHN.3.16?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false`, { headers });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching verse of the day:', error);
    throw error;
  }
};


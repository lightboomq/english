const API_URL = import.meta.env.VITE_API_URL;

const request = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options, // Здесь будет method и body
        credentials: 'include', // Обязательно для работы с куками
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Ошибка сервера');

    return data;
};

export const API = {
    // Получение всех слов
    get_registration: (obj) => {
        return request(`${API_URL}/registration`, {
            method: 'POST',
            body: JSON.stringify(obj),
        });
    },
    get_auth: (obj) => {
        return request(`${API_URL}/auth`, {
            method: 'POST',
            body: JSON.stringify(obj),
        });
    },
    get_all_words: () => {
        return request(`${API_URL}/words`, {
            method: 'GET',
        });
    },

    // Добавление слова
    add_word: (word: { en: string; ru: string }) => {
        return request(`${API_URL}/words`, {
            method: 'POST',
            body: JSON.stringify(word),
        });
    },
    give_translation: (id: string, is_correct: boolean) => {
        return request(`${API_URL}/words/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                is_correct,
            }),
        });
    },

    //Сбросить перевод слова
    reset_word: (id: string) => {
        return request(`${API_URL}/words/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                is_correct_translation: null,
            }),
        });
    },

    //Удаление слова по id
    remove_word: (id: string) => {
        return request(`${API_URL}/words/${id}`, {
            method: 'DELETE',
        });
    },

    // Удаление всех слов
    remove_all_words: () => {
        return request(`${API_URL}/words`, {
            method: 'DELETE',
        });
    },
    // Перемешать все слова
    mix_all_words: () => {
        return request(`${API_URL}/settings`, {
            method: 'GET',
        });
    },

    settings: (is_mix_words: boolean) => {
        return request(`${API_URL}/settings`, {
            method: 'PATCH',
            body: JSON.stringify({
                is_mix_words,
            }),
        });
    },
};

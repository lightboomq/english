const API_URL = import.meta.env.VITE_API_URL;

const request = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options, // Здесь будет method и body
        credentials: 'include', // Обязательно для работы с куками
    });
    if (res.status === 204) return {}; // заглушка no-content с бекенда
    const data = await res.json();
    if (!res.ok) {
        if (res.status === 401 || res.status === 404) {
            //Выкидывает с системы
            //401 статус с бекенда только на истекший токен
            //404 статус с бекенда только на юзер не найден
            const text = res.status === 401 ? 'Сессия завершена, авторизуйтесь снова.' : 'Пользователь не найден или аккаунт удален';
            sessionStorage.setItem('auth_error', text);
            window.location.replace('/auth');
            return;
        }

        throw new Error(data.message || 'Ошибка сервера');
    }

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
    get_all_words: (current_page: number, limit_words: number) => {
        return request(`${API_URL}/words?current_page=${current_page}&limit_words=${limit_words}`, {
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
    //Дать перевод
    give_translation: (id: string, is_correct_translation: boolean) => {
        return request(`${API_URL}/words/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                is_correct_translation,
            }),
        });
    },
    //Сбросить перевод всех слов на текущей странице
    reset_all_words: (ids: string[]) => {
        return request(`${API_URL}/words`, {
            method: 'PATCH',
            body: JSON.stringify({
                ids,
            }),
        });
    },
    //Сбросить перевод слова
    reset_word: (id: string) => {
        return request(`${API_URL}/words/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                is_correct_translation: undefined,
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
    get_settings: () => {
        return request(`${API_URL}/settings`, {
            method: 'GET',
        });
    },

    set_settings: (settings) => {
        return request(`${API_URL}/settings`, {
            method: 'PATCH',
            body: JSON.stringify(settings),
        });
    },
    logout: () => {
        return request(`${API_URL}/settings`, {
            method: 'POST',
        });
    },
};

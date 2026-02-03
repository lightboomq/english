export const API = {
    async get_all_words() {
        const res = await fetch('http://localhost:3005/words', {
            credentials: 'include',
        });

        if (res.status === 401) {
            throw new Error('UNAUTHORIZED');
        }

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message);
        }

        return res.json();
    },
};

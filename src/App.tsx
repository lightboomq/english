import React from 'react';
import showWord from './assets/show.svg';
import removeWord from './assets/remove.svg';
import s from './styles.module.css';

interface Words {
    id: number;
    en: string;
    ru: string;
    isShowTranslation: boolean;
    isCorrectTranslation?: boolean;
    userResponse?: string;
}

function App() {
    const [words, setWords] = React.useState<Words[]>(() => {
        try {
            const stored = localStorage.getItem('words');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [selectedWordId, setSelectedWordId] = React.useState<number | null>(
        words && words.length > 0 ? words[0].id : null
    );
    const [input, setInput] = React.useState('');
    const [err, setErr] = React.useState<string>('');

    React.useEffect(() => {
        const handlerGlobalKeyDown = (e: KeyboardEvent) => {
            const currentIndex = words.findIndex((word) => word.id === selectedWordId);

            if (e.key === 'ArrowUp') {
                const prevIndex = (currentIndex - 1 + words.length) % words.length;
                setSelectedWordId(words[prevIndex].id);
            }
            if (e.key === 'ArrowDown') {
                const nextIndex = (currentIndex + 1) % words.length;
                setSelectedWordId(words[nextIndex].id);
            }
        };

        document.addEventListener('keyup', handlerGlobalKeyDown);

        return () => {
            document.removeEventListener('keyup', handlerGlobalKeyDown);
        };
    }, [words, selectedWordId]);

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const en = formData.get('en') as string;
        const ru = formData.get('ru') as string;

        if (!en.trim() || !ru.trim()) return setErr('Заполните оба поля');

        const isValidEn = /^[A-Za-z\s]+$/.test(en);
        const isValidRu = /^[А-Яа-яЁё\s]+$/.test(ru);

        if (isValidEn && isValidRu) {
            const newId: number = Math.max(...words.map((w) => w.id), 0) + 1;

            setWords((prev) => {
                localStorage.setItem(
                    'words',
                    JSON.stringify([...prev, { id: newId, en: en, ru: ru, isShowTranslation: false }])
                );
                return [...prev, { id: newId, en: en, ru: ru, isShowTranslation: false }];
            });
            return e.currentTarget.reset();
        }
        setErr('Проверьте правильность ввода');
    };

    const getDisplayedWord = (word: Words) => {
        if (word.isShowTranslation) return word.ru;
        if (word.isCorrectTranslation) return `${word.en} - ${word.ru}`;
        if (word.isCorrectTranslation === false) return `${word.en} - ${word.ru} (${word.userResponse})`;
        return word.en;
    };

    const handleListClick = (e: React.MouseEvent<HTMLOListElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'LI') return;

        const id = target.dataset.id;
        setSelectedWordId(Number(id));
    };

    const handleUserTranslation = (id: number) => {
        const cloneWords = [...words];
        const currentIndex = cloneWords.findIndex((word) => word.id === id);
        const currentWord = cloneWords[currentIndex].ru.toLowerCase();
        const isCorrect = currentWord === input.toLowerCase().trim();

        cloneWords[currentIndex] = {
            ...cloneWords[currentIndex],
            isCorrectTranslation: isCorrect,
            userResponse: input,
        };

        const nextIndex = currentIndex + 1;
        localStorage.setItem('words', JSON.stringify(cloneWords));
        setWords(cloneWords);
        setSelectedWordId(cloneWords[nextIndex].id);
        setInput('');
    };

    const handleToggleTranslation = (id: number, isShow: boolean) => {
        setWords((prev) => prev.map((word) => (word.id === id ? { ...word, isShowTranslation: isShow } : word)));
    };

    const highlightWord = (id: number, isCorrect: boolean | undefined) => {
        if (isCorrect) return `${s.words} ${s.correctTranslation}`;
        if (isCorrect === false) return `${s.words} ${s.unCorrectTranslation}`;
        if (id === selectedWordId) return `${s.words} ${s.activeWord}`;
        return s.words;
    };

    const handleRemoveWord = (id: number) => {
        const stored = localStorage.getItem('words');
        if (!stored) return;

        const storageWords: Words[] = JSON.parse(stored);
        const filteredWords = storageWords.filter((word) => word.id !== id);

        localStorage.setItem('words', JSON.stringify(filteredWords));
        setWords(filteredWords);
    };

    const shuffleWords = () => {
        const shuffled = [...words];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));

            const temp = shuffled[i];
            shuffled[i] = shuffled[randomIndex];
            shuffled[randomIndex] = temp;
        }
        setSelectedWordId(shuffled[0].id);
        setWords(shuffled);
        localStorage.setItem('words', JSON.stringify(shuffled));
    };

    return (
        <div className={s.container}>
            <button onClick={shuffleWords} type="button">
                Перемешать слова
            </button>
            <form onSubmit={handleForm}>
                <input autoComplete='off' name="en" type="text" placeholder="en" />
                <input autoComplete='off' name="ru" type="text" placeholder="ru" />
                <button type="submit">Добавить</button>
            </form>
            {err && <span className={s.err}>{err}</span>}
            <ol onClick={handleListClick}>
                {words.length > 0 ? (
                    words.map((word) => {
                        return (
                            <li
                                key={word.id}
                                data-id={word.id}
                                className={highlightWord(word.id, word.isCorrectTranslation)}
                            >
                                {getDisplayedWord(word)}

                                {word.id === selectedWordId && (
                                    <div className={s.inputGroup}>
                                        <input
                                            autoFocus
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyUp={(e) => e.key === 'Enter' && handleUserTranslation(selectedWordId)}
                                            type="text"
                                            placeholder="Введите перевод..."
                                        />

                                        <button onClick={() => handleUserTranslation(selectedWordId)} type="button">
                                            Далее
                                        </button>

                                        <img
                                            onMouseDown={() => handleToggleTranslation(word.id, true)}
                                            onMouseUp={() => handleToggleTranslation(word.id, false)}
                                            onMouseLeave={() => handleToggleTranslation(word.id, false)}
                                            draggable="false"
                                            src={showWord}
                                            alt="eye"
                                        />
                                        <img
                                            src={removeWord}
                                            onMouseUp={() => handleRemoveWord(word.id)}
                                            alt="remove"
                                        />
                                    </div>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <h3 >Слова не добавлены</h3>
                )}
            </ol>
        </div>
    );
}

export default App;

import React from 'react';
import showWordSvg from './assets/show.svg';
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
    const [words, setWords] = React.useState<Words[]>([
        { id: 1, en: 'say', ru: 'сказать', isShowTranslation: false },
        { id: 2, en: 'important', ru: 'важно', isShowTranslation: false },
        { id: 3, en: 'data', ru: 'данные', isShowTranslation: false },
        { id: 4, en: 'mouse', ru: 'мышь', isShowTranslation: false },
    ]);

    const [selectedWordId, setSelectedWordId] = React.useState(words[0].id);
    const [input, setInput] = React.useState('');

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

    const getDisplayedWord = (word: Words) => {
        if (word.isShowTranslation) return word.ru;
        if (word.isCorrectTranslation) return `${word.en} - ${word.ru}`;
        if (word.isCorrectTranslation === false) return `${word.en} - ${word.ru} (Ваш ответ: ${word.userResponse})`;
        return word.en;
    };

    const handleListClick = (e: React.MouseEvent<HTMLOListElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'LI') return;

        const id = target.dataset.id;
        setSelectedWordId(Number(id));
    };

    const handleInput = (id: number) => {
        const currentWord = words.find((word) => word.id === id);
        const isCorrect = currentWord && currentWord.ru.toLowerCase().trim() === input.toLowerCase().trim();

        const currentIndex = words.findIndex((word) => word.id === id);
        const nextIndex = currentIndex + 1;
        setWords((prev) =>
            prev.map((word) =>
                word.id === id ? { ...word, isCorrectTranslation: isCorrect, userResponse: input } : word
            )
        );
        setSelectedWordId(words[nextIndex].id);
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

    return (
        <div className={s.container}>
            <ol onClick={handleListClick}>
                {words.map((word) => {
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
                                        onKeyUp={(e) => e.key === 'Enter' && handleInput(selectedWordId)}
                                        type="text"
                                        placeholder="Введите перевод..."
                                    />

                                    <button onClick={() => handleInput(selectedWordId)} type="button">
                                        Далее
                                    </button>

                                    <img
                                        onMouseDown={() => handleToggleTranslation(word.id, true)}
                                        onMouseUp={() => handleToggleTranslation(word.id, false)}
                                        onMouseLeave={() => handleToggleTranslation(word.id, false)}
                                        draggable="false"
                                        src={showWordSvg}
                                        alt="eye"
                                    />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

export default App;

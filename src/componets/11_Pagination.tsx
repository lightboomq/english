import React from 'react';
import s from '../styles/11_pagination.module.css';

interface Props {
    currentPage: number;
    total_pages: number;
    onPageChange: (page: number) => void;
}
//ИИ
const Pagination: React.FC<Props> = ({ currentPage, total_pages, onPageChange }) => {
    if (total_pages <= 1) return null;

    const getPages = () => {
        const delta = 1;
        const range: (number | string)[] = [];
        for (let i = 1; i <= total_pages; i++) {
            if (i === 1 || i === total_pages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            } else if (range[range.length - 1] !== '...') {
                range.push('...');
            }
        }
        return range;
    };
    return (
        <nav className={s.pagination}>
            {/* Назад
            <button className={s.pagination__item} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                <svg className={s.pagination__icon} viewBox='0 0 24 24' stroke='currentColor' fill='none' strokeWidth='2'>
                    <path d='M15 19l-7-7 7-7' />
                </svg>
            </button> */}

            {/* Цифры */}
            {getPages().map((page, idx) => (
                <button
                    key={idx}
                    disabled={page === '...'}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    className={`
                        ${s.pagination__item} 
                        ${page === currentPage ? s['pagination__item--active'] : ''} 
                        ${page === '...' ? s['pagination__item--ellipsis'] : ''}
                    `}
                >
                    {page}
                </button>
            ))}

            {/* Вперед */}
            {/* <button className={s.pagination__item} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === total_pages}>
                <svg className={s.pagination__icon} viewBox='0 0 24 24' stroke='currentColor' fill='none' strokeWidth='2'>
                    <path d='M9 5l7 7-7 7' />
                </svg>
            </button> */}
        </nav>
    );
};

export default Pagination;

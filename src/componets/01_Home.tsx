import s from '../styles/01_Home.module.css';
import { Link } from 'react-router-dom';
import Errors from './05_Error_notification';
export const Home = () => {
    return (
        <div className={s.wrapper}>
            <div className={s.features}>
                <div className={s.card}>
                    <div className={s.icon}>📝</div>
                    <h3>Свой словарь</h3>
                    <p>Добавляйте только те слова, которые вам действительно нужны. Метод интервальных повторений поможет запомнить всё.</p>

                    <Link to='/words' className={s.btn_start}>
                        Начать обучение
                    </Link>
                </div>
            </div>
        </div>
    );
};

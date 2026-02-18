import s from '../styles/09_loader.module.css';

const Loader = () => {
    return (
        <div className={s.loaderWrapper}>
            <svg className={s.spinner} viewBox='0 0 50 50'>
                <circle className={s.path} cx='25' cy='25' r='20' fill='none' strokeWidth='5'></circle>
            </svg>
        </div>
    );
};

export default Loader;

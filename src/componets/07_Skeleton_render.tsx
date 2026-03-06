import s from '../styles/04_words.module.css';
import s1 from '../styles/12_add_word_form.module.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const Skeleton_render = () => {
    return (
        <div className={s.container} style={{ gap: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width={89.66} height={25} />
                <Skeleton circle width={25} height={25} />
            </div>
            <Skeleton borderRadius={8} height={47} style={{ marginTop: '15px' }} />
            <Skeleton borderRadius={8} height={47} style={{ marginTop: '10px' }} />
            <Skeleton borderRadius={6} width={115.53} height={29} style={{ marginTop: '10px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                <Skeleton width={91.406} height={18} />
                <Skeleton width={128.64} height={18} />
            </div>
            <Skeleton width={160} height={21} style={{ marginTop: '10px' }} />
            <Skeleton style={{ marginTop: '15px' }} borderRadius={8} height={51} />
            <Skeleton style={{ marginTop: '12px' }} borderRadius={8} height={51} />
            <Skeleton style={{ marginTop: '12px' }} borderRadius={8} height={51} />
            <Skeleton style={{ marginTop: '12px', marginBottom: '12px' }} borderRadius={8} height={51} />
            <div style={{ display: 'flex', gap: '6px', margin: 'auto' }}>
                <Skeleton width={54} borderRadius={8} height={42} />
                <Skeleton width={54} borderRadius={8} height={42} />
                <Skeleton width={54} borderRadius={8} height={42} />
                <Skeleton width={54} borderRadius={8} height={42} />
            </div>
        </div>
    );
};

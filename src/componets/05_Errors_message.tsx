// import React from 'react';
// import errorIcon from '../assets/errorIcon.svg';
// import closeErrorIcon from '../assets/crossInput.svg';
// import errors from '../store/Errors';
// import { observer } from 'mobx-react-lite';
// import s from '../StyleComponets/errorsMessage.module.css';

// function ErrorsMessage() {
//     React.useEffect(() => {
//         const timerId = setTimeout(() => {
//             errors.setMessage('');
//         }, 10000);

//         return () => {
//             clearTimeout(timerId);
//         };
//     }, []);

//     return (
//         <>
//             {errors.getMessage() && (
//                 <div className={s.wrapper}>
//                     <img src={errorIcon} alt='err' />
//                     <p className={s.textErr}>{errors.getMessage()}</p>
//                     <img onClick={() => errors.setMessage('')} src={closeErrorIcon} className={s.closeError} alt='close'/>
//                     <div className={s.line}> </div>
//                 </div>
//             )}
//         </>
//     );
// }

// export default observer(ErrorsMessage);

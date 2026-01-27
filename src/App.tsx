import { Routes, Route } from 'react-router-dom';
import { Layout } from './componets/00_Layout.tsx';
import { Home } from './componets/01_Home.tsx';
import { Registration } from './componets/02_Registration.tsx';
import { Auth } from './componets/03_Auth.tsx';
import { Words } from './componets/04_Words.tsx';

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="registration" element={<Registration />} />
                <Route path="auth" element={<Auth />} />
                <Route path="words" element={<Words />} />
            </Route>
        </Routes>
    );
};

export default App;

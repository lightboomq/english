import { Routes, Route } from 'react-router-dom';
import { Layout } from './componets/00_Layout.tsx';
import { Home } from './componets/01_Home.tsx';
import { Registration } from './componets/02_Registration.tsx';
import { Auth } from './componets/03_Auth.tsx';
import { Words } from './componets/04_Words.tsx';
import { Settings } from './componets/08_Settings.tsx';

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path='/' element={<Home />} />
                <Route path='registration' element={<Registration />} />
                <Route path='auth' element={<Auth />} />
                <Route path='words' element={<Words />} />
                <Route path='settings' element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default App;

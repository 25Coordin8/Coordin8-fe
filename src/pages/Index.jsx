import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

function Index() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="splash-screen" onClick={() => navigate('/setup')}>
                <div className="splash-slogan">함께하는 시간을, 더 똑똑하게</div>
                <Logo 
                    className="splash-title" 
                    style={{ width: 'auto', height: '40px', objectFit: 'contain' }}
                />
            </div>
        </div>
    );
}

export default Index;


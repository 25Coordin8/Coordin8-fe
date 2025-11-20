import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Storage } from '../utils/storage';
import Logo from '../components/Logo';

function Setup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [major, setMajor] = useState('');
    const [intro, setIntro] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    const selectCharacter = (charNum) => {
        setSelectedCharacter(charNum);
    };

    const saveSetup = () => {
        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        const profile = {
            name: name.trim(),
            major: major.trim(),
            intro: intro.trim(),
            character: selectedCharacter || 1
        };

        Storage.set('userProfile', profile);
        navigate('/home');
    };

    return (
        <div className="container">
            <div className="header">
                <Logo 
                    style={{ height: '19px', width: 'auto', objectFit: 'contain' }}
                />
            </div>
            <div className="content" style={{ padding: '40px 60px' }}>
                <div className="input-group">
                    <label>이름을 작성해주세요</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름 입력"
                    />
                </div>
                <div className="input-group">
                    <label>당신의 전공은 무엇인가요?</label>
                    <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="전공 입력"
                    />
                </div>
                <div className="input-group">
                    <label>나를 소개 하는 한 문장</label>
                    <input
                        type="text"
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        placeholder="소개 입력"
                    />
                </div>
                <div className="input-group">
                    <label>나의 캐릭터</label>
                    <div className="character-selection">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((charNum) => (
                            <div
                                key={charNum}
                                className={`character-item ${selectedCharacter === charNum ? 'selected' : ''}`}
                                onClick={() => selectCharacter(charNum)}
                            ></div>
                        ))}
                    </div>
                </div>
                <button className="btn btn-black" onClick={saveSetup}>
                    지금 시작해요
                </button>
            </div>
        </div>
    );
}

export default Setup;


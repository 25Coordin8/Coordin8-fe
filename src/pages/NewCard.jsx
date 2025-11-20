import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Cards } from '../utils/cards';
import { Storage } from '../utils/storage';
import Logo from '../components/Logo';
import backIcon from '../assets/back.png';

function NewCard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('project');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const cancelCard = () => {
        if (projectId) {
            navigate(`/cards?project=${projectId}`);
        } else {
            navigate('/home');
        }
    };

    const createCard = () => {
        if (!title.trim()) {
            alert('카드 제목을 입력해주세요.');
            return;
        }

        const profile = Storage.get('userProfile');
        const card = {
            projectId: projectId || '',
            title: title.trim(),
            content: content.trim(),
            author: profile ? profile.name : '작성자'
        };

        Cards.add(card);
        alert('카드가 작성되었습니다!');
        cancelCard();
    };

    return (
        <div className="container">
            <div className="header">
                <img 
                    src={backIcon} 
                    alt="뒤로가기" 
                    className="back-arrow" 
                    onClick={() => navigate(-1)}
                    style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                />
                <Logo 
                    style={{ height: '19px', width: 'auto', objectFit: 'contain' }}
                />
            </div>
            <div className="subtitle">새 카드 작성</div>
            <div className="content">
                <div className="card-input-box">
                    <div className="input-group">
                        <label>카드의 제목을 작성해주세요</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="카드 제목"
                            className="input-white"
                        />
                    </div>
                </div>
                <div className="card-input-box">
                    <div className="input-group">
                        <label>내용을 입력해주세요</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="질문 내용"
                            className="input-white"
                        ></textarea>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-cancel" onClick={cancelCard}>
                        취소
                    </button>
                    <button 
                        className="btn btn-write" 
                        onClick={createCard}
                        style={{ backgroundColor: '#F7B4A9' }}
                    >
                        작성하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewCard;


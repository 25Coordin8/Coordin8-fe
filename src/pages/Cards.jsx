import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Cards } from '../utils/cards';
import { Storage } from '../utils/storage';
import { formatDate } from '../utils/helpers';
import Logo from '../components/Logo';
import backIcon from '../assets/back.png';

function CardsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('project');
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const profile = Storage.get('userProfile');
        if (!profile) {
            navigate('/');
            return;
        }
        loadCards();
    }, [projectId, navigate]);

    const loadCards = () => {
        const allCards = Cards.getAll(projectId);
        setCards(allCards);
    };

    const handleDeleteCard = (cardId) => {
        if (window.confirm('이 카드를 삭제하시겠습니까?')) {
            Cards.remove(cardId);
            loadCards();
        }
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
            <div className="content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="subtitle" style={{ margin: 0 }}>
                        카드 페이지
                    </h2>
                    <button
                        className="btn btn-write"
                        onClick={() => navigate(`/new-card${projectId ? `?project=${projectId}` : ''}`)}
                        style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}
                    >
                        + 작성
                    </button>
                </div>
                {cards.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94846B', padding: '40px' }}>
                        작성된 카드가 없습니다.
                    </p>
                ) : (
                    cards.map((card) => (
                        <div key={card.id} className="card-item">
                            <div className="card-header">
                                <span className="card-author">{card.author || '작성자'}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="card-date">{formatDate(card.createdAt)}</span>
                                    <button
                                        className="card-delete-btn"
                                        onClick={() => handleDeleteCard(card.id)}
                                        title="카드 삭제"
                                    >
                                        −
                                    </button>
                                </div>
                            </div>
                            <div className="card-title">{card.title}</div>
                            <div className="card-content">{card.content}</div>
                            <div style={{ marginTop: '12px', fontSize: '12px', color: '#94846B' }}>
                                작성자 {formatDate(card.createdAt)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CardsPage;


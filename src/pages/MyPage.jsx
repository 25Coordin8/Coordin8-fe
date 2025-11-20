import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Projects } from '../utils/projects';
import { Cards } from '../utils/cards';
import { Storage } from '../utils/storage';
import Logo from '../components/Logo';
import backIcon from '../assets/back.png';

function MyPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        teams: 0,
        cards: 0,
        members: 0,
        focusTime: '00:00'
    });
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const userProfile = Storage.get('userProfile');
        if (!userProfile) {
            navigate('/');
            return;
        }
        setProfile(userProfile);
        loadData();
    }, [navigate]);

    const loadData = () => {
        const allProjects = Projects.getAll();
        const allCards = Cards.getAll();
        const totalMembers = allProjects.reduce((sum, p) => sum + (p.members?.length || 0), 0);
        const focusTime = Storage.get('totalFocusTime') || 0;
        const hours = Math.floor(focusTime / 3600);
        const minutes = Math.floor((focusTime % 3600) / 60);

        setStats({
            teams: allProjects.length,
            cards: allCards.length,
            members: totalMembers,
            focusTime: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
        });
        setProjects(allProjects);
    };

    const editProfile = () => {
        if (!profile) return;

        const name = prompt('이름을 입력하세요:', profile.name);
        if (name !== null) {
            const major = prompt('전공을 입력하세요:', profile.major);
            if (major !== null) {
                const intro = prompt('한줄 소개를 입력하세요:', profile.intro);
                if (intro !== null) {
                    const updatedProfile = {
                        ...profile,
                        name: name.trim() || profile.name,
                        major: major.trim() || profile.major,
                        intro: intro.trim() || profile.intro
                    };
                    Storage.set('userProfile', updatedProfile);
                    setProfile(updatedProfile);
                }
            }
        }
    };

    if (!profile) return null;

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
                <div className="user-icon"></div>
            </div>
            <div className="content">
                <div className="profile-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#E26D59' }}></div>
                        <div style={{ flex: 1 }}>
                            <div className="profile-value">{profile.name || '이름'}</div>
                            <div className="profile-major">{profile.major || '전공'}</div>
                        </div>
                        <button className="btn btn-write btn-small" onClick={editProfile}>
                            수정
                        </button>
                    </div>
                    <div className="profile-intro-box">
                        <div className="profile-label">한줄 소개</div>
                        <div className="profile-value">{profile.intro || '한줄 소개'}</div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-item" style={{ backgroundColor: '#FFE7E0' }}>
                        <div className="stat-value">{stats.teams}</div>
                        <div className="stat-label">참여 팀</div>
                    </div>
                    <div className="stat-item" style={{ backgroundColor: '#Ffd3df' }}>
                        <div className="stat-value">{stats.cards}</div>
                        <div className="stat-label">작성 카드</div>
                    </div>
                    <div className="stat-item" style={{ backgroundColor: '#FFFCE6' }}>
                        <div className="stat-value">{stats.members}</div>
                        <div className="stat-label">끝난 프로젝트</div>
                    </div>
                </div>

                <div className="teams-section">
                    <h2 className="teams-section-title">참여 중인 팀</h2>
                    {projects.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#94846B', padding: '20px' }}>
                            참여 중인 팀이 없습니다.
                        </p>
                    ) : (
                        <div className="teams-list">
                            {projects.map((project) => (
                                <div key={project.id} className="team-item-box">
                                    <div className="team-project-name">{project.title}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="focus-time-section">
                    <div className="focus-time-label">총 집중 시간</div>
                    <div className="focus-time-display">{stats.focusTime}</div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;


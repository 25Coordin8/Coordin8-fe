import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Projects } from '../utils/projects';
import { Storage } from '../utils/storage';
import { calculateDDay } from '../utils/helpers';
import Logo from '../components/Logo';

function Home() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const profile = Storage.get('userProfile');
        if (!profile) {
            navigate('/');
            return;
        }
        loadProjects();
    }, [navigate]);

    const loadProjects = () => {
        const allProjects = Projects.getAll();
        setProjects(allProjects);
    };

    const deleteProject = (projectId) => {
        if (window.confirm('이 팀을 삭제하시겠습니까?')) {
            Projects.remove(projectId);
            loadProjects();
        }
    };

    return (
        <div className="container">
            <div className="header">
                <Logo 
                    style={{ height: '19px', width: 'auto', objectFit: 'contain' }}
                />
                <div className="user-icon" onClick={() => navigate('/mypage')}></div>
            </div>
            <div className="content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="subtitle" style={{ margin: 0 }}>
                        참여중인 팀
                    </h2>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => navigate('/create-team')}
                        style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}
                    >
                        + 팀 추가
                    </button>
                </div>
                <div>
                    {projects.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#94846B', padding: '40px' }}>
                            참여 중인 팀이 없습니다.
                        </p>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="project-card">
                                <div className="project-header">
                                    <div className="project-title">{project.title}</div>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            border: '1px solid #94846B',
                                            background: 'transparent',
                                            color: '#94846B',
                                            fontSize: '20px',
                                            lineHeight: '1',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0,
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#FFE7E0';
                                            e.target.style.borderColor = '#E26D59';
                                            e.target.style.color = '#E26D59';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.borderColor = '#94846B';
                                            e.target.style.color = '#94846B';
                                        }}
                                    >
                                        −
                                    </button>
                                </div>
                                <div className="project-info">
                                    <span>다음 회의: {project.nextMeeting || '0000-00-00 00:00'}</span>
                                    <span>마감일까지: {calculateDDay(project.deadline)}</span>
                                </div>
                                <div className="project-actions">
                                    <button
                                        className="btn btn-focus btn-small"
                                        onClick={() => navigate(`/focus-mode?project=${project.id}`)}
                                    >
                                        집중 모드
                                    </button>
                                    <button
                                        className="btn btn-cards btn-small"
                                        onClick={() => navigate(`/cards?project=${project.id}`)}
                                    >
                                        카드 보기
                                    </button>
                                    <button
                                        className="btn btn-schedule btn-small"
                                        onClick={() => navigate(`/schedule?project=${project.id}`)}
                                    >
                                        일정 보기
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;


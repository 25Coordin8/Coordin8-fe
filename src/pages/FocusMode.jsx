import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Projects } from '../utils/projects';
import { Storage } from '../utils/storage';
import { FocusTimer } from '../utils/timer';
import { createFocusSession, endFocusSession } from '../utils/api';
import Logo from '../components/Logo';
import focusModeIcon from '../assets/focusmode.png';
import backIcon from '../assets/back.png';

function FocusMode() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('project');
    const [project, setProject] = useState(null);
    const [timeDisplay, setTimeDisplay] = useState('00:00');
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    const sessionStartTimeRef = useRef(null); // 세션 시작 시간 추적
    const currentSessionIdRef = useRef(null); // 현재 세션 ID

    useEffect(() => {
        const profile = Storage.get('userProfile');
        if (!profile) {
            navigate('/');
            return;
        }

        if (projectId) {
            const projects = Projects.getAll();
            const foundProject = projects.find((p) => p.id === projectId);
            if (foundProject) {
                setProject(foundProject);
            }
        }

        // 타이머 초기화
        timerRef.current = new FocusTimer((timeString) => {
            setTimeDisplay(timeString);
        });

        // 컴포넌트 언마운트 시 타이머 정지
        return () => {
            if (timerRef.current && timerRef.current.isRunning) {
                timerRef.current.pause();
            }
        };
    }, [projectId, navigate]);

    /**
     * 세션 종료 및 백엔드로 전송하는 함수
     */
    const saveSessionData = async () => {
        const profile = Storage.get('userProfile');
        const userId = Storage.get('userId');
        
        if (!profile || !projectId || !userId) {
            console.warn('세션 저장 실패: 프로필, 프로젝트 ID 또는 사용자 ID가 없습니다.');
            return;
        }

        if (!sessionStartTimeRef.current) {
            console.warn('세션 저장 실패: 시작 시간이 없습니다.');
            return;
        }

        // 타이머에서 경과 시간 계산
        const seconds = Math.floor(timerRef.current.elapsed / 1000);
        
        // 최소 1초 이상 집중했을 때만 전송
        if (seconds <= 0) {
            return;
        }

        const startTime = new Date(sessionStartTimeRef.current).toISOString();
        const endTime = new Date().toISOString();

        // 세션 정보 생성
        const sessionData = {
            projectId: parseInt(projectId) || projectId,
            userId: parseInt(userId) || userId,
            sessionType: 'FOCUS',
            startTime: startTime,
            endTime: endTime
        };

        console.log('세션 정보 전송:', sessionData);

        // 백엔드로 세션 생성
        const result = await createFocusSession(sessionData);
        
        if (result.success && result.data) {
            console.log('✅ 세션 정보 전송 성공:', result.data);
            currentSessionIdRef.current = result.data.id;
        } else {
            console.warn('❌ 세션 정보 전송 실패:', result.error);
        }
    };

    const startTimer = () => {
        if (timerRef.current) {
            timerRef.current.start();
            setIsRunning(true);
            // 세션 시작 시간 기록
            sessionStartTimeRef.current = Date.now();
            currentSessionIdRef.current = null;
        }
    };

    const pauseTimer = async () => {
        if (timerRef.current) {
            timerRef.current.pause();
            setIsRunning(false);

            // 세션 정보를 백엔드로 전송
            if (sessionStartTimeRef.current) {
                await saveSessionData();
            }
        }
    };

    return (
        <div className="container">
            <div className="header">
                <img 
                    src={backIcon} 
                    alt="뒤로가기" 
                    className="back-arrow" 
                    onClick={async () => {
                        // 페이지를 떠나기 전에 세션 저장
                        if (sessionStartTimeRef.current && timerRef.current) {
                            await saveSessionData();
                        }
                        navigate('/home');
                    }}
                    style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                />
                <Logo 
                    style={{ height: '19px', width: 'auto', objectFit: 'contain' }}
                />
            </div>
            <div className="subtitle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                    src={focusModeIcon} 
                    alt="집중 모드" 
                    style={{ height: '22px', width: 'auto', objectFit: 'contain' }}
                />
                <span>집중 모드</span>
            </div>
            <div className="content">
                <div className="focus-timer-block">
                    <div className="project-title-focus">
                        {project ? project.title : '프로젝트 이름'}
                    </div>
                    <div className="timer-display">{timeDisplay}</div>
                    <div className="timer-buttons">
                        <button
                            className="btn btn-primary"
                            onClick={isRunning ? pauseTimer : startTimer}
                        >
                            {isRunning ? '일시정지' : '시작'}
                        </button>
                        <button className="btn btn-secondary" onClick={pauseTimer}>
                            휴식
                        </button>
                    </div>
                </div>
                <div className="team-status-block">
                    <h3 className="team-status-title">팀원 상태</h3>
                    <div>
                        <div className="status-item">
                            <div className="status-left">
                                <div className="status-avatar" style={{ backgroundColor: '#E26D59' }}></div>
                                <div className="status-info">
                                    <span className="status-name">이름</span>
                                    <span className="status-label">집중 중</span>
                                </div>
                            </div>
                            <span className="status-time">00:00</span>
                        </div>
                        <div className="status-item">
                            <div className="status-left">
                                <div className="status-avatar" style={{ backgroundColor: '#e0e0e0' }}></div>
                                <div className="status-info">
                                    <span className="status-name">이름</span>
                                    <span className="status-label">오프라인</span>
                                </div>
                            </div>
                            <span className="status-time">00:00</span>
                        </div>
                        <div className="status-item">
                            <div className="status-left">
                                <div className="status-avatar" style={{ backgroundColor: '#e0e0e0' }}></div>
                                <div className="status-info">
                                    <span className="status-name">이름</span>
                                    <span className="status-label">오프라인</span>
                                </div>
                            </div>
                            <span className="status-time">00:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FocusMode;


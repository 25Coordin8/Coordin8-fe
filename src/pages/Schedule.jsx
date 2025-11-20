import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Storage } from '../utils/storage';
import Logo from '../components/Logo';
import backIcon from '../assets/back.png';

function Schedule() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('project');
    const [selectedCells, setSelectedCells] = useState(new Set());
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const profile = Storage.get('userProfile');
        if (!profile) {
            navigate('/');
            return;
        }
        
        // 저장된 스케줄 데이터 불러오기
        loadSchedule();
    }, [navigate, projectId]);

    const loadSchedule = () => {
        const storageKey = projectId ? `schedule_${projectId}` : 'schedule_default';
        const savedCells = Storage.get(storageKey);
        if (savedCells && Array.isArray(savedCells)) {
            setSelectedCells(new Set(savedCells));
        }
    };

    const saveSchedule = (cells) => {
        const storageKey = projectId ? `schedule_${projectId}` : 'schedule_default';
        // Set을 배열로 변환하여 저장
        Storage.set(storageKey, Array.from(cells));
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const times = [];
    for (let hour = 9; hour <= 24; hour++) {
        times.push(`${String(hour).padStart(2, '0')}:00`);
    }

    const toggleCell = (time, day) => {
        const cellKey = `${time}-${day}`;
        setSelectedCells(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cellKey)) {
                newSet.delete(cellKey);
            } else {
                newSet.add(cellKey);
            }
            // 변경사항을 저장소에 저장
            saveSchedule(newSet);
            return newSet;
        });
    };

    const isCellSelected = (time, day) => {
        return selectedCells.has(`${time}-${day}`);
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
                <div className="schedule-header">
                    <h2 className="subtitle" style={{ margin: 0 }}>
                        일정 보기
                    </h2>
                    <div className="progress-bar-container">
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                            <span className="progress-start">0</span>
                            <span className="progress-end">N</span>
                        </div>
                    </div>
                </div>
                <div className="schedule-container">
                    <div className="schedule-grid">
                        <div className="schedule-cell schedule-empty"></div>
                        {days.map((day) => (
                            <div key={day} className="schedule-cell schedule-day">
                                {day}
                            </div>
                        ))}
                        {times.map((time) => (
                            <div key={time} style={{ display: 'contents' }}>
                                <div className="schedule-cell schedule-time">{time}</div>
                                {days.map((day) => {
                                    const selected = isCellSelected(time, day);
                                    return (
                                        <div 
                                            key={`${time}-${day}`} 
                                            className={`schedule-cell schedule-data ${selected ? 'selected' : ''}`}
                                            onClick={() => toggleCell(time, day)}
                                        ></div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;


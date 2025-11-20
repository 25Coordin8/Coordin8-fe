import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Projects } from '../utils/projects';
import { Storage } from '../utils/storage';
import Logo from '../components/Logo';
import backIcon from '../assets/back.png';

function JoinTeam() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    const joinTeam = () => {
        const teamCode = code.trim().toUpperCase();

        if (!teamCode || teamCode.length !== 6) {
            alert('6자리 팀 코드를 입력해주세요.');
            return;
        }

        const projects = Projects.getAll();
        const project = projects.find((p) => p.code === teamCode);

        if (!project) {
            alert('유효하지 않은 팀 코드입니다.');
            return;
        }

        const profile = Storage.get('userProfile');
        if (profile && project.members) {
            if (!project.members.find((m) => m.id === profile.name)) {
                project.members.push({
                    id: profile.name,
                    name: profile.name
                });
                Projects.update(project.id, { members: project.members });
            }
        }

        alert('팀에 참여했습니다!');
        navigate('/home');
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
                <div className="tabs">
                    <button className="tab" onClick={() => navigate('/create-team')}>
                        새 팀 만들기
                    </button>
                    <button className="tab active" onClick={() => navigate('/join-team')}>
                        팀 참여하기
                    </button>
                </div>
                <div className="form-container">
                    <div className="input-group">
                        <label>팀 코드 입력</label>
                        <div style={{ fontSize: '14px', color: '#94846B', marginBottom: '8px' }}>
                            팀장에게 받은 6자리 코드를 입력하세요
                        </div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="예 : ABC123"
                            maxLength={6}
                            style={{ textTransform: 'uppercase' }}
                            className="input-white"
                        />
                    </div>
                    <button className="btn btn-pink" onClick={joinTeam} style={{ width: '100%', marginTop: '16px' }}>
                        팀 참여하기
                    </button>
                    <div className="info-box-blue">
                        <p>팀 코드를 받지 못했나요?</p>
                        <p style={{ marginTop: '8px' }}>팀장에게 초대 링크나 코드를 요청하세요</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JoinTeam;


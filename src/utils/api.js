// API 호출 유틸리티
// 백엔드 API 엔드포인트 기본 URL (환경변수나 설정에서 가져올 수 있음)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * 집중 세션 정보를 백엔드로 전송
 * @param {Object} sessionData - 세션 데이터
 * @param {string} sessionData.userId - 사용자 ID
 * @param {string} sessionData.projectId - 프로젝트 ID
 * @param {number} sessionData.focusSeconds - 집중한 시간 (초 단위)
 * @returns {Promise<Object>} 서버 응답
 */
export async function sendFocusSession(sessionData) {
    try {
        const response = await fetch(`${API_BASE_URL}/focus-sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('집중 세션 전송 실패:', error);
        // 오프라인 상태나 네트워크 오류 시 로컬 스토리지에 저장 (나중에 재전송 가능)
        saveSessionToQueue(sessionData);
        return { success: false, error: error.message };
    }
}

/**
 * 실패한 세션을 로컬 스토리지에 저장 (재전송 큐)
 * @param {Object} sessionData - 세션 데이터
 */
function saveSessionToQueue(sessionData) {
    try {
        const queue = JSON.parse(localStorage.getItem('focusSessionQueue') || '[]');
        queue.push({
            ...sessionData,
            timestamp: Date.now(),
        });
        localStorage.setItem('focusSessionQueue', JSON.stringify(queue));
        console.log('세션 정보를 재전송 큐에 저장했습니다.');
    } catch (error) {
        console.error('재전송 큐 저장 실패:', error);
    }
}

/**
 * 재전송 큐에 있는 세션들을 다시 전송 시도
 */
export async function retryFailedSessions() {
    try {
        const queue = JSON.parse(localStorage.getItem('focusSessionQueue') || '[]');
        if (queue.length === 0) return;

        const successful = [];
        const failed = [];

        for (const session of queue) {
            const result = await sendFocusSession(session);
            if (result.success) {
                successful.push(session);
            } else {
                failed.push(session);
            }
        }

        // 성공한 세션은 큐에서 제거
        if (successful.length > 0) {
            const remaining = queue.filter(
                (s) => !successful.some((success) => success.timestamp === s.timestamp)
            );
            localStorage.setItem('focusSessionQueue', JSON.stringify(remaining));
            console.log(`${successful.length}개의 세션을 성공적으로 재전송했습니다.`);
        }

        return { successful: successful.length, failed: failed.length };
    } catch (error) {
        console.error('재전송 실패:', error);
        return { successful: 0, failed: 0 };
    }
}


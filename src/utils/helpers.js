// 팀 코드 생성
export function generateTeamCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// 날짜 포맷팅
export function formatDate(date) {
    if (!date) return '0000-00-00';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// D-day 계산
export function calculateDDay(deadline) {
    if (!deadline) return 'D-00';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diff = deadlineDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days >= 0 ? `D-${String(days).padStart(2, '0')}` : `D+${String(Math.abs(days)).padStart(2, '0')}`;
}


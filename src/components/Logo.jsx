import logoImage from '../assets/logo.png';

/**
 * Coordin8 로고 컴포넌트
 * @param {Object} props
 * @param {string} props.className - 추가 CSS 클래스명
 * @param {string} props.style - 인라인 스타일
 * @param {string} props.alt - 이미지 alt 텍스트 (기본값: 'Coordin8')
 */
function Logo({ className = '', style = {}, alt = 'Coordin8' }) {
    return (
        <img 
            src={logoImage} 
            alt={alt}
            className={className}
            style={style}
        />
    );
}

export default Logo;


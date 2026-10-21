import { Link } from 'react-router-dom';
import './index.css';

export const Brand = () => {
    return (
        <Link to="/" className="brand">
            <div className="brand__logo">
                <svg width="24" height="24" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 9L7 5L11 9L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 13L7 9L11 13L15 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                </svg>
            </div>
            <span className="brand__name">
                PixelForge
            </span>
        </Link>
    );
};
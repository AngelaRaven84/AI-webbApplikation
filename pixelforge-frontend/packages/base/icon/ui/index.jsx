import './index.css';

export const Icon = ({ icon: LucideIcon, size = 20 }) => {
    return (
        <LucideIcon
            className="icon"
            size={ size }
            strokeWidth={ 1.5 }
        />
    );
};
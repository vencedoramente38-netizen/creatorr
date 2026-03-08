import React, { useState } from 'react';

interface PrimaryBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const PrimaryBtn: React.FC<PrimaryBtnProps> = ({ children, style, ...props }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            {...props}
            onMouseEnter={(e) => {
                setHovered(true);
                if (props.onMouseEnter) props.onMouseEnter(e);
            }}
            onMouseLeave={(e) => {
                setHovered(false);
                if (props.onMouseLeave) props.onMouseLeave(e);
            }}
            style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#DEDEDE',
                color: '#050505',
                border: 'none',
                ...style
            }}
        >
            <span
                style={{
                    position: 'absolute',
                    height: '1px',
                    opacity: hovered ? 1 : 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '75%',
                    margin: '0 auto',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
                    transition: 'opacity 0.5s ease',
                    pointerEvents: 'none',
                }}
            />
            {children}
            <span
                style={{
                    position: 'absolute',
                    height: '1px',
                    opacity: 0.3,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '75%',
                    margin: '0 auto',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)',
                    pointerEvents: 'none',
                }}
            />
        </button>
    );
};

import { useState, useEffect } from 'react';
import '../globals.css';
import IconSVG from "@/app/components/IconSVG";

function Header({ title, iconType, isActive, onClick, className }) {
    return (
        <div
            className={`${isActive ? 'text-primary text-[16px] md:text-[18px]' : 'text-secondary text-[14px] md:text-[16px]'} 
            flex flex-col items-center justify-center md:mb-[30px] ${className}`}
            onClick={onClick}>
            <IconSVG
                type={iconType}
                color={isActive ? 'rgb(var(--primary))' : 'rgba(var(--secondary))'}
                width={isActive ? '30' : '26'}
                height={isActive ? '30' : '26'}/>
            <h1 className="mt-1 text-center whitespace-pre-line leading-tight">
                {title}
            </h1>
        </div>
    );
}

export const Navbar = () => {
    const [selected, setSelected] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        html.classList.remove(isDarkMode ? 'light' : 'dark');
        html.classList.add(isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const headerClick = (index) => setSelected(index);

    return (
        <nav className="fixed bottom-10 left-10 right-10 h-[70px] bg-background
            border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.5)]
            z-50 w-auto p-2 gap-1 flex items-stretch font-fontHeader
            md:left-[50px] md:top-[100px] md:bottom-[100px] md:w-[100px] md:p-4 md:flex-col md:gap-3 md:h-auto">
            <Header
                title="Home"
                iconType="home"
                isActive={selected === 0}
                onClick={() => headerClick(0)}
                className="flex-1 md:flex-none"
            />
            <Header
                title="Generate Diet"
                iconType="diet"
                isActive={selected === 1}
                onClick={() => headerClick(1)}
                className="flex-1 md:flex-none"
            />
            <Header
                title="Analyze Food"
                iconType="analyze"
                isActive={selected === 2}
                onClick={() => headerClick(2)}
                className="flex-1 md:flex-none"
            />

            <button
                onClick={toggleTheme}
                className="flex-1 flex flex-col items-center justify-center text-secondary
                         hover:bg-primary rounded-md transition-colors md:flex-none md:mt-auto"
            >
                <span className="text-lg">{isDarkMode ? '🌞' : '🌙'}</span>
                <span className="text-xs mt-1 md:text-sm">
                    {isDarkMode ? 'Light' : 'Dark'}
                </span>
            </button>
        </nav>
    );
};
import { useState, useEffect } from 'react';
import IconSVG from "@/app/components/IconSVG";

function Header({ title, iconType, isActive, onClick, className }) {
    return (
        <div
            className={`${isActive ? 'text-primary text-[14px] md:text-[18px] font-bold' : 'text-secondary text-[12px] md:text-[16px]'} 
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

export const Navbar = ({ selectedPage, onSelect, isDarkMode, setIsDarkMode }) => {
    
    useEffect(() => {
        const html = document.documentElement;
        html.classList.remove(isDarkMode ? 'light' : 'dark');
        html.classList.add(isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const switchMode = () => setIsDarkMode(!isDarkMode);

    return (
        <nav className="fixed z-50 bg-background border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.5)]
                /* Mobile */
                bottom-[10px] left-[10px] right-[10px] h-[85px] p-2 gap-1 flex items-stretch font-fontHeader
                /* 768px+ */
                md:left-[50px] md:top-[50px] md:bottom-[50px] md:h-auto md:w-[90px] md:p-3 md:flex-col md:gap-2
                /* 1280px+ */
                xl:left-[80px] xl:top-[80px] xl:bottom-[80px] xl:w-[100px]
                /* 2000px+ */
                2k:left-[100px] 2k:top-[100px] 2k:bottom-[100px] 2k:w-[100px]">
            <Header
                title="Home"
                iconType="home"
                isActive={selectedPage === 0}
                onClick={() => onSelect(0)}
                className="flex-1 md:flex-none"
            />
            <Header
                title={<>Generate<span className="hidden md:inline"> Diet</span></>}
                iconType="diet"
                isActive={selectedPage === 1}
                onClick={() => onSelect(1)}
                className="flex-1 md:flex-none"
            />
            <Header
                title={<>Analyze<span className="hidden md:inline"> Food</span></>}
                iconType="analyze"
                isActive={selectedPage === 2}
                onClick={() => onSelect(2)}
                className="flex-1 md:flex-none"
            />

            <button
                onClick={switchMode}
                className="flex-1 flex flex-col items-center justify-center text-secondary md:flex-none md:mt-auto">
               <span className="text-lg">
                   {isDarkMode
                               ? <IconSVG
                                   type="sun"
                                   color="rgb(var(--secondary))"
                                   width='28'
                                   height='28'/>
                               : <IconSVG
                                   type="moon"
                                   color="rgb(var(--secondary))"
                                   width='28'
                                   height='28'/>}
                </span>
                <span className="mt-1 text-center whitespace-pre-line leading-tight text-secondary text-[12px] md:text-[16px]">
                    <span className="md:hidden">Mode</span>
                    <span className="hidden md:inline">
                        {isDarkMode ? 'Light' : 'Dark'} Mode
                    </span>
                </span>
            </button>
        </nav>
    );
};
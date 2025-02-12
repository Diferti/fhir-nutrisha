import { useState, useEffect } from 'react';

export const PageHolder = () => {
    return (
        <div className="fixed top-[10px] bottom-[105px] left-[10px] right-[10px] bg-background h-auto w-auto z-50 flex items-stretch
        border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.5)]
        md:top-[100px] md:bottom-[100px] md:left-[250px] md:right-[150px]">
           <div className="h-[2000px] bg-black">

           </div>
        </div>
    );
};
import { ReactNode } from 'react';

export const PageHolder = ({ children }: { children: ReactNode }) => {
    return (
        <div className="fixed z-50 bg-background border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.5)] overflow-y-auto
                /* Mobile */
                top-[10px] bottom-[105px] left-[10px] right-[10px]
                /* 768px+*/
                md:top-[50px] md:bottom-[50px] md:left-[190px] md:right-[100px]
                /* 1280px+ */
                xl:top-[80px] xl:bottom-[80px] xl:left-[230px] xl:right-[230px]
                /* 2000px+ */
                2k:top-[100px] 2k:bottom-[100px] 2k:left-[250px] 2k:right-[250px]">
      <div className="h-full 
        /* Responsive padding */
        p-4 md:p-5 xl:p-7 2k:p-10">
        {children}
      </div>
    </div>
    );
  };
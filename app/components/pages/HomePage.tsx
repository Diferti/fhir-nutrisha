import { useState, useEffect } from 'react';
import Image from 'next/image';

export const HomePage = ({ patientInfo, isDarkMode }: { patientInfo: any, isDarkMode: boolean}) => {
  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="text-center pt-[20px] px-[10px]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary font-fontHeader tracking-tight sm:text-5xl md:text-6xl">
            Welcome, {" "}
            <span className="text-primary">
              {patientInfo?.patientData.fullName || 'Valued User'}!
            </span>
          </h1>
          <div className="relative w-64 h-36 mx-auto mt-[10px]">
            <Image src={
                isDarkMode
                  ? "/images/nutrisha-images/nutrisha-logo-dark.png"
                  : "/images/nutrisha-images/nutrisha-logo.png"
              } 
              alt="Nutrisha AI Nutritionist" layout="responsive"
              width={800} height={450} quality={100} className="object-contain" priority/>
          </div>
          <p className="text-xl text-primary/50 font-fontMain sm:text-2xl md:text-3xl mt-[60px] max-w-2xl mx-auto">
            Your personal AI-powered nutritionist is ready to assist!
          </p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 pt-[30px] pb-[50px]">
      <div className="grid md:grid-cols-2 gap-8 mb-[50px]">
        <div className="h-full flex flex-col">
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.5)] h-full flex flex-col">
            <h2 className="text-3xl text-secondary font-fontHeader font-bold mb-4 text-center xl:text-start">
              Smart Nutrition Made Simple
            </h2>
            <p className="text-lg text-secondary font-fontMain mb-6">
              Nutsrisha combines AI technology with nutritional science to help you:
            </p>
            <ul className="space-y-4 text-primary font-fontMain font-extrabold flex-1">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">✅</div>
                Create personalized diet plans based on your health profile
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">📸</div>
                Analyze meal photos for instant nutritional insights
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">💪</div>
                Follow your diet plan and achieve health goals
              </li>
            </ul>
          </div>
        </div>
        

        <div className="h-full flex flex-col"> 
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.5)] h-full flex flex-col">
            <h3 className="text-3xl text-secondary font-fontHeader font-bold mb-4 text-center xl:text-start">
              How It Works
            </h3>
            <div className="space-y-6 flex-1">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 text-xl text-white font-fontMain font-bold  rounded-lg flex items-center justify-center">1</div>
                </div>
                <div>
                  <h4 className="text-lg text-primary font-fontMain font-extrabold">Set Your Preferences</h4>
                  <p className="text-secondary font-fontMain font-bold">Tell us about your dietary needs and health goals</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-600 text-xl text-white font-fontMain font-bold  rounded-lg flex items-center justify-center">2</div>
                </div>
                <div>
                  <h4 className="text-lg text-primary font-fontMain font-extrabold">Generate or Analyze</h4>
                  <p className="text-secondary font-fontMain font-bold">Create diet plans or analyze meals using AI</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-xl text-white font-fontMain font-bold rounded-lg flex items-center justify-center">3</div>
                </div>
                <div>
                  <h4 className="text-lg text-primary font-fontMain font-extrabold">Maintain Healthy Habits</h4>
                  <p className="text-secondary font-fontMain font-bold">Receive personalized nutrition guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/50 p-8 rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.5)]">
        <h3 className="text-3xl text-secondary font-fontHeader font-extrabold mb-8 text-center">
          Why Choose Nutsrisha?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-background p-6 rounded-xl text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h4 className="text-lg text-primary font-fontHeader font-extrabold mb-2">AI-Powered Analysis</h4>
            <p className="text-secondary font-fontMain font-bold">Instant nutritional breakdown of any meal photo</p>
          </div>
          <div className="bg-background p-6 rounded-xl text-center">
            <div className="text-4xl mb-4">⚕️</div>
            <h4 className="text-lg text-primary font-fontHeader font-extrabold mb-2">Medical Integration</h4>
            <p className="text-secondary font-fontMain font-bold">Health-conscious meal recommendations</p>
          </div>
          <div className="bg-background p-6 rounded-xl text-center">
            <div className="text-4xl mb-4">🥑</div>
            <h4 className="text-lg text-primary font-fontHeader font-extrabold mb-2">Balanced Nutrition</h4>
            <p className="text-secondary font-fontMain font-bold">Smart suggestions for complete meals</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
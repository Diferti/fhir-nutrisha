import { useState, useEffect } from 'react';
import Image from 'next/image';

export const HomePage = ({ patientInfo }: { patientInfo: any }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-15 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8 text-center">
        <div className="space-y-10">
          <h1 className="text-4xl font-bold text-secondary font-fontHeader tracking-tight sm:text-5xl md:text-6xl">
            Welcome,{" "}
            <span className="text-primary">
              {patientInfo?.patientData.fullName || 'Valued User'}!
            </span>
          </h1>
          
          <h3 className="text-xl text-primary/50 font-fontMain sm:text-2xl md:text-3xl">
            Your personal AI-powered nutritionist is ready to assist!
          </h3>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-2xl mx-auto aspect-video transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/nutrisha-images/nutrisha-logo.png"
            alt="Nutrisha AI Nutritionist"
            layout="responsive"
            width={800}
            height={450}
            quality={100}
            className="rounded-lg shadow-xl"
            priority
          />
        </div>

        {/* Loading State */}
        {!patientInfo && (
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            <svg className="animate-spin h-8 w-8 mx-auto text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="mt-4">Loading your personalized health profile...</p>
          </div>
        )}
      </div>
    </div>
  );
};
"use client";
import '@/app/globals.css';
import React, { useState } from "react";

export default function App({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
"use client";

import { createContext, useContext } from "react";

export const DietContext = createContext(null);

export function useDietContext() {
    return useContext(DietContext);
}
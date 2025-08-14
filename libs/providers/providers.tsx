"use client";

import AOSComponent from "../aos/aos";
import { encrypt, decrypt } from "../utils/utils";
import { ReactNode, useState, useEffect, createContext } from "react";

export const DeviceContext = createContext<string | null>(null);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const deviceId = localStorage.getItem("user_device");
    if (deviceId !== null && deviceId !== undefined) return setDeviceId(decrypt(deviceId));
    
    const newDeviceId = encrypt(Math.random().toString(36).substr(2, 16));
    localStorage.setItem("user_device", newDeviceId);
    setDeviceId(newDeviceId);
  }, []);

  return <DeviceContext.Provider value={deviceId}>{children}</DeviceContext.Provider>;
};

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
      <DeviceProvider>
        {children}
        <AOSComponent />
      </DeviceProvider>
  );
};

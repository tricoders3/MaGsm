import React from "react";
import { useLoading } from "../context/LoadingContext";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(255,255,255,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          border: '4px solid #e5e7eb',
          borderTopColor: '#0d6efd',
          animation: 'spin 1s linear infinite'
        }} />
    
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

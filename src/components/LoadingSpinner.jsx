import { C } from '../constants';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 40, message = 'Yuklanmoqda...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: '16px'
    }}>
      <div style={{
        position: 'relative',
        width: size,
        height: size
      }}>
        <Loader2 
          size={size} 
          color={C.primaryDark} 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'spin 1s linear infinite'
          }}
        />
        
        {/* Construction themed background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, ${C.primaryLight} 0deg, ${C.primary} 90deg, ${C.primaryLight} 180deg, ${C.primary} 270deg, ${C.primaryLight} 360deg)`,
          opacity: 0.1
        }} />
      </div>
      
      {message && (
        <div style={{
          fontSize: '14px',
          color: C.text,
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: C.card,
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          position: 'relative'
        }}>
          <LoadingSpinner size={60} />
        </div>
        
        <div style={{
          fontSize: '16px',
          color: C.text,
          fontWeight: '700',
          textAlign: 'center'
        }}>
          ReQurilish
        </div>
        
        <div style={{
          fontSize: '12px',
          color: C.textSub,
          textAlign: 'center'
        }}>
          Qayta ishlangan qurilish materiallari
        </div>
      </div>
    </div>
  );
}

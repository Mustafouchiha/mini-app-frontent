import { C } from '../constants';
import { AlertTriangle, Trash2, Lock, UserX } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Tasdiqlash',
  cancelText = 'Bekor qilish',
  type = 'default', // default, delete, block
  loading = false
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Trash2 size={24} color={C.danger} />;
      case 'block':
        return <Lock size={24} color={C.danger} />;
      case 'remove':
        return <UserX size={24} color={C.danger} />;
      default:
        return <AlertTriangle size={24} color={C.primaryDark} />;
    }
  };

  const getConfirmColor = () => {
    switch (type) {
      case 'delete':
      case 'block':
      case 'remove':
        return C.danger;
      default:
        return C.primaryDark;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: C.card,
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        textAlign: 'center'
      }}>
        {/* Icon */}
        <div style={{ marginBottom: '16px' }}>
          {getIcon()}
        </div>

        {/* Title */}
        <h2 style={{
          margin: '0 0 12px 0',
          fontSize: '18px',
          fontWeight: '800',
          color: C.text
        }}>
          {title}
        </h2>

        {/* Message */}
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '14px',
          color: C.textSub,
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: `1.5px solid ${C.border}`,
              background: C.bg,
              color: C.text,
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit'
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: `1.5px solid ${getConfirmColor()}`,
              background: getConfirmColor(),
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderRadius: '50%',
                borderTop: '2px solid transparent',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

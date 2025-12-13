import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import styles from '../../styles/chat.module.css';

const MessageStatus = ({ status, isRead }) => {
  // Debug: Log when rendering read status
  if (status === 'read' || isRead) {
    console.log('💙 Rendering BLUE tick:', { status, isRead });
  }

  if (status === 'sending' || status === 'sent') {
    return (
      <span className={styles.messageStatus}>
        <CheckIcon sx={{ fontSize: 16 }} className={styles.checkmark} />
      </span>
    );
  }

  if (status === 'delivered') {
    return (
      <span className={styles.messageStatus}>
        <DoneAllIcon sx={{ fontSize: 16 }} className={styles.checkmark} />
      </span>
    );
  }

  if (status === 'read' || isRead) {
    return (
      <span className={styles.messageStatus}>
        <DoneAllIcon sx={{ fontSize: 16 }} className={`${styles.checkmark} ${styles.read}`} />
      </span>
    );
  }

  if (status === 'failed') {
    return (
      <span className={styles.messageStatus} style={{ color: '#f44336' }}>
        !
      </span>
    );
  }

  return null;
};

export default MessageStatus;

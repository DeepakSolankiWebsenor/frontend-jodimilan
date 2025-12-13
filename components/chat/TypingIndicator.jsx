import React from 'react';
import styles from '../../styles/chat.module.css';

const TypingIndicator = ({ userName }) => {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingDots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <span className={styles.typingText}>
        {userName} is typing...
      </span>
    </div>
  );
};

export default TypingIndicator;

'use client';

import { useState } from 'react';
import styles from './URLInput.module.css';

export default function URLInput({ onSubmit, currentUrl }) {
  const [url, setUrl] = useState(currentUrl || '');
  const [error, setError] = useState('');

  function normalizeUrl(input) {
    let trimmed = input.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return null;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError('Please enter a valid URL');
      return;
    }
    setError('');
    setUrl(normalized);
    onSubmit(normalized);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>Website URL</label>
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="https://example.com"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError('');
          }}
        />
        <button type="submit" className={styles.goButton}>
          Load
        </button>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </form>
  );
}

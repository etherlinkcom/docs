/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useCallback, useState, useRef, useEffect} from 'react';
import clsx from 'clsx';
import copy from 'copy-text-to-clipboard';

import styles from './styles.module.css';

export default function CopyButton({code, className}) {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef<number | undefined>(undefined);
  const handleCopyCode = useCallback(() => {
    copy(code);
    setIsCopied(true);
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [code]);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  return (
    <button
      type="button"
      aria-label="Copied"
      title="Copy"
      className={clsx(
        className,
        styles.copyButton,
      )}
      onClick={handleCopyCode}>
        {isCopied 
          ? <img className={clsx(styles.copyIcon, styles.noZoom)}  src='/img/copy-success.svg' alt='copy success icon' />
          : <img className={clsx(styles.copyIcon, styles.noZoom)}  src='/img/FiCopy.svg' alt='copy icon' />
        }
    </button>
  );
}
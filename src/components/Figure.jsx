/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function Figure({ src, caption, width }) {
  return (
    <figure style={{ border: '1px solid #888', padding: 20, width: 'fit-content' }}>
      <img src={useBaseUrl(src)} alt={caption} width={width}/>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
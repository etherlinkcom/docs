/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function Figure({ src, caption, width, border }) {
  return (
    <figure style={{ border: border ?? 'none', padding: 20, width: 'fit-content' }}>
      <img src={useBaseUrl(src)} alt={caption} width={width}/>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

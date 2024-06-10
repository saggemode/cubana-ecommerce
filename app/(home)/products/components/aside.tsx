import React from 'react'

export type QueryType = {
  isReady: boolean
  pathname: string
  query: {
    [queryName: string]: string | undefined
  }
}

const Aside = () => {
  return <div>aside</div>
}

export default Aside
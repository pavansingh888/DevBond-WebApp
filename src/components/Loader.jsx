import React from 'react'

const Loader = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
      </div>
  )
}

export default Loader
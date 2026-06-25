import CheckoutContent from '@/components/CheckoutContent'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <CheckoutContent/>
    </Suspense>
  )
}

export default page
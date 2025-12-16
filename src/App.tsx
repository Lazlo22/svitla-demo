import { Suspense } from 'react'
import { RouterProvider } from 'react-router'

import GlobalLoader from '@components/common/GlobalLoader'
import { router } from '@constants/routes'

export default function App() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

import SearchContent from "@/components/SearchContent"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent/>
    </Suspense>
  )
}

export default page
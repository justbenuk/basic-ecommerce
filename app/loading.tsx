import Image from "next/image"
import loader from '@/assets/loader.gif'

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', width: '100dvw' }}>
      <Image src={loader} height={150} width={150} alt="Loading..." />
    </div>
  )
}


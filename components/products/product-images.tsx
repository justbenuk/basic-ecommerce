'use client'
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  return (
    <div className="space-y-4">
      <Image src={images[current]} alt='product image' width={1000} height={1000} className="min-h-[300px] object-cover object-center" />
      <div className="flex">
        {images.map((image, idx) => (
          <div key={idx} className={cn('border mr-2 cursor-pointer hover:border-orange-600', current === idx && 'border-orange-500')} onClick={() => setCurrent(idx)}>
            <Image src={image} alt='product image' width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  )
}


import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { prisma } from '../../lib/db'

export default async function Home() {
  const catagory = await prisma.category.findMany({ orderBy: { code: 'asc' } })

  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
      <Button>test button</Button>
      <ul>
        {catagory.map((c, index) => {
          return <span key={index}>{c.name}</span>
        })}
      </ul>
    </h1>
  )
}

import MoneyInputDemo from './money-input/page'

export default async function Home() {
  //const catagory = await prisma.category.findMany({ orderBy: { code: 'asc' } })

  return (
    <h1 className="flex flex-col items-center justify-center min-h-screen p-4">
      <MoneyInputDemo />
    </h1>
  )
}

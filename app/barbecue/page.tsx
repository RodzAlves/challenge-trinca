import { getBarbecues } from '@/actions/barbecue'
import { BarbecueHeader } from './_components/barbecue-header'
import { BarbecueList } from './_components/barbecue-list'

export default async function Barbecue() {
  const barbecues = await getBarbecues()

  return (
    <div className="py-8">
      <BarbecueHeader />
      
      <div className="mt-8 border-separate w-full" />

      {barbecues.length === 0 && (
        <div className="flex flex-col items-center self-center justify-center">
          <p className="text-2xl text-center font-semibold text-gray-900">
            Nenhum churrasco cadastrado
          </p>
          <p className="text-gray-500 text-center">
            Clique no botão acima para cadastrar um novo churrasco.
          </p>
        </div>
      )}

      <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BarbecueList barbecues={barbecues} />
      </div>
    </div>
  )
}

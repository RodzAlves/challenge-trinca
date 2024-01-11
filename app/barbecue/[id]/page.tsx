import { getBarbecueDetails } from '@/actions/barbecue'
import { redirect } from 'next/navigation'
import { DetailsHeader } from './_components/details-header'
import { ParticipantList } from './_components/participant-list'

export default async function BarbecueDetails({
  params,
}: {
  params: { id: string }
}) {
  if (!params.id) {
    redirect('/barbecue')
  }

  const barbecue = await getBarbecueDetails(params.id)

  if (!barbecue) {
    redirect('/barbecue')
  }

  return (
    <div className="py-8 flex flex-col justify-center">
      <DetailsHeader {...barbecue} />

      <div className="mt-8 border-separate w-full" />

      <h1 className="text-2xl font-semibold text-accent-foreground my-4">
        Participantes
      </h1>

      <div className="flex flex-col space-y-4">
        {barbecue.participants.length === 0 && (
          <div className="w-full mt-4 flex flex-col items-center self-center justify-center">
            <p className="text-2xl font-semibold text-gray-900">
              Nenhum participante cadastrado
            </p>
            <p className="text-gray-500 text-center">
              Clique no botão acima para cadastrar um novo participante
            </p>
          </div>
        )}

        <ParticipantList participants={barbecue.participants} />
      </div>
    </div>
  )
}

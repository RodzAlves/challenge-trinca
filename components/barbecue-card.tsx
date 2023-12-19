import { Barbecue } from '@prisma/client'

export interface BarbecueCardProps extends Barbecue {
  totalParticipants: number
  totalCollected: number
}

export function BarbecueCard({
  id,
  name,
  date,
  totalParticipants,
  totalCollected,
}: BarbecueCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-indigo-600">
            <a href={`/barbecue/${id}`} className="hover:underline">
              {name}
            </a>
          </p>
          <a href={`/barbecue/${id}`} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">{`${date.getDay()}/${date.getMonth()}`}</p>
          </a>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {totalParticipants} participantes
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime="2020-03-16">{totalCollected} arrecadado</time>
              <span aria-hidden="true">&middot;</span>
              <span>1 dia restante</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

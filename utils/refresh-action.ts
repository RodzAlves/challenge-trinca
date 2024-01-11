import { sleep } from './sleep'

export async function refreshAction(
  refresh: () => void,
  action: () => Promise<any> | any
) {
  refresh()

  await sleep(1000)

  await action()
}

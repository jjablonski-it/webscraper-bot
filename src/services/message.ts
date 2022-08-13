
interface JobBaseMessage {
  jobName: string
  ok?: boolean
}
const jobBaseMessage = ({ jobName, ok = true }: JobBaseMessage) =>
  `${ok ? '✅' : '❌'} job **${jobName}**`

export const jobOutputMessage = ({
  message,
  ...baseProps
}: JobBaseMessage & { message: string }) =>
  `${jobBaseMessage(baseProps)}\n${message
    .split('\n')
    .map((m) => `> ${m}`)
    .join('\n')}`

export const jobActionMessage = ({
  action,
  ...baseProps
}: JobBaseMessage & { action: string }) =>
  `${jobBaseMessage(baseProps)} \`${action}\``

interface JobBaseMessage {
  jobName: string
  ok?: boolean
}

export const errorMessage = (message: string) => `❌ ${message}`

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
  postfix,
  ...baseProps
}: JobBaseMessage & { action: string; postfix?: string }) =>
  `${jobBaseMessage(baseProps)} \`${action}\`${postfix}`

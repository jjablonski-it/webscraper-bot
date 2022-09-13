export const cleanQueryParams = (url: string) => {
  const parsed = new URL(url)
  parsed.search = ''
  return parsed.toString()
}

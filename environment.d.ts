declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_TOKEN: string
      DATABASE_URL: string
      DEFAULT_SCRAPE_INTERVAL?: `${number}`
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}

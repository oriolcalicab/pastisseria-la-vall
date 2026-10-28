import type { Express } from 'express'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

export type TestServer = {
  baseUrl: string
  close: () => void
}

export const startTestServer = (app: Express) =>
  new Promise<TestServer>((resolve) => {
    const server: Server = app.listen(0, () => {
      const { port } = server.address() as AddressInfo

      resolve({ baseUrl: `http://localhost:${port}`, close: () => server.close() })
    })
  })

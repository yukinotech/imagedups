import net from 'net'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import { spawn } from 'child_process'

const options: {
  // default is atri
  prefix?: string
  // default is empty string
  suffix?: string
  // default is os.tmpdir()
  tmpdir?: string
  cmd: string
  args?: string[]
  env?: typeof process.env
  abortController?: AbortController
} = {
  cmd: 'python',
  args: ['src/py-ipc.py'],
}

const callbacks = {
  abortController: () => {},
  onStdError: (errdata: Buffer) => {
    console.log('onStdError', errdata.toString('utf-8'))
  },
  onStdOut: (outdata: Buffer) => {
    console.log('onStdOut', outdata.toString('utf-8'))
  },
  onChildProcessClose: (closeCode: number | null) => {
    console.log('onChildProcessClose', closeCode)
  },
}

export function generateSocketFilename(options: {
  prefix?: string
  suffix?: string
  tmpdir?: string
}) {
  let { prefix, suffix, tmpdir } = options
  prefix = prefix !== undefined ? prefix : 'atri'
  suffix = suffix !== undefined ? suffix : ''
  tmpdir = tmpdir !== undefined ? tmpdir : os.tmpdir()
  return path.join(
    tmpdir,
    prefix + crypto.randomBytes(16).toString('hex') + suffix
  )
}

export function createIPCServer(callbacks: {
  onClientSocketEnd?: (data: string) => void
}) {
  const { onClientSocketEnd } = callbacks

  const server = net.createServer((socket) => {
    let chunk = ''
    socket.on('data', (data) => {
      chunk = chunk + data.toString()
    })
    socket.on('end', function () {
      onClientSocketEnd?.(chunk)
      server.close()
    })
  })

  return server
}

export function executeChildProcess(
  options: {
    cmd: string
    args?: string[]
    env?: typeof process.env
    abortController?: AbortController
  },
  callbacks: {
    onStdOut?: (data: Buffer) => void
    onStdError?: (data: Buffer) => void
  }
) {
  return new Promise<number | null>((res) => {
    const { cmd, args, env } = options
    const { onStdError, onStdOut } = callbacks
    const abortController = options.abortController ?? new AbortController()
    const childProcess = spawn(cmd, args, {
      env,
      signal: abortController.signal,
    })
    childProcess.stdout.on('data', (data) => {
      onStdOut?.(data)
    })

    childProcess.stderr.on('data', (data) => {
      onStdError?.(data)
    })

    childProcess.on('close', (code) => {
      res(code)
    })
  })
}

const server = createIPCServer({
  onClientSocketEnd: (data) => {
    console.log('IPC end, js拿到python数据', data)
  },
})

const ATRI_IPC_PATH =
  process.platform === 'win32'
    ? // ? generatePipePath(options)
      ''
    : generateSocketFilename(options)

const extraEnv = { ATRI_IPC_PATH }

console.log('ATRI_IPC_PATH in node', ATRI_IPC_PATH)

server.listen(ATRI_IPC_PATH, () => {
  // callbacks?.onServerListen?.(ATRI_IPC_PATH)
  executeChildProcess(
    {
      cmd: options.cmd,
      args: options.args,
      env: {
        ...(options.env !== undefined ? options.env : process.env),
        ...extraEnv,
      },
      abortController: options.abortController,
    },
    { onStdError: callbacks?.onStdError, onStdOut: callbacks?.onStdOut }
  ).then(callbacks?.onChildProcessClose)
})

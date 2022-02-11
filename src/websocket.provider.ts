import { Provider } from '@nestjs/common'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'reconnecting-websocket'
import { defer, lastValueFrom } from 'rxjs'
import { WEBSOCKET_MODULE_OPTIONS, WEBSOCKET_PROVIDER_NAME } from './websocket.constants'
import { WebSocketModuleAsyncOptions, WebSocketModuleOptions } from './websocket.interface'
import { getWebSocketToken } from './websocket.utils'

async function createWebSocket(_options: WebSocketModuleOptions): Promise<ReconnectingWebSocket> {
  try {
    const { url, protocols, options } = _options
    let ws: WebSocket

    if (protocols) {
      ws = new WebSocket(url, protocols, options)
    } else {
      ws = new WebSocket(url, [], options)
    }

    return ws
  } catch (err) {
    throw new Error(`The connection cannot be established. ${err}`)
  }
}

export function createWebSocketProvider(options: WebSocketModuleOptions): Provider {
  return {
    provide: getWebSocketToken(),
    useFactory: async (): Promise<ReconnectingWebSocket> => {
      return await lastValueFrom(defer(() => createWebSocket(options)))
    },
  }
}

export function createWebSocketAsyncProvider(): Provider {
  return {
    provide: getWebSocketToken(),
    useFactory: async (options: WebSocketModuleOptions): Promise<ReconnectingWebSocket> => {
      return lastValueFrom(defer(() => createWebSocket(options)))
    },
    inject: [WEBSOCKET_MODULE_OPTIONS],
  }
}

export function createAsyncOptionsProvider(options: WebSocketModuleAsyncOptions): Provider {
  return {
    provide: WEBSOCKET_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject || [],
  }
}

export function createProviderName(): Provider {
  return {
    provide: WEBSOCKET_PROVIDER_NAME,
    useValue: getWebSocketToken(),
  }
}

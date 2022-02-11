import { ModuleMetadata } from '@nestjs/common'
import { Options } from 'reconnecting-websocket'

export interface WebSocketModuleOptions extends Record<string, any> {
  url: string
  protocols?: string | string[]
  options?: Options
}

export interface WebSocketModuleAsyncOptions extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  useFactory: (...args: any[]) => WebSocketModuleOptions | Promise<WebSocketModuleOptions>
  inject?: any[]
}

export interface WebSocketEventMetadata {
  event: string
}

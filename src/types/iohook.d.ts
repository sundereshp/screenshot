
declare module 'iohook' {
  interface IOHookEvent {
    type: string;
    keycode?: number;
    button?: number;
    x?: number;
    y?: number;
  }

  export function start(): void;
  export function stop(): void;
  export function on(event: string, callback: (msg: IOHookEvent) => void): void;
  function start(enableLogger?: boolean): void;
  function stop(): void;
  function on(event: string, callback: (event: any) => void): void;
  function unregisterAll(): void;
  function unload(): void;
  function unregisterAllListeners(): void;
}
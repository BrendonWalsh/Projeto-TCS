declare module 'imap' {
  import * as EventEmitter from 'events';

  interface ImapOptions {
    user: string;
    password: string;
    host: string;
    port: number;
    tls: boolean;
  }

  class Imap extends EventEmitter {
    constructor(options: ImapOptions);
    openBox(boxName: string, readOnly: boolean, callback: (error: any, box: any) => void): void;
    search(criteria: any[], callback: (error: any, results: any[]) => void): void;
    fetch(results: any[], options: any): EventEmitter;
    end(): void;
    once(event: 'ready' | 'error', listener: (args: any) => void): this;
    connect(): void;
  }

  export = Imap;
}

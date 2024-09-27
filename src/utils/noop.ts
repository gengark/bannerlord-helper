// Type definition for noop function
export type Noop = (...arguments_: any[]) => any;

// No-operation function
const noop: Noop = (...arguments_: any[]): any => {};

export default noop;

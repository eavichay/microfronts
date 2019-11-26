export enum MFEvents {
  ROUTE_CHANGED = 'route-changed',
  GLOBAL_MESSAGE = 'global-message',
  INCOMING_MESSAGE = 'incoming-message',
  NAVIGATION_CHANGE = 'navigation-change',
}

export interface MFMessage<T = any> {
  type: string;
  data?: T
}
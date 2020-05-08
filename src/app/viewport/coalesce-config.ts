import { IConfig } from './config.interface';

export function coalesceViewportConfig(config: Partial<IConfig> = {}): IConfig {
  return {
    medium: config.medium || 800,
    large: config.large || 1280,
  };
}
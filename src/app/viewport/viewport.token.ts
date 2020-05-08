import { InjectionToken } from '@angular/core';
import { IConfig } from './config.interface';

export const VIEWPORT_CONFIG = new InjectionToken<IConfig>('VIEWPORT_CONFIG')
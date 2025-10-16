export interface Versions {
  major: number;
  minor: number;
  patch: number;
  version: 'stable' | 'dev' | 'alpha' | 'beta' | `rc-${number}`;
}

export interface Permissions {
  dev: string[];
  admin: string[];
  blacklist: string[];
}

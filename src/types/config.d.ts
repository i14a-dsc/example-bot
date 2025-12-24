export interface Versions {
  major: number;
  minor: number;
  patch: number;
  patchline:
    | 'stable'
    | 'dev'
    | 'alpha'
    | 'beta'
    | `stable-${number | string}`
    | `dev-${number | string}`
    | `alpha-${number | string}`
    | `beta-${number | string}`
    | `rc-${number | string}`;
}

export interface Permissions {
  dev: string[];
  admin: string[];
  blacklist: string[];
}

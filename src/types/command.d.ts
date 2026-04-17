import type {
  APIApplicationCommandOption,
  ApplicationCommandType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  InteractionContextType,
  LocalizationMap,
  Permissions,
  Snowflake,
} from 'discord.js';

export interface Command {
  permission?: {
    dev?: boolean;
    admin?: boolean;
    trusted?: boolean;
    blacklist?: boolean;
  };
  data: API;
  /* eslint-disable-next-line */
  run: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
}

export interface API {
  type: ApplicationCommandType;
  application_id?: Snowflake;
  integration_types?: ApplicationIntegrationType[];
  guild_id?: Snowflake;
  name: string;
  name_localizations?: LocalizationMap | null;
  description: string;
  description_localizations?: LocalizationMap | null;
  options?: APIApplicationCommandOption[];
  default_member_permissions?: Permissions | null;
  default_permission?: boolean;
  nsfw?: boolean;
  contexts?: InteractionContextType[] | null;
}

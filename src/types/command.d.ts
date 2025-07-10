import type {
  APIApplicationCommandOption,
  ApplicationCommandDataResolvable,
  ApplicationCommandType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  InteractionContextType,
  LocalizationMap,
  Permissions,
  Snowflake,
} from 'discord.js';

export interface Command {
  data: API;
  /* eslint-disable-next-line no-unused-vars */
  run: (interaction: ChatInputCommandInteraction) => Promise<any>;
}

export interface API {
  type: ApplicationCommandType | number | Partial<ApplicationCommandDataResolvable>;
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
  integration_types: ApplicationIntegrationType[];
  contexts?: InteractionContextType[] | null;
}

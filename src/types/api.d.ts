import type { APIEmbed, BitFieldResolvable, JSONEncodable, MessageFlags, MessageFlagsString } from 'discord.js';

export type flags = BitFieldResolvable<
  Extract<MessageFlagsString, 'Ephemeral' | 'SuppressEmbeds' | 'SuppressNotifications' | 'IsComponentsV2'>,
  | MessageFlags.Ephemeral
  | MessageFlags.SuppressEmbeds
  | MessageFlags.SuppressNotifications
  | MessageFlags.IsComponentsV2
>[];

export type embeds = (JSONEncodable<APIEmbed> | APIEmbed)[];

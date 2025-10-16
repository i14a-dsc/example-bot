import {
  type APIButtonComponentWithCustomId,
  type APIComponentInContainer,
  type APIMessageComponent,
  type APIMessageComponentEmoji,
  type APISelectMenuOption,
  type APISeparatorComponent,
  type APIStringSelectComponent,
  type APITextInputComponent,
  ComponentType,
} from 'discord.js';
import { getConfig } from '../config/config';

/**
 * Creates a simple button component with a custom ID and style.
 * This function is a shorthand for creating buttons with a label, custom ID, and style.
 *
 * @example
 * const button = simpleButton('Click me', 'click_me', 1);
 *
 * * 1 = ButtonStyle.Primary
 * * 2 = ButtonStyle.Secondary
 * * 3 = ButtonStyle.Success
 * * 4 = ButtonStyle.Danger
 *
 * @param {string} label The label of the button
 * @param {string} custom_id The custom id of the button
 * @param {ButtonStyle} style The style of the button
 * @returns {APIButtonComponentWithCustomId}
 */
export function button(
  label: string,
  custom_id: string,
  style: 1 | 2 | 3 | 4,
  emoji: APIMessageComponentEmoji | undefined = undefined,
): APIButtonComponentWithCustomId {
  return {
    type: 2,
    label,
    custom_id,
    style,
    emoji,
  };
}

export function separator(): APISeparatorComponent {
  return {
    type: ComponentType.Separator,
  };
}

export const closeButton: APIButtonComponentWithCustomId = {
  emoji: { name: '🗑️' },
  type: 2,
  label: 'Close',
  custom_id: 'delete-message',
  style: 4,
};

export function textDisplay(content: string | string[]): APIComponentInContainer {
  if (typeof content !== 'string') {
    content = content.join('\n');
  }
  return {
    type: ComponentType.TextDisplay,
    content,
  };
}

export function errorComponent(content: string): APIMessageComponent[] {
  return [
    {
      type: ComponentType.Container,
      components: [
        textDisplay('# 🔴 There is an error occurred'),
        textDisplay(content),
        separator(),
        textDisplay(getConfig().toString()),
        {
          type: ComponentType.ActionRow,
          components: [button('Close', 'delete-message', 4)],
        },

        textDisplay("-# If you can't delete this message with red button, please click blue text below red button."),
      ],
    },
  ];
}

export function selectMenu({
  custom_id,
  options,
  placeholder,
  disabled = false,
}: {
  custom_id: string;
  options: APISelectMenuOption[];
  placeholder?: string;
  disabled?: boolean;
}): APIStringSelectComponent {
  return {
    type: ComponentType.StringSelect,
    custom_id,
    placeholder,
    disabled,
    options,
  };
}

export function textInput({
  custom_id,
  label,
  value,
  style = 1,
  min_length,
  max_length,
}: {
  custom_id: string;
  label: string;
  value: string;
  style?: number;
  min_length?: number;
  max_length?: number;
}): APITextInputComponent {
  return {
    type: ComponentType.TextInput,
    custom_id,
    label,
    value,
    style,
    min_length,
    max_length,
  };
}

export function actionRow(...components: APIMessageComponent[]) {
  return {
    type: ComponentType.ActionRow,
    components,
  };
}

export function linkButton(
  label: string,
  url: string,
  emoji?: APIMessageComponentEmoji,
): {
  type: 2;
  label: string;
  url: string;
  style: 5;
  emoji?: APIMessageComponentEmoji;
} {
  return {
    type: 2,
    label,
    url,
    style: 5,
    emoji,
  };
}

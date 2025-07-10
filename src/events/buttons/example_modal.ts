import { ButtonInteraction, ComponentType } from 'discord.js';
import { textInput } from '../../utils/components';

export function run(interaction: ButtonInteraction) {
  interaction.showModal({
    custom_id: 'example',
    title: 'Example modal',
    components: [
      {
        type: ComponentType.ActionRow,
        components: [textInput({ custom_id: 'example_input', label: 'Example text input', value: 'Example value' })],
      },
    ],
  });
}

import { MessageSelectMenu } from "discord.js";
import { selectMenuId } from "../../utils/globals";

export type MapConfigSelectorProps = {
  options: string[];
  defaultOption?: string;
  placeholder?: string;
  disabled?: boolean;
};

export const mapConfigSelectorDefault = ({
  options,
  defaultOption,
  placeholder,
  disabled,
}: MapConfigSelectorProps) => {
  return new MessageSelectMenu()
    .setCustomId(selectMenuId.selectMapConfig)
    .setPlaceholder(placeholder || "Select map config")
    .setDisabled(disabled || false)
    .addOptions(
      options.map((option) => {
        return {
          label: option,
          value: option,
          default: option === defaultOption,
        };
      })
    );
};

export const mapConfigSelectorLoading = ({
  options,
  defaultOption,
  placeholder,
  disabled,
}: MapConfigSelectorProps) => {
  return new MessageSelectMenu()
    .setCustomId(selectMenuId.selectMapConfig)
    .setPlaceholder(placeholder || "Loading map...")
    .setDisabled(disabled || true)
    .addOptions(
      options.map((option) => {
        return {
          label: option,
          value: option,
          default: option === defaultOption,
        };
      })
    );
};

export const mapConfigSelectorSuccess = ({
  options,
  defaultOption,
  placeholder,
  disabled,
}: MapConfigSelectorProps) => {
  return new MessageSelectMenu()
    .setCustomId(selectMenuId.selectMapConfig)
    .setPlaceholder(placeholder || "Map loaded")
    .setDisabled(disabled || true)
    .addOptions(
      options.map((option) => {
        return {
          label: option,
          value: option,
          default: option === defaultOption,
        };
      })
    );
};

export const mapConfigSelectorError = ({
  options,
  defaultOption,
  placeholder,
  disabled,
}: MapConfigSelectorProps) => {
  return new MessageSelectMenu()
    .setCustomId(selectMenuId.selectMapConfig)
    .setPlaceholder(placeholder || "Network error")
    .setDisabled(disabled || true)
    .addOptions(
      options.map((option) => {
        return {
          label: option,
          value: option,
          default: option === defaultOption,
        };
      })
    );
};

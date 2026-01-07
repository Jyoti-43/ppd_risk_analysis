// selectStyles.ts
import { useMemo } from "react";

export function useCustomSelectStyles() {
  return useMemo(
    () => ({
      control: (provided: any) => ({
        ...provided,
        backgroundColor: "var(--input)",
        borderColor: "var(--border)",
        borderRadius: "0.375rem",
        boxShadow: "none",
        "&:hover": {
          borderColor: "var(--primary)",
        },
      }),
      menu: (provided: any) => ({
        ...provided,
        backgroundColor: "var(--card)",
        border: `1px solid var(--border)`,
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "var(--primary)"
          : state.isFocused
          ? "var(--accent)"
          : "transparent",
        color: state.isSelected
          ? "var(--primary-foreground)"
          : "var(--foreground)",
        cursor: "pointer",
        "&:active": {
          backgroundColor: "var(--primary)",
        },
      }),
      multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: "var(--secondary)",
        borderRadius: "0.375rem",
      }),
      multiValueLabel: (provided: any) => ({
        ...provided,
        color: "var(--foreground)",
      }),
      multiValueRemove: (provided: any) => ({
        ...provided,
        color: "var(--foreground)",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        },
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: "var(--foreground)",
      }),
      placeholder: (provided: any) => ({
        ...provided,
        color: "var(--muted-foreground)",
      }),
      input: (provided: any) => ({
        ...provided,
        color: "var(--foreground)",
      }),
    }),
    []
  );
}
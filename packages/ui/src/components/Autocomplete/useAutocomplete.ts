import { useCallback, useState } from "react"

import type { Option } from "./Autocomplete"

type UseAutocompleteProps = {
  options: Option[]
  selectedOption: Option
  setSelectedOption: React.Dispatch<React.SetStateAction<Option>>
}

export function useAutocomplete({
  options,
  selectedOption,
  setSelectedOption,
}: UseAutocompleteProps) {
  const [open, setOpen] = useState(false)

  const findCorrespondingOption = useCallback(() => {
    const match = options.find(
      (option) =>
        option.value.toLowerCase() === selectedOption.value.toLowerCase()
    )?.label

    if (!match) return selectedOption.label

    return match
  }, [options, selectedOption.label, selectedOption.value])

  const handleSelect = useCallback(
    (currentLabel: string) => {
      const currentValueInOptions = options.find(
        (option) => option.label.toLowerCase() === currentLabel.toLowerCase()
      )

      if (currentValueInOptions) {
        setSelectedOption(
          currentLabel === selectedOption.label.toLowerCase()
            ? { label: "", value: "" }
            : currentValueInOptions
        )
      }

      setOpen(false)
    },
    [options, selectedOption, setSelectedOption]
  )

  return { open, setOpen, findCorrespondingOption, handleSelect }
}

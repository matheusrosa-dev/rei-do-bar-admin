import { useEffect, useImperativeHandle, useState, type Ref } from "react";
import { Input } from "./form/input";
import { FiSearch } from "react-icons/fi";

export type SearchInputRef = {
  clear: () => void;
};

type Props = {
  ref?: Ref<SearchInputRef>;
  searchTerm: string | undefined;
  onChangeSearchTerm: (newValue: string | undefined) => void;
};

export const SearchInput = ({ searchTerm, ref, onChangeSearchTerm }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm ?? "");

  useImperativeHandle(ref, () => ({
    clear: () => setInputValue(""),
  }));

  useEffect(() => {
    if (!isMounted) return;

    const timeout = setTimeout(() => {
      onChangeSearchTerm(inputValue || undefined);
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Input
      label="Pesquisar"
      placeholder="Pesquisar"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      leftIcon={<FiSearch className="size-4" />}
    />
  );
};

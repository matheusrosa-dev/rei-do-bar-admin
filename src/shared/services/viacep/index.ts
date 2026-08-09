export type ViaCepAddress = {
  street: string;
  neighborhood: string;
};

type ViaCepResponse = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: true;
};

export type LookupZipCode = (zipCode: string) => Promise<ViaCepAddress | null>;

export type UseViaCepService = () => {
  lookupZipCode: LookupZipCode;
};

export const useViaCepService: UseViaCepService = () => {
  const lookupZipCode: LookupZipCode = async (zipCode) => {
    const cleaned = zipCode.replace(/\D/g, "");
    if (cleaned.length !== 8) return null;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      if (!response.ok) return null;
      const data: ViaCepResponse = await response.json();
      if (data.erro) return null;
      return {
        street: data.logradouro,
        neighborhood: data.bairro,
      };
    } catch {
      return null;
    }
  };

  return { lookupZipCode };
};

export interface IDeliveryPersonAddress {
  street: string;
  number: string;
  neighborhood: string;
  zipCode: string;
}

export interface IDeliveryPerson {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressZipCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDeliveryPersonListItem extends IDeliveryPerson {
  ordersCount: number;
}

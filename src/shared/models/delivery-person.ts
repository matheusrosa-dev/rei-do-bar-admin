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
  address: IDeliveryPersonAddress;
  ordersCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

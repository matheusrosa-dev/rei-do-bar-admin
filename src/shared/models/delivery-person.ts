export interface IDeliveryPersonAddress {
  street: string;
  number: string;
  neighborhood: string;
  zipCode: string;
}

interface IDeliveryPersonBase {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDeliveryPerson extends IDeliveryPersonBase {
  address: IDeliveryPersonAddress;
  ordersCount: number;
  isVolunteer: boolean;
}

export interface IDeliveryPersonWithAccess extends IDeliveryPerson {
  hasAccess: boolean;
}

export interface IOrderDeliveryPerson extends IDeliveryPersonBase {
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressZipCode: string;
}

interface IDeliveryPersonBase {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  isActive: boolean;
  isVolunteer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDeliveryPerson extends IDeliveryPersonBase {
  ordersCount: number;
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

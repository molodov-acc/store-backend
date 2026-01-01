export type Promotion = {
  id: string;
  title: string;
  description?: string;
  discountValue: number;
  active: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePromotion = {
  title: string;
  description?: string;
  discountValue: number;
  active: boolean;
  startDate: string;
  endDate: string;
};

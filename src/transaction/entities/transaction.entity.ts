import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Currencies {
    "XAF"="XAF",
    "USD"="USD"
}

@Entity()
export class TransactionEntity {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:"numeric"})
  total_amount: number;

  @Column({unique: true,})
  transaction_id: string;

  @Column() 
  return_url: string
  
  @Column({
    type: "enum",
    enum: Currencies,
  })
  currency: Currencies

  @Column({
    type:"longtext"
  })
  t_id:string

  @Column(
    {
      type:"longtext"
    }
  )
  t_sum:string

  @Column({
    type:"longtext"
  })
  t_url:string
}

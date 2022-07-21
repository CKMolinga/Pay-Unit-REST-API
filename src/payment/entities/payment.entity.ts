import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    transaction_id: string;

    @Column()
    gateway: string;

    @Column({ type: "longtext", nullable:true})
    payment_ref: string;

    @Column({ type: "longtext", nullable:true})
    pay_token: string;

    @Column({ type: "longtext", nullable:true})
    auth_token: string;

    @Column({ type: "longtext", nullable:true})
    paytoken: string;

    @Column({ type: "longtext", nullable:true})
    x_token: string;
}

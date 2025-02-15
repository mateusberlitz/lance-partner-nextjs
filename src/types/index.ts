export interface ReadyQuota{
    id: number;
    sold: boolean;
    segment: string;
    value?: number;
    credit: number;
    deadline?: number;
    parcel?: number;
    group?: string;
    quota?: string;
    cost?: number;
    partner_cost?: number;
    passed_cost?: number;
    total_cost?: number;
    seller?: string;
    cpf_cnpj?: string;
    paid_percent?: string;
    partner?: Partner;
    partner_percent?: number;
    tax?: number;
    common_fund?: number;
    contemplated_type?: string;
    is_contemplated: boolean;
    is_hot: boolean;
    reserved: boolean;
    month_adjust_number?: number;
    adjust_index?: string;
    description?: string;
    purchase_date?: string;

    investor_id?: number;
    investor_cost?: number;
    investor_percent?: number;

    parcel_deadline?: string;

    purchased_of_id?: number;
    purchased_of_type?: string;

    owner_type?: string;
    owner_id?: number;

    coordinator_id?: number;
    coordinator_commission?: number;

    supervisor_id?: number;
    supervisor_commission?: number;

    created_at?: Date;
    updated_at?: Date;
}

export interface SaleReadyQuota{
    id: number;
    ready_quota_id: number;
    ready_quota: ReadyQuota;
    quota_sale_id: number;
    coordinator_id: number;
    coordinator_value: number;
    supervisor_id: number;
    supervisor_value: number;
    investor_percent: number;
    investor_value: number;
    value: number;
    profit: number;
    broker_id: number;
    broker_value: number;
    tax: number;
    partner_profit: number;
    created_at: string;
    updated_at: string;
}

export interface QuotaSale{
    id: number;
    cancelled: boolean;
    ready_quota: ReadyQuota;
    sale_ready_quotas: SaleReadyQuota[];
    value: number;
    passed_value: number;
    partner_profit: number;
    total_cost: number;
    seller?: string;
    profit: number;
    tax?: number;
    coordinator_id?: number;
    coordinator_value?: number;
    supervisor_id?: number;
    supervisor_value?: number;
    broker_value?: number;
    description?: string;
    sale_date: string;
    created_at?: Date;
    updated_at?: Date;

    buyer_id?: number;
    salesman_id?: number;
    buyer_type?: string;
}

export interface QuotaProcess{
    id: number;
    partner_id: number;
    client_name: string;
    group: string;
    quota: string;
    finished: boolean;
    created_at: string;
    updated_at: string;
}

export interface Partner{
    id: number;
    name: string;
    slug: string;
    name_display: string;
    email: string;
    phone: string;
    email_display: string;
    cnpj: string;
    address: string;
    logo: string;
    color: string;
    second_color: string;

    sold_quotas_count: number,
    sold_quotas_total: number,
    bought_quotas_count: number,
    bought_quotas_total: number,
    processes: number,
    finished_processes: number,

    bought_quotas?: QuotaSale[],
    sold_quotas?: ReadyQuota[],

    quota_processes: QuotaProcess[],

    created_at: string;
    updated_at: string;
}
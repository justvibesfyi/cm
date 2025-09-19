export interface Employee {
    id: string;
    email: string;
    onboarded: number;
    first_name: string;
    last_name: string;
    avatar: string;
    company_id: number;
    role: string;
}

export interface Company {
    id: number;
    name: string;
    description: string;
    icon: string | null;
}

export interface Customer {
    id: number;
    name: string;
    avatar: string;
    platform: string;
    customer_id: string;
}

export interface Message {
    id: number;
    content: string;
    created_at: string;
    employee_id: string | null;
    customer_id: number | null;
}

export interface Integration {
    platform: string;
    company_id: number;
    api_key: string;
}

export type Platform = 'zalo' | 'discord' | 'telegram' | 'whatsapp' | 'email';
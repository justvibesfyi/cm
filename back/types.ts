export interface Employee {
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
}

export interface Message {
    id: number;
    content: string;
    created_at: string;
    employee_id: string | null;
    customer_id: number | null;
}

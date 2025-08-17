interface Job {
    job_id: string;
    job_type: string;
    title: string;
    city: string;
    short_term_settlement_work_day: string | null;
    short_term_settlement_amount: number | string | null;
    long_term_settlement_work_day: string | null;
    long_term_settlement_amount: number | string | null;
}
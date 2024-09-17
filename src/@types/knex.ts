declare module 'knex/types/tables' {
    interface Tables {
        users: {
            id: string;
            name: string;
            email: string;
            password: string;
            enable: boolean;
        }
    }
}
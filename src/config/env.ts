import 'dotenv/config'

const appEnvs = {
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    HASH_SALT: Number(process.env.HASH_SALT),
    JWT_SECRET: process.env.JWT_SECRET as string
}

export default appEnvs
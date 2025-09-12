const environment = {
    app: {
        port: parseInt(process.env.PORT || '3000'),
    },
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        apiKey: process.env.FIREBASE_API_KEY,
    },
    graphql: {
        depthLimit: process.env.GRAPHQL_DEPTH_LIMIT || 5,
    },
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'postgres',
    },
}

export default environment;
// Script to test MongoDB Atlas connection
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testMongoDBConnection() {
    console.log('Testing MongoDB Atlas connection...');

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error('ERROR: MONGODB_URI environment variable is not defined in .env.local file');
        process.exit(1);
    }

    // Log connection string (with password redacted)
    const redactedURI = MONGODB_URI.replace(
        /(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/,
        '$1$2:****@'
    );
    console.log(`Using connection string: ${redactedURI}`);

    try {
        // MongoDB Atlas optimized connection options
        const opts = {
            serverSelectionTimeoutMS: 15000,  // 15 seconds
            connectTimeoutMS: 15000,          // 15 seconds
            socketTimeoutMS: 60000,           // 60 seconds
            family: 4,                        // Use IPv4, skip trying IPv6
            maxPoolSize: 10,                  // Limit connection pool size
            retryWrites: true,                // Enable retry for write operations
            retryReads: true,                 // Enable retry for read operations
        };

        console.log('Connecting to MongoDB Atlas...');
        const conn = await mongoose.connect(MONGODB_URI, opts);

        console.log('✅ Connected to MongoDB Atlas successfully!');
        console.log(`Database name: ${conn.connection.db.databaseName}`);

        // List collections
        console.log('Collections in database:');
        const collections = await conn.connection.db.listCollections().toArray();
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        // Close connection
        await mongoose.disconnect();
        console.log('Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Atlas connection error:', error.message);

        // Provide more specific error diagnostics
        if (error.message.includes('ECONNREFUSED')) {
            console.error('Diagnosis: MongoDB Atlas server is not accessible - check network connectivity');
        } else if (error.message.includes('Authentication failed')) {
            console.error('Diagnosis: Authentication failed - check username and password in connection string');
        } else if (error.message.includes('timed out')) {
            console.error('Diagnosis: Connection timed out - check network or firewall settings');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('Diagnosis: Hostname not found - check connection string format');
        } else if (error.message.includes('bad auth')) {
            console.error('Diagnosis: Authentication failed - check database name and credentials');
        } else if (error.message.includes('IP address is not whitelisted') || error.message.includes('Could not connect to any servers')) {
            console.error('\n🚨 IP WHITELIST ERROR: Your current IP address needs to be added to MongoDB Atlas whitelist.');
            console.error('\nTo fix this issue:');
            console.error('1. Log in to MongoDB Atlas: https://cloud.mongodb.com');
            console.error('2. Select your cluster');
            console.error('3. Go to Network Access in the left sidebar');
            console.error('4. Click "Add IP Address" button');
            console.error('5. Click "Add Current IP Address" or manually enter your IP');
            console.error('6. Click "Confirm"\n');

            // Try to get the current IP address
            try {
                const https = require('https');
                console.log('Attempting to determine your current public IP address...');

                https.get('https://api.ipify.org', (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        console.log(`Your public IP address appears to be: ${data}`);
                        console.log('Add this IP to your MongoDB Atlas whitelist.\n');
                    });
                }).on('error', (err) => {
                    console.log('Could not determine your IP address automatically.');
                });
            } catch (ipError) {
                // Ignore errors in getting IP
            }
        } else {
            console.error('Diagnosis: Check connection string format, network connectivity, and credentials');
        }

        process.exit(1);
    }
}

testMongoDBConnection(); 
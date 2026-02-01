import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore, Timestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, process.env.VITE_FIREBASE_DATABASE_URL);

// Function to parse CSV
function parseCSV(csvContent) {
    const lines = csvContent.trim().split("\n");
    const headers = lines[0].split(",");
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = [];
        let currentValue = "";
        let insideQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === "," && !insideQuotes) {
                values.push(currentValue.trim());
                currentValue = "";
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim());

        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index].replace(/^"|"$/g, "");
            });
            result.push(row);
        }
    }

    return result;
}

// Function to parse date string
function parseDate(dateStr) {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return null;
        }
        return Timestamp.fromDate(date);
    } catch {
        return null;
    }
}

// Function to get issuer logo URL
function getIssuerLogo(source) {
    const logos = {
        Microsoft:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
        HackerRank: "https://hrcdn.net/fcore/assets/favicon-ddc852f75a.png",
        SoloLearn: "https://www.sololearn.com/Images/favicon.ico",
        "Great Learning": "https://www.mygreatlearning.com/favicon.svg",
        Udemy: "https://www.udemy.com/staticx/udemy/images/v7/android-chrome-192x192.png",
        Guvi: "https://www.guvi.in/web-build/images/favicons/android-chrome-192x192.png",
        Coursera: "https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-194x194.png",
        Amcat: "https://d13dtqinv406lk.cloudfront.net/laravel-images/favicon.png",
        Google: "https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico",
        IBM: "https://www.ibm.com/favicon.ico",
        Sanfoundry: "https://www.sanfoundry.com/apple-touch-icon.png",
        StudySection: "https://www.studysection.com/favicon.ico",
        Cybrary: "https://cdn.prod.website-files.com/63eef15e3ff8fd318e9a6888/646551ba0901c32b9639d05e_cybrary%20favicon.png",
        Accenture:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0ercDncGsEV9NkGdp78EyagH6U3ZFKiLyfQ&s",
        TCS: "https://www.tcs.com/etc.clientlibs/tcs/clientlibs/clientlib-site/resources/images/tcs_favicon_32.png",
    };
    return logos[source] || "https://placehold.co/200?text=PROVIDER";
}

// Function to get thumbnail URL (badge image)
function getThumbnailUrl(source, title) {
    if (source === "Microsoft") {
        if (title.toLowerCase().includes("expert")) return "https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-expert-badge.svg"
        if (title.toLowerCase().includes("associate")) return "https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-associate-badge.svg"
        return "https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-fundamentals-badge.svg"
    }
    return "https://img.freepik.com/free-vector/grunge-certified-seal-stamp-rubber-look_78370-664.jpg";
}

// Function to determine if certification is enterprise
function isEnterpriseCert(source) {
    const enterpriseIssuers = ["Microsoft", "Google", "AWS", "GitHub", "IBM", "Oracle", "Azure"];
    return enterpriseIssuers.some((issuer) => source.includes(issuer));
}

// Function to extract skills from title and source
function extractSkills(title, source) {
    const skills = [];
    const titleLower = title.toLowerCase();

    // Programming languages
    if (titleLower.includes("python")) skills.push("Python");
    if (titleLower.includes("javascript")) skills.push("JavaScript");
    if (titleLower.includes("java")) skills.push("Java");
    if (titleLower.includes("c#")) skills.push("C#");
    if (titleLower.includes("sql")) skills.push("SQL");
    if (titleLower.includes("html")) skills.push("HTML");
    if (titleLower.includes("css")) skills.push("CSS");
    if (titleLower.includes("react")) skills.push("React");

    // Cloud & DevOps
    if (titleLower.includes("azure")) skills.push("Azure");
    if (titleLower.includes("devops")) skills.push("DevOps");
    if (titleLower.includes("cosmos")) skills.push("Cosmos DB");

    // Other technologies
    if (titleLower.includes("git")) skills.push("Git");
    if (titleLower.includes("django")) skills.push("Django");
    if (titleLower.includes("data")) skills.push("Data Analysis");
    if (titleLower.includes("ai") || titleLower.includes("artificial intelligence")) skills.push("AI");
    if (titleLower.includes("machine learning")) skills.push("Machine Learning");

    // Add source as a skill if it's a major platform
    if (["Microsoft", "Google", "AWS", "IBM"].includes(source)) {
        skills.push(source);
    }

    return [...new Set(skills)];
}

// Function to generate description
function generateDescription(row) {
    let description = `${row.Title} certification`;

    if (row.SubSource && row.SubSource !== row.Source) {
        description += ` from ${row.SubSource}`;
    }

    description += ` issued by ${row.Source}`;

    if (row.Grade && row.Grade !== "100%") {
        description += ` with a grade of ${row.Grade}`;
    }

    description += ".";

    return description;
}

// Main import function
async function importCertifications(csvFilePath) {
    try {
        console.log("Reading CSV file...");
        const csvContent = readFileSync(csvFilePath, "utf-8");

        console.log("Parsing CSV...");
        const rows = parseCSV(csvContent);
        console.log(`Found ${rows.length} certifications to import`);

        const certificationsRef = collection(db, "certifications");

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            console.log(`\nProcessing ${i + 1}/${rows.length}: ${row.Title}`);

            const certification = {
                title: row.Title,
                issuer: row.Source,
                issuerLogo: getIssuerLogo(row.Source),
                issueDate: parseDate(row.IssuedOn),
                expiryDate: null,
                credentialId: row.CredentialId || "",
                credentialUrl: row.CredentialURL || "",
                thumbnailUrl: getThumbnailUrl(row.Source, row.Title),
                description: generateDescription(row),
                skills: extractSkills(row.Title, row.Source),
                isEnterprise: isEnterpriseCert(row.Source),
                isPublished: true,
                order: rows.length - i, // Reverse order so most recent are first
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            try {
                const docRef = await addDoc(certificationsRef, certification);
                console.log(`✓ Added: ${row.Title} (ID: ${docRef.id})`);
            } catch (error) {
                console.error(`✗ Failed to add ${row.Title}:`, error);
            }

            // Add a small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        console.log("\n✓ Import completed!");
        process.exit(0);
    } catch (error) {
        console.error("Error importing certifications:", error);
        process.exit(1);
    }
}

// Run the import
const csvFilePath = process.argv[2] || join(__dirname, "..", "data", "certs.csv");
console.log(`Starting import from: ${csvFilePath}`);
importCertifications(csvFilePath);

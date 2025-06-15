import environment from "@/config/environment";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const { firebase } = environment;

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: firebase.apiKey,
	authDomain: firebase.authDomain,
	projectId: firebase.projectId,
	storageBucket: firebase.storageBucket,
	messagingSenderId: firebase.messagingSenderId,
	appId: firebase.appId,
	measurementId: firebase.measurementId,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app, firebase.databaseURL);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, db, storage };

import { FirebaseError } from "firebase/app";
import type { RegisterValues } from "../types/type";
import { auth } from '../../../lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export class EmailAlreadyInUseError extends Error {}

export async function registerUser({name, email, password}: RegisterValues) {
    try {
        const {user} = await createUserWithEmailAndPassword(auth, email.trim(), password)
        await updateProfile(user, { displayName: name.trim()})
        return user
    } catch (error){
        if(error instanceof FirebaseError && error.code === 'auth/email-already-in.use'){
            throw new EmailAlreadyInUseError()
        }
        throw error
    }
}
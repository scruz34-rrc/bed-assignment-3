export type FirestoreDataTypes = 
    | string 
    | number 
    | boolean 
    | Date 
    | null 
    | { [key: string]: FirestoreDataTypes } 
    | FirestoreDataTypes[];
import { NewDiary } from "../types";

type Fields = { title: unknown, text: unknown, priv: unknown}
const toNewDiary= ({ title, text, priv } : Fields): NewDiary => {
    const newDiary: NewDiary = {
        title: parseText(title),
        text: parseText(text),
        priv: parseBoolean(priv)
    }
    return newDiary
}

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String
}

const parseBoolean = (priv: unknown): boolean => {
    if (typeof priv !== "boolean") {
        throw new Error("incorrect or missing boolean")
    }
    return priv
}


const parseText = (text: unknown): string => {
    if (!text || !isString(text)) {
        throw new Error('incorrect or missing text ' + text)
    }
    return text
}

export default toNewDiary
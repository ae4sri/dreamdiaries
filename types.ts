export interface DiaryEntryType {
    title: string
    text: string
    date: string
    user: string
    priv: boolean
}

export interface UserType {
    username: string
    passwordHash: string
    diaries: DiaryEntryType[]
}

export type NewDiary = Omit<DiaryEntryType, 'user' | 'date'>
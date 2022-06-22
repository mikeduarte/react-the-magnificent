
export interface Instruction {
    title: string,
    message: string,
    button: string
}

export interface Instructions {
    [key: number]: Instruction
}

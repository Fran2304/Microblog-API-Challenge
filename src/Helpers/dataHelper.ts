export const fixId = (idString: string) => {
    const pId = parseInt(idString)
    if (isNaN(pId)) {
        throw new Error('ERROR: id is not a number')
    }
    return pId
}

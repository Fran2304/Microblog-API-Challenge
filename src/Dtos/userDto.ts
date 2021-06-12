/* eslint-disable no-unused-vars */
export class UserDto {
    constructor(
        public id: number,
        public email: string,
        public nickname: string
    ) {}
}

export class UserUpdateDto {
    public email: string
    public nickname: string
    public firstName: string
    public lastName: string
    public bio: string

    constructor(
    ) {
        this.email = ''
        this.nickname = ''
        this.firstName = ''
        this.lastName = ''
        this.bio = ''
    }
}

/* eslint-disable no-unused-vars */
export class UserDto {
    constructor(
        public id: number,
        public email: string,
        public nickname: string
    ) {}
}

export class UserUpdateDto {
    email: string
    nickname: string
    firstName: string
    lastName: string

    bio: string

    constructor(
        pemail: string,
        pnickname: string,
        pfirstname: string,
        plastname: string,
        pbio: string
    ) {
        this.email = pemail
        this.nickname = pnickname
        this.firstName = pnickname
        this.lastName = pnickname
        this.bio = pnickname
    }
}

/* eslint-disable no-unused-vars */
export class ErrorHandler extends Error {
    constructor(
        public message: string,
        public status: number,
        public detail: string
    ) {
        super()
    }
}

// Error yang aman ditampilkan ke pengguna. Route handler / Server Action menangkapnya
// dan meneruskan `message` + `status`; error lain dianggap bug dan jadi 500.
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

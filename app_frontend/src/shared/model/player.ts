export class Player {
  private name!: string;
  private intra_id!: string;

  constructor (name: string) {
    this.name = name;
  }

  getName (): string {
    return this.name;
  }
}

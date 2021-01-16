export default interface Command {
  name: string;
  description: string;
  fn: Function;
}

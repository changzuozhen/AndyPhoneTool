export class Terminal {
  private previousTitle = 'aptool';

  clear(): void {
    process.stdout.write('\x1b[2J\x1b[0f');
  }

  setTitle(title: string): void {
    process.stdout.write(`\x1b]0;${title}\x07`);
  }

  restoreTitle(): void {
    this.setTitle(this.previousTitle);
  }

  async withLongTask<T>(title: string, fn: () => Promise<T>): Promise<T> {
    this.previousTitle = `aptool`;
    this.clear();
    this.setTitle(`⏳ aptool: ${title}`);
    try {
      const result = await fn();
      this.setTitle(`✓ aptool: ${title}`);
      return result;
    } catch (error) {
      this.setTitle(`✗ aptool: ${title}`);
      throw error;
    }
  }
}

export const terminal = new Terminal();

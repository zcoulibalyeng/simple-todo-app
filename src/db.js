// Minimal database shim for the fixture. Not a real driver.

export async function createConnection() {
  return {
    async query(sql) {
      console.log('[sql]', sql);
      return [];
    }
  };
}

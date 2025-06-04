import * as bcrypt from 'bcrypt';

export async function HashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error: unknown) {
    throw new Error('Error hashing password');
  }
}

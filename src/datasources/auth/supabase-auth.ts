import { UserRole } from "@prisma/client";
import {
  createClient,
  SupabaseClient,
  User,
  AuthResponse,
} from "@supabase/supabase-js";

export class SupabaseAuthDataSource {
  private supabase: SupabaseClient;

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  /**
   * Sign up a new user
   */
  async signUp(
    email: string,
    password: string,
    role: UserRole
  ): Promise<AuthResponse> {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });
  }

  /**
   * Sign in a user with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  /**
   * Sign out the current user
   */
  async signOut(jwtToken: string): Promise<{ error: Error | null }> {
    return await this.supabase.auth.admin.signOut(jwtToken);
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<{
    data: { user: User | null };
    error: Error | null;
  }> {
    return await this.supabase.auth.getUser();
  }

  /**
   * Get the current session
   */
  async getSession() {
    return await this.supabase.auth.getSession();
  }

  /**
   * Reset password for a user
   */
  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email);
  }

  /**
   * Update user data
   */
  async updateUser(attributes: {
    email?: string;
    password?: string;
    data?: object;
  }) {
    return await this.supabase.auth.updateUser(attributes);
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: "google" | "github" | "facebook") {
    return await this.supabase.auth.signInWithOAuth({
      provider,
    });
  }

  /**
   * Get user from access token
   */
  async getUser(accessToken: string) {
    return await this.supabase.auth.getUser(accessToken);
  }

  /**
   * Set session data
   */
  async setSession(access_token: string, refresh_token: string) {
    return await this.supabase.auth.setSession({
      access_token,
      refresh_token,
    });
  }
}

// Export a singleton instance
export const supabaseAuth = new SupabaseAuthDataSource();

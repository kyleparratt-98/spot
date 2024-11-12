"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAuth = exports.SupabaseAuthDataSource = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class SupabaseAuthDataSource {
    constructor() {
        // Initialize Supabase client
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    }
    /**
     * Sign up a new user
     */
    signUp(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.signUp({
                email,
                password,
            });
        });
    }
    /**
     * Sign in a user with email and password
     */
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.signInWithPassword({
                email,
                password,
            });
        });
    }
    /**
     * Sign out the current user
     */
    signOut(jwtToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.admin.signOut(jwtToken);
        });
    }
    /**
     * Get the current user
     */
    getCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.getUser();
        });
    }
    /**
     * Get the current session
     */
    getSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.getSession();
        });
    }
    /**
     * Reset password for a user
     */
    resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.resetPasswordForEmail(email);
        });
    }
    /**
     * Update user data
     */
    updateUser(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.updateUser(attributes);
        });
    }
    /**
     * Sign in with OAuth provider
     */
    signInWithOAuth(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.signInWithOAuth({
                provider,
            });
        });
    }
    /**
     * Get user from access token
     */
    getUser(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.getUser(accessToken);
        });
    }
    /**
     * Set session data
     */
    setSession(access_token, refresh_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.supabase.auth.setSession({
                access_token,
                refresh_token,
            });
        });
    }
}
exports.SupabaseAuthDataSource = SupabaseAuthDataSource;
// Export a singleton instance
exports.supabaseAuth = new SupabaseAuthDataSource();

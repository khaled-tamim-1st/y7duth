import type { APIRoute } from 'astro';
import { setSessionCookie } from '@/lib/auth';
import { getDb, adminUsersTable } from '@/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const defaultUser = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || 'kuwait@admin2026';

    let isAuthenticated = false;
    let adminName = 'مشرف التحرير';
    let adminRole = 'admin';

    // 1. Check against bootstrap environment credentials first
    if (username.trim() === defaultUser && password === defaultPass) {
      isAuthenticated = true;
    } else {
      // 2. Check against Supabase Database if connected
      const db = getDb();
      if (db) {
        const users = await db
          .select()
          .from(adminUsersTable)
          .where(eq(adminUsersTable.username, username.trim()))
          .limit(1);

        if (users.length > 0) {
          const user = users[0];
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (isValid) {
            isAuthenticated = true;
            adminName = user.name;
            adminRole = user.role;
          }
        }
      }
    }

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Set secure session cookie
    setSessionCookie(cookies, {
      username: username.trim(),
      name: adminName,
      role: adminRole,
      loggedInAt: Date.now(),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login API error:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ في الخادم أثناء تسجيل الدخول' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

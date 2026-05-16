import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z, ZodError } from "zod";
import { auth } from "./middleware/auth";
import { createAiPlan } from "./services/ai";
import { pool, query } from "./db/pool";

const app = express();

const clientOrigins = (() => {
  const fromEnv = (process.env.CLIENT_URLS || "http://localhost:5173,https://sharebite.vercel.app")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const single = process.env.CLIENT_URL?.trim();
  if (single && !fromEnv.includes(single)) fromEnv.push(single);
  return fromEnv;
})();

app.use(cors({ origin: clientOrigins }));
app.use(express.json());

async function ensureRuntimeSchema() {
  await query(`
    ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_phone TEXT;
    ALTER TABLE claims ADD COLUMN IF NOT EXISTS approval_code TEXT;
    ALTER TABLE claims DROP CONSTRAINT IF EXISTS claims_status_check;
    ALTER TABLE claims ADD CONSTRAINT claims_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'completed'));
  `);
}

function createApprovalCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const sign = (user: { id: unknown; name: string; email: string; role: string; location: string }) =>
  jwt.sign(
    { id: String(user.id), name: user.name, email: user.email, role: user.role, location: user.location },
    process.env.JWT_SECRET || "dev",
    { expiresIn: "7d" }
  );

const loginBody = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

const registerBody = z.object({
  name: z.string().trim().min(2, "Enter your full name or organization name."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(6),
  role: z.enum(["donor", "receiver"]),
  location: z.string().trim().min(2, "Enter your pickup or delivery location.")
});

function formatZodIssues(err: ZodError) {
  return err.issues.map((i) => `${(i.path && i.path.length ? i.path.join(".") : "body")}: ${i.message}`).join("; ");
}

function looksLikeDbFailure(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  return /relation|does not exist|ECONNREFUSED|ENOTFOUND|password authentication|timeout|pg_hba|SSL required|database/i.test(msg);
}

app.get("/health", (_req, res) => res.json({ ok: true, name: "FoodShare API" }));

app.post("/auth/register", async (req, res, next) => {
  try {
    const parsed = registerBody.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({
        message: formatZodIssues(parsed.error),
        hint: 'Send JSON with Content-Type: application/json, e.g. { "name","email","password","role","location" }.'
      });
    }
    const body = parsed.data;

    const existing = await query<any>("SELECT id FROM users WHERE lower(trim(email)) = $1", [body.email]);
    if (existing.rowCount) {
      return res.status(409).json({ message: "That email is already registered. Log in or use another email." });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const result = await query<any>(
      `INSERT INTO users (name, email, password_hash, role, location)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, name, email, role, location`,
      [body.name, body.email, passwordHash, body.role, body.location]
    );

    const row = result.rows[0];
    res.status(201).json({ user: { ...row, id: String(row.id) }, token: sign(row) });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/login", async (req, res, next) => {
  try {
    const parsed = loginBody.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({
        message: formatZodIssues(parsed.error),
        hint: 'Send JSON: { "email": "you@example.com", "password": "…" } with header Content-Type: application/json.'
      });
    }
    const { email, password } = parsed.data;

    const result = await query<any>("SELECT * FROM users WHERE lower(trim(email)) = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = {
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location
    };
    res.json({ user: safeUser, token: sign(safeUser) });
  } catch (err) {
    next(err);
  }
});

app.get("/me", auth, (req, res) => res.json({ user: req.user }));

app.get("/donations", auth, async (req, res) => {
  const scope = String(req.query.scope || "dashboard");
  const scopedWhere =
    scope === "my"
      ? "d.donor_id=$1"
      : scope === "available"
        ? "d.status='available' AND d.expires_at > now()"
        : "(d.status='available' AND d.expires_at > now()) OR d.donor_id=$1";
  const params = scope === "available" ? [] : [req.user!.id];
  const result = await query<any>(
    `SELECT d.*, u.name AS donor_name
     FROM donations d
     JOIN users u ON u.id=d.donor_id
     WHERE ${scopedWhere}
     ORDER BY d.created_at DESC`,
    params
  );
  res.json({ donations: result.rows });
});

app.get("/claims", auth, async (req, res) => {
  const params = [req.user!.id];
  const where =
    req.user!.role === "receiver"
      ? "c.receiver_id=$1"
      : "d.donor_id=$1";

  const result = await query<any>(
    `SELECT
      c.id,
      c.status,
      c.ai_plan,
      c.created_at,
      d.id AS donation_id,
      d.title,
      d.category,
      d.quantity,
      d.location,
      d.pickup_window,
      d.expires_at,
      d.status AS donation_status,
      donor.name AS donor_name,
      receiver.name AS receiver_name,
      receiver.location AS receiver_location
     FROM claims c
     JOIN donations d ON d.id=c.donation_id
     JOIN users donor ON donor.id=d.donor_id
     JOIN users receiver ON receiver.id=c.receiver_id
     WHERE ${where}
     ORDER BY c.created_at DESC`,
    params
  );

  res.json({ claims: result.rows });
});

app.post("/donations", auth, async (req, res) => {
  if (req.user!.role !== "donor") return res.status(403).json({ message: "Only donors can add food" });
  const body = z
    .object({
      title: z.string().min(2),
      category: z.string().min(2),
      quantity: z.number().int().positive(),
      location: z.string().min(2),
      donorPhone: z.string().trim().min(7, "Enter a donor phone number for receiver coordination."),
      pickupWindow: z.string().min(2),
      expiresAt: z.string(),
      notes: z.string().optional()
    })
    .parse(req.body);

  const result = await query<any>(
    `INSERT INTO donations (donor_id, title, category, quantity, location, donor_phone, pickup_window, expires_at, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [req.user!.id, body.title, body.category, body.quantity, body.location, body.donorPhone, body.pickupWindow, body.expiresAt, body.notes]
  );

  res.status(201).json({ donation: result.rows[0] });
});

app.post("/donations/:id/claim", auth, async (req, res) => {
  if (req.user!.role !== "receiver") return res.status(403).json({ message: "Only receivers can claim food" });

  const donationResult = await query<any>(
    `SELECT d.*, u.location AS donor_base FROM donations d JOIN users u ON u.id=d.donor_id WHERE d.id=$1`,
    [req.params.id]
  );
  const donation = donationResult.rows[0];
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  if (donation.status !== "available") {
    return res.status(409).json({ message: "This food is no longer available. Refresh the feed for available listings." });
  }

  const existingClaim = await query<any>(
    "SELECT id, status FROM claims WHERE donation_id=$1 AND receiver_id=$2 AND status IN ('pending','approved')",
    [donation.id, req.user!.id]
  );
  if (existingClaim.rowCount) {
    return res.status(409).json({ message: "You already have an active request for this food. Wait for donor approval." });
  }

  const aiPlan = await createAiPlan({
    origin: donation.location,
    destination: req.user!.location,
    food: donation.title,
    quantity: donation.quantity,
    pickupWindow: donation.pickup_window
  });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const claim = await client.query<any>(
      `INSERT INTO claims (donation_id, receiver_id, status, ai_plan) VALUES ($1,$2,'pending',$3) RETURNING *`,
      [donation.id, req.user!.id, aiPlan]
    );
    await client.query("COMMIT");
    res.status(201).json({
      claim: claim.rows[0],
      aiPlan,
      message: `Claim request sent to ${donation.donor_phone || "the donor"}. Waiting for donor approval.`
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

app.post("/claims/:id/approve", auth, async (req, res) => {
  if (req.user!.role !== "donor") return res.status(403).json({ message: "Only donors can approve requests" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const claimResult = await client.query<any>(
      `SELECT c.*, d.donor_id, d.status AS donation_status
       FROM claims c
       JOIN donations d ON d.id=c.donation_id
       WHERE c.id=$1 AND d.donor_id=$2
       FOR UPDATE`,
      [req.params.id, req.user!.id]
    );
    const claim = claimResult.rows[0];
    if (!claim) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Claim request not found" });
    }
    if (claim.status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "This request has already been handled." });
    }
    if (claim.donation_status !== "available") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "This food is no longer available for approval." });
    }

    const approvalCode = createApprovalCode();
    await client.query("UPDATE donations SET status='claimed' WHERE id=$1", [claim.donation_id]);
    const approved = await client.query<any>("UPDATE claims SET status='approved', approval_code=$2 WHERE id=$1 RETURNING *", [
      claim.id,
      approvalCode
    ]);
    await client.query("UPDATE claims SET status='rejected' WHERE donation_id=$1 AND id<>$2 AND status='pending'", [claim.donation_id, claim.id]);
    await client.query("COMMIT");
    res.json({
      claim: approved.rows[0],
      approvalCode,
      message: `Receiver claim approved. Share pickup code ${approvalCode} with the receiver.`
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

app.post("/claims/:id/reject", auth, async (req, res) => {
  if (req.user!.role !== "donor") return res.status(403).json({ message: "Only donors can reject requests" });
  const result = await query<any>(
    `UPDATE claims c
     SET status='rejected'
     FROM donations d
     WHERE c.id=$1 AND c.donation_id=d.id AND d.donor_id=$2 AND c.status='pending'
     RETURNING c.*`,
    [req.params.id, req.user!.id]
  );
  if (!result.rowCount) return res.status(404).json({ message: "Pending claim request not found" });
  res.json({ claim: result.rows[0], message: "Receiver claim rejected." });
});

app.post("/claims/:id/verify-code", auth, async (req, res) => {
  if (req.user!.role !== "receiver") return res.status(403).json({ message: "Only receivers can verify pickup codes" });
  const body = z.object({ code: z.string().trim().regex(/^\d{6}$/, "Enter the 6 digit pickup code.") }).parse(req.body);

  const result = await query<any>(
    `UPDATE claims
     SET status='completed'
     WHERE id=$1 AND receiver_id=$2 AND status='approved' AND approval_code=$3
     RETURNING *`,
    [req.params.id, req.user!.id, body.code]
  );

  if (!result.rowCount) {
    return res.status(400).json({ message: "Invalid code or this claim is not ready for code verification." });
  }

  res.json({ claim: result.rows[0], message: "Code verified. Food successfully claimed." });
});

app.post("/ai/estimate", auth, async (req, res) => {
  const body = z
    .object({
      origin: z.string(),
      destination: z.string(),
      food: z.string(),
      quantity: z.number(),
      pickupWindow: z.string()
    })
    .parse(req.body);
  res.json({ plan: await createAiPlan(body) });
});

app.get("/analytics/overview", auth, async (_req, res) => {
  const result = await query<any>(`
    SELECT
      COUNT(*)::int AS total_donations,
      COALESCE(SUM(quantity),0)::int AS meals_shared,
      COALESCE(SUM(quantity) FILTER (WHERE status='available'),0)::int AS meals_available,
      COALESCE(SUM(quantity) FILTER (WHERE status='claimed'),0)::int AS meals_claimed,
      COUNT(*) FILTER (WHERE status='claimed')::int AS active_claims
    FROM donations
  `);
  const rows = result.rows[0];
  const baseMeals = Number(rows.meals_shared || 0);
  const trendBase = Math.max(baseMeals, 42);

  res.json({
    ...rows,
    co2SavedKg: Math.round(baseMeals * 0.42),
    monthlyTrend: [
      { month: "Jan", meals: Math.max(18, Math.round(trendBase * 0.48)) },
      { month: "Feb", meals: Math.max(24, Math.round(trendBase * 0.62)) },
      { month: "Mar", meals: Math.max(31, Math.round(trendBase * 0.74)) },
      { month: "Apr", meals: Math.max(36, Math.round(trendBase * 0.88)) },
      { month: "May", meals: Math.max(baseMeals, trendBase) }
    ]
  });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: formatZodIssues(error) });
  }
  if (looksLikeDbFailure(error)) {
    console.error("Database error:", error);
    return res.status(503).json({
      message:
        "Database unavailable or schema missing. On Railway set DATABASE_URL, then run `npm run db:setup` from the backend folder against that database."
    });
  }
  const message = error instanceof Error ? error.message : "Server error";
  console.error("Unhandled error:", error);
  res.status(500).json({ message });
});

const port = Number(process.env.PORT || 5000);
ensureRuntimeSchema()
  .catch((error) => {
    console.error("Runtime schema setup failed:", error);
  })
  .finally(() => {
    app.listen(port, () => console.log(`FoodShare API running on http://localhost:${port}`));
  });

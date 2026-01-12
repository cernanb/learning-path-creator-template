import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/client'

/**
 * Health check endpoint
 *
 * This endpoint is useful for:
 * - Monitoring services (uptime checks)
 * - Load balancers (verify server is responding)
 * - CI/CD pipelines (verify deployment succeeded)
 * - Debugging (quick way to check if server is running)
 *
 * Route: GET /api/health
 *
 * Returns:
 * - 200: Server is healthy
 * - 503: Server is unhealthy (database connection failed, etc.)
 */
export async function GET() {
  try {
    // Basic health check
    const timestamp = new Date().toISOString()
    const environment = process.env.NODE_ENV || 'unknown'

    // Optional: Check database connection
    // Uncomment this to verify database is accessible
    const supabase = createServiceClient()
    const { error: dbError } = await supabase.from('profiles').select('id').limit(1)

    if (dbError) {
      console.error('Database health check failed:', dbError)
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp,
          environment,
          checks: {
            server: 'ok',
            database: 'failed',
          },
          error: 'Database connection failed',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp,
      environment,
      checks: {
        server: 'ok',
        database: 'ok',
      },
    })
  } catch (error) {
    console.error('Health check error:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

/**
 * USAGE EXAMPLES:
 *
 * 1. Quick manual check:
 *    curl http://localhost:3000/api/health
 *
 * 2. In a monitoring service (like UptimeRobot):
 *    GET https://yourapp.vercel.app/api/health
 *    Expected: 200 status code and {"status":"healthy"}
 *
 * 3. In CI/CD pipeline:
 *    #!/bin/bash
 *    response=$(curl -s http://localhost:3000/api/health)
 *    status=$(echo $response | jq -r '.status')
 *    if [ "$status" != "healthy" ]; then
 *      echo "Health check failed"
 *      exit 1
 *    fi
 *
 * 4. In Next.js middleware or other API routes:
 *    const health = await fetch('http://localhost:3000/api/health')
 *    const data = await health.json()
 *    if (data.status !== 'healthy') {
 *      // Handle unhealthy state
 *    }
 */

/**
 * EXTENDING THIS ENDPOINT:
 *
 * You can add more health checks:
 *
 * 1. Check external APIs:
 *    const openaiHealth = await fetch('https://api.openai.com/v1/models')
 *    checks.openai = openaiHealth.ok ? 'ok' : 'failed'
 *
 * 2. Check Redis/Cache:
 *    const redis = await redisClient.ping()
 *    checks.redis = redis === 'PONG' ? 'ok' : 'failed'
 *
 * 3. Check disk space:
 *    const diskSpace = await checkDiskSpace()
 *    checks.disk = diskSpace.free > 1000000 ? 'ok' : 'low'
 *
 * 4. Return detailed version info:
 *    version: process.env.VERCEL_GIT_COMMIT_SHA || 'local'
 */

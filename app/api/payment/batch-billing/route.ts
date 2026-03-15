import { NextRequest, NextResponse } from 'next/server';
import { processBatchBilling } from '@/lib/billing';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await processBatchBilling();
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      processed: result.processed,
      succeeded: result.succeeded,
      failed: result.failed,
      details: result.results
    });

  } catch (err: any) {
    console.error('Batch API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

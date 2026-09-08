import { NextResponse } from 'next/server';
import { getApplicationMessages } from '@/lib/db/queries';
import { sendApplicationMessageAction } from '@/lib/db/actions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const messages = await getApplicationMessages(applicationId);
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    const body = await request.json();

    if (!applicationId || !body.message || !body.senderWorkspaceId) {
      return NextResponse.json({ error: 'Missing required message parameters' }, { status: 400 });
    }

    const res = await sendApplicationMessageAction({
      applicationId,
      senderWorkspaceId: body.senderWorkspaceId,
      senderName: body.senderName || 'Member',
      senderRole: body.senderRole || 'community',
      message: body.message,
    });

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to send message' }, { status: 500 });
  }
}

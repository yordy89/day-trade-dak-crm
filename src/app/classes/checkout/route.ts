import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user details
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user details' },
        { status: 401 }
      );
    }

    const user = await userResponse.json();

    // Create checkout session through API
    const checkoutResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/classes-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user._id,
      }),
    });

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.json();
      return NextResponse.json(
        { error: error.message || 'Failed to create checkout session' },
        { status: checkoutResponse.status }
      );
    }

    const checkoutData = await checkoutResponse.json();
    return NextResponse.json(checkoutData);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
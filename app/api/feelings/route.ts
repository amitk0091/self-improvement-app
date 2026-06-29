import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get today's feelings entry
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('feelings')
      .select('*')
      .eq('date', today)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message)
    }
    
    return NextResponse.json(data || null)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Create or update feelings entry
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('feelings')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Update feelings entry
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('feelings')
      .update(body)
      .eq('id', body.id)
      .select()
      .single()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
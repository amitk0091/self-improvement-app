import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get all overthoughts
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('overthoughts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Create a new overthought
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('overthoughts')
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

// Update an overthought
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
      .from('overthoughts')
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
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DiaryEntry } from '@/types/db'

// Get today's diary entry
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('entry_date', today)
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

// Create or update diary entry
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.entry_date) {
      return NextResponse.json(
        { error: 'Entry date is required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('diary_entries')
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

// Update diary entry
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
      .from('diary_entries')
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
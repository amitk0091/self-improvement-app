import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get all checklist templates
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('checklist_templates')
      .select('*')
    
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

// Create a new checklist template
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('checklist_templates')
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
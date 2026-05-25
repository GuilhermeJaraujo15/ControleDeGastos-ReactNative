import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pmskphltdelwydljbixa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtc2twaGx0ZGVsd3lkbGpiaXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTY4NTQsImV4cCI6MjA5NTIzMjg1NH0.WMP2LifZAmLabrOWeO7q8CGXsLp63sIWuNU5rUZhzEE'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
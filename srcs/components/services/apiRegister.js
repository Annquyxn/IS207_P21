


const { data, error } = await supabase
  .from('Registration')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()

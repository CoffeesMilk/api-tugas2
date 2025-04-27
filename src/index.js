import { createClient } from '@supabase/supabase-js'

export default {
	async fetch(request, env) {
		const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
		const url = new URL(request.url)
		const idBuku = url.searchParams.get('id_buku')
		const judulBuku = url.searchParams.get('judulcari')

		switch (request.method) {
			case 'GET': {
				if(!judulBuku){
					const { data, error } = await supabase.from('buku').select('*')
				if (error) throw error
				return new Response(JSON.stringify(data), {
					headers: { 'Content-Type': 'application/json' },
				})
				}
				const { data, error } = await supabase.from('buku')
					.select()
  					.eq('judul', judulBuku)
					  if (error) throw error
					  return new Response(JSON.stringify(data), {
						  headers: { 'Content-Type': 'application/json' },
					  })
			}
			case 'POST': {
				const body = await request.formData()
				//const { title, image, description, publisher, language } = body

				const { datatambah, error } = await supabase.from('buku').insert([
					{ 
						judul: body.get('title'), 
						foto: body.get('image'), 
						deskripsi: body.get('description'),  
						penerbit: body.get('publisher'), 
						bahasa: body.get('language')
					},
				])
				.select()
				if (error) throw error
				return new Response(JSON.stringify(datatambah), {
					headers: { 'Content-Type': 'application/json' },
				})
			}

			case 'DELETE': {
				if (!idBuku) {
					return new Response('id_buku is required for DELETE', { status: 400 })
				}
				const { data, error } = await supabase
					.from('buku')
					.delete()
					.eq('id_buku', idBuku)
				if (error) throw error
				return new Response(JSON.stringify(data), {
					headers: { 'Content-Type': 'application/json' },
				})
			}

			default:
				return new Response('Method not allowed', { status: 405 })
		}
	},
}
